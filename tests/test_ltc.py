import numpy as np
from ltc.pid_baseline import PIDController, CascadedPIDFlightController


def test_pid_controller_basic():
    pid = PIDController(kp=2.0, ki=0.1, kd=0.5, output_limit=10.0)
    out1 = pid.compute(error=1.0, dt=0.02)
    out2 = pid.compute(error=0.5, dt=0.02)
    assert isinstance(out1, float)
    assert isinstance(out2, float)
    assert out1 > 0


def test_cascaded_pid_flight_controller():
    controller = CascadedPIDFlightController(mass=1.5, max_thrust=30.0)
    pos_err = np.array([2.0, 0.0, 5.0])
    vel = np.array([0.0, 0.0, 0.0])
    wind = np.array([1.0, 0.0, 0.0])
    
    thrust_cmd, yaw_cmd = controller.compute_control(
        position_error=pos_err,
        velocity=vel,
        wind_estimate=wind,
        yaw_error=0.0,
        dt=0.02
    )
    assert thrust_cmd.shape == (3,)
    assert thrust_cmd[2] > 0 # vertical thrust to climb / hover
    assert np.linalg.norm(thrust_cmd) <= 30.0 + 1e-5


def test_ltc_cell_if_torch():
    try:
        import torch
        from ltc.ltc_cell import LTCCell
        from ltc.ltc_controller import LTCController
        
        cell = LTCCell(input_size=12, hidden_size=16)
        x = torch.zeros(1, 16)
        I = torch.randn(1, 12)
        x_next, tau = cell(x, I, dt=0.02)
        assert x_next.shape == (1, 16)
        assert tau.shape == (1, 16)
        
        ctrl = LTCController(input_size=12, hidden_size=16)
        thrust, yaw = ctrl.compute_control(
            position_error=np.array([1.0, 0.0, 0.0]),
            velocity=np.zeros(3),
            orientation=np.array([1.0, 0.0, 0.0, 0.0]),
            angular_velocity=np.zeros(3),
            wind_estimate=np.zeros(3),
            target_velocity=np.zeros(3),
            dt=0.02
        )
        assert thrust.shape == (3,)
    except ImportError:
        pass


# ---------------------------------------------------------------------------
# LTC controller — added with the rebuilt controller stack
# ---------------------------------------------------------------------------

import torch
from ltc.ltc_controller import LTCFlightController, build_observation, load_or_default
from ltc.expert import PrivilegedExpert
from sim.physics import FlightDynamics


def test_ltc_fits_the_edge_parameter_budget():
    """The proposal commits to under 20k parameters for edge deployment."""
    model = LTCFlightController(hidden_size=48)
    count = model.count_parameters()
    assert count < 20_000, f"{count} parameters exceeds the 20k edge budget"


def test_observation_vector_is_normalised_and_finite():
    obs = build_observation(
        position_error=np.array([500.0, -300.0, 90.0]),   # deliberately huge
        velocity_error=np.array([40.0, 0.0, -12.0]),
        velocity=np.array([25.0, 3.0, 0.0]),
        wind_estimate=np.array([60.0, 0.0, 0.0]),
        body_z=np.array([0.0, 0.0, 1.0]),
    )
    assert obs.shape == (LTCFlightController.INPUT_DIM,)
    assert np.all(np.isfinite(obs))
    # Clipping keeps even absurd inputs inside the trained range
    assert np.all(np.abs(obs) <= 4.0 + 1e-6)


def test_ltc_output_respects_thrust_limit():
    model = LTCFlightController()
    model.reset_hidden(1)

    force, yaw_rate = model.compute_control(
        position_error=np.array([200.0, 200.0, 200.0]),
        velocity=np.zeros(3),
        wind_estimate=np.zeros(3),
        dt=0.02,
    )
    assert np.linalg.norm(force) <= model.max_thrust + 1e-4
    assert abs(yaw_rate) <= model.max_yaw_rate + 1e-6


def test_liquid_state_carries_memory():
    """
    The hidden state must actually influence the output — it is the whole
    reason for choosing this architecture over a feedforward net.
    """
    model = LTCFlightController()
    obs = torch.from_numpy(build_observation(
        np.array([5.0, 0.0, 0.0]), np.zeros(3), np.zeros(3),
        np.array([8.0, 0.0, 0.0]), np.array([0.0, 0.0, 1.0]),
    )).unsqueeze(0)

    with torch.no_grad():
        cold, _ = model(obs, None, 0.02)

        warm_state = torch.zeros(1, model.hidden_size)
        for _ in range(25):
            _, warm_state = model(obs, warm_state, 0.02)
        warm, _ = model(obs, warm_state, 0.02)

    assert not torch.allclose(cold, warm, atol=1e-4), (
        "identical input gave identical output regardless of history — "
        "the recurrent state is not doing anything"
    )


def test_time_constants_respond_to_input():
    """tau(x, I) must vary with the input; a constant tau is just an RNN."""
    cell = LTCFlightController().ltc
    hidden = torch.zeros(1, cell.hidden_size)

    calm = torch.zeros(1, cell.input_size)
    gust = torch.zeros(1, cell.input_size)
    gust[0, 9:12] = 1.0            # large wind-estimate component

    with torch.no_grad():
        tau_calm = cell._compute_tau(hidden, calm)
        tau_gust = cell._compute_tau(hidden, gust)

    assert not torch.allclose(tau_calm, tau_gust, atol=1e-5)
    assert torch.all(tau_calm >= cell.tau_min) and torch.all(tau_calm <= cell.tau_max)


def test_expert_cancels_drag_using_privileged_wind():
    """
    The expert's advantage must come from the wind it is given, or the
    student has nothing to learn that a PID could not.
    """
    expert = PrivilegedExpert()
    still = expert.compute_control(
        position_error=np.zeros(3), velocity=np.zeros(3),
        true_wind=np.zeros(3), dt=0.02)[0]

    expert.reset()
    windy = expert.compute_control(
        position_error=np.zeros(3), velocity=np.zeros(3),
        true_wind=np.array([12.0, 0.0, 0.0]), dt=0.02)[0]

    # A +x wind drags a stationary aircraft downwind (+x), so holding
    # station requires thrusting into the wind (-x). The expert applies that
    # correction immediately from the wind vector, instead of waiting for an
    # integrator to accumulate the position error a PID would need.
    assert windy[0] < still[0] - 0.5

    # And the magnitude should match the drag it is cancelling
    expected_drag = expert.drag_coeff * 12.0 ** 2
    assert abs(abs(windy[0] - still[0]) - expected_drag) < 1.5


def test_controllers_are_interchangeable():
    """LTC and PID must accept the same call, so they can be swapped."""
    from ltc.pid_baseline import CascadedPIDFlightController

    args = dict(
        position_error=np.array([10.0, 2.0, 3.0]),
        velocity=np.array([1.0, 0.0, 0.0]),
        wind_estimate=np.array([4.0, 0.0, 0.0]),
        yaw_error=0.0,
        dt=0.02,
        velocity_setpoint=np.array([5.0, 0.0, 0.0]),
    )

    pid_force, _ = CascadedPIDFlightController().compute_control(**args)
    ltc_force, _ = LTCFlightController().compute_control(**args)

    assert pid_force.shape == ltc_force.shape == (3,)
    assert np.all(np.isfinite(pid_force)) and np.all(np.isfinite(ltc_force))


def test_trained_weights_load_if_present():
    from pathlib import Path

    model, trained = load_or_default("models/ltc_controller.pt")
    if Path("models/ltc_controller.pt").exists():
        assert trained is True
    assert model.count_parameters() < 20_000


def test_untrained_weights_are_reported_not_hidden():
    """
    An untrained network must never silently fly. `load_or_default` reports
    whether weights were found so the caller can fall back and say so.
    """
    _, trained = load_or_default("models/definitely_not_a_real_checkpoint.pt")
    assert trained is False

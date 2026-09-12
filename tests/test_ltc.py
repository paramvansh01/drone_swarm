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

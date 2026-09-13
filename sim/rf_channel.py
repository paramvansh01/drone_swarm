"""
RF channel model for C-DAWN simulation.

Models free-space path loss, terrain occlusion, multipath fading,
and jamming/interference for drone-to-drone communication links.
"""

import numpy as np
from typing import Tuple, Optional


class RFChannel:
    """
    Radio frequency channel model.

    Computes received signal strength (RSSI), packet delivery ratio (PDR),
    and link quality between any two drones considering:
    1. Friis free-space path loss
    2. Terrain occlusion attenuation
    3. Multipath fading (Rayleigh or Rician)
    4. Jamming / noise floor elevation
    """

    # Speed of light (m/s)
    C = 3e8

    def __init__(
        self,
        frequency_mhz: float = 900.0,
        noise_floor_dbm: float = -100.0,
        fading_model: str = "rician",    # "rayleigh", "rician", "none"
        rician_k_factor: float = 6.0,    # K-factor for Rician fading (dB)
        packet_size_bytes: int = 256,
        bandwidth_hz: float = 1e6,       # 1 MHz
        packets_per_measurement: int = 24,
    ):
        self.frequency_mhz = frequency_mhz
        self.frequency_hz = frequency_mhz * 1e6
        self.wavelength = self.C / self.frequency_hz
        self.noise_floor_dbm = noise_floor_dbm
        self.base_noise_floor = noise_floor_dbm
        self.fading_model = fading_model
        self.rician_k = 10 ** (rician_k_factor / 10)  # linear
        self.packet_size_bytes = packet_size_bytes
        self.bandwidth_hz = bandwidth_hz
        self.packets_per_measurement = packets_per_measurement

        # Jamming state
        self.jammers: dict = {}          # operator-placed positional jammers
        self.node_noise: dict = {}       # drone_id -> noise floor at its receiver (per tick)
        self.extra_loss_db = 0.0         # wet antenna / radome loss (rain)
        self.ew_state: dict = {}         # published by mesh.electronic_warfare
        self.ew_estimate = None          # geolocated jammer, used by the relay optimiser
        self.jamming_active = False
        self.jamming_power_dbm = -80.0  # effective noise floor when jammed

        # Random state for fading
        self._rng = np.random.RandomState(42)

    def friis_path_loss_db(self, distance_m: float) -> float:
        """
        Compute free-space path loss using Friis equation.

        FSPL(dB) = 20*log10(d) + 20*log10(f) + 20*log10(4π/c)
        """
        if distance_m < 0.1:
            distance_m = 0.1  # minimum distance to avoid log(0)
        fspl = (
            20 * np.log10(distance_m)
            + 20 * np.log10(self.frequency_hz)
            + 20 * np.log10(4 * np.pi / self.C)
        )
        return float(fspl)

    def compute_fading_db(self, size: int = 1):
        """
        Multipath fading loss in dB.

        Args:
            size: number of independent fading realisations to draw.

        Returns a float when `size == 1`, otherwise an array of length `size`.
        Drawing a burst at once matters because packet delivery ratio is
        measured over many packets, each of which fades independently.
        """
        if self.fading_model == "none":
            return 0.0 if size == 1 else np.zeros(size)

        if self.fading_model == "rayleigh":
            real = self._rng.normal(0, 1, size)
            imag = self._rng.normal(0, 1, size)
            gain = (real ** 2 + imag ** 2) / 2.0
        elif self.fading_model == "rician":
            k = self.rician_k
            los = np.sqrt(k / (1 + k))
            scatter_std = np.sqrt(1 / (2 * (1 + k)))
            real = los + self._rng.normal(0, scatter_std, size)
            imag = self._rng.normal(0, scatter_std, size)
            gain = real ** 2 + imag ** 2
        else:
            return 0.0 if size == 1 else np.zeros(size)

        loss = -10 * np.log10(np.maximum(gain, 1e-10))
        return float(loss[0]) if size == 1 else loss

    def compute_rssi(
        self,
        tx_power_dbm: float,
        tx_gain_dbi: float,
        rx_gain_dbi: float,
        distance_m: float,
        occlusion_db: float = 0.0,
        antenna_factor: float = 1.0,
    ) -> float:
        """
        Compute received signal strength indicator (RSSI) in dBm.

        Args:
            tx_power_dbm: Transmit power (dBm)
            tx_gain_dbi: Transmit antenna gain (dBi)
            rx_gain_dbi: Receive antenna gain (dBi)
            distance_m: Distance between tx and rx (m)
            occlusion_db: RF attenuation from terrain occlusion (dB)
            antenna_factor: Antenna alignment factor [0, 1]

        Returns:
            RSSI in dBm.
        """
        path_loss = self.friis_path_loss_db(distance_m)
        fading_loss = self.compute_fading_db()
        antenna_loss = -10 * np.log10(max(antenna_factor, 0.01))

        rssi = (
            tx_power_dbm
            + tx_gain_dbi
            + rx_gain_dbi
            - path_loss
            - occlusion_db
            - fading_loss
            - antenna_loss
        )
        return float(rssi)

    def compute_snr(self, rssi_dbm: float) -> float:
        """Compute signal-to-noise ratio (dB)."""
        effective_noise = self.jamming_power_dbm if self.jamming_active else self.noise_floor_dbm
        return rssi_dbm - effective_noise

    def compute_ber(self, snr_db: float) -> float:
        """
        Compute bit error rate from SNR.
        Uses BPSK approximation: BER ≈ 0.5 * erfc(sqrt(SNR_linear))
        """
        from scipy.special import erfc
        snr_linear = 10 ** (snr_db / 10)
        ber = 0.5 * erfc(np.sqrt(max(snr_linear, 0)))
        return float(min(ber, 0.5))

    def compute_pdr(self, snr_db: float) -> float:
        """
        Compute packet delivery ratio.
        PDR = (1 - BER)^(packet_size_bits)
        """
        ber = self.compute_ber(snr_db)
        packet_bits = self.packet_size_bytes * 8
        pdr = (1 - ber) ** packet_bits
        return float(max(0.0, min(1.0, pdr)))

    def compute_link_quality(
        self,
        tx_power_dbm: float,
        tx_gain_dbi: float,
        rx_gain_dbi: float,
        distance_m: float,
        occlusion_db: float = 0.0,
        antenna_factor: float = 1.0,
        noise_dbm: float = None,
    ) -> dict:
        """
        Compute full link quality metrics between two nodes.

        `noise_dbm` overrides the channel-wide noise floor for this link — used
        for positional jammers, whose effect depends on where the receiver is.

        Returns:
            Dict with rssi_dbm, snr_db, ber, pdr, link_quality [0,1].
        """
        # Deterministic part of the link budget
        path_loss = self.friis_path_loss_db(distance_m)
        antenna_loss = -10 * np.log10(max(antenna_factor, 0.01))
        rssi_mean = (tx_power_dbm - self.extra_loss_db + tx_gain_dbi + rx_gain_dbi
                     - path_loss - occlusion_db - antenna_loss)

        # PDR is an average over a burst of packets, not a property of one
        # instant. Each packet in the burst sees its own fade, so the measured
        # ratio is the mean of per-packet outcomes.
        #
        # Computing it from a single fading draw (as this did previously) made
        # the reported PDR swing wildly from tick to tick on a perfectly
        # steady link. Downstream that was not merely cosmetic: the causal
        # engine compares packet loss before and after an altitude change, and
        # single-draw noise was large enough to swamp a real 0.19 effect.
        fading = self.compute_fading_db(self.packets_per_measurement)
        rssi_samples = rssi_mean - fading

        if noise_dbm is None:
            noise_dbm = self.jamming_power_dbm if self.jamming_active else self.noise_floor_dbm
        snr_samples = rssi_samples - noise_dbm

        pdr_samples = np.array([self.compute_pdr(float(s)) for s in np.atleast_1d(snr_samples)])
        pdr = float(np.mean(pdr_samples))

        # Report the mean RSSI/SNR of the burst, which is what a receiver's
        # signal-strength indicator actually shows.
        rssi = float(np.mean(np.atleast_1d(rssi_samples)))
        snr = float(np.mean(np.atleast_1d(snr_samples)))
        ber = self.compute_ber(snr)

        link_quality = pdr

        return {
            "rssi_dbm": rssi,
            "snr_db": snr,
            "ber": ber,
            "pdr": pdr,
            "link_quality": link_quality,
            "distance_m": distance_m,
            "occlusion_db": occlusion_db,
        }

    def enable_jamming(self, power_dbm: float = -70.0):
        """Activate jamming / RF interference."""
        self.jamming_active = True
        self.jamming_power_dbm = power_dbm

    def disable_jamming(self):
        """Deactivate jamming."""
        self.jamming_active = False

    def degrade_rf(self, additional_noise_db: float = 10.0):
        """Degrade RF environment by raising noise floor."""
        self.noise_floor_dbm = self.base_noise_floor + additional_noise_db

    def restore_rf(self):
        """Restore nominal RF conditions."""
        self.noise_floor_dbm = self.base_noise_floor
        self.jamming_active = False

    # -- positional jammers ------------------------------------------------
    #
    # A jammer placed by the operator is a real transmitter at a location. Its
    # interference at a receiver falls off with distance (Friis) and is
    # attenuated by any terrain between them, so an aircraft can genuinely
    # escape a jammer by putting a ridge in the way — the same diffraction
    # model that governs the swarm's own links.

    def add_jammer(self, jammer_id: str, position, power_dbm: float = 20.0):
        self.jammers[jammer_id] = {
            "id": jammer_id,
            "position": np.asarray(position, dtype=np.float64),
            "power_dbm": float(power_dbm),
        }

    def remove_jammer(self, jammer_id: str):
        self.jammers.pop(jammer_id, None)

    def jammer_power_at(self, position, world=None) -> float:
        """
        Total jammer interference (dBm) received at `position`, summed in the
        linear domain across all jammers. Returns -inf when there are none.
        """
        if not self.jammers:
            return float("-inf")
        total_mw = 0.0
        for jammer in self.jammers.values():
            distance = float(np.linalg.norm(np.asarray(position) - jammer["position"]))
            received = jammer["power_dbm"] + 3.0 - self.friis_path_loss_db(max(distance, 5.0))
            if world is not None:
                received -= world.compute_rf_occlusion_db(jammer["position"], position)
            total_mw += 10.0 ** (received / 10.0)
        return 10.0 * np.log10(total_mw) if total_mw > 0 else float("-inf")

    def noise_at(self, position, world=None) -> float:
        """Effective noise floor (dBm) for a receiver at `position`."""
        base = self.jamming_power_dbm if self.jamming_active else self.noise_floor_dbm
        jam = self.jammer_power_at(position, world)
        if not np.isfinite(jam):
            return base
        return float(10.0 * np.log10(10.0 ** (base / 10.0) + 10.0 ** (jam / 10.0)))

    def jammer_radius_m(self, power_dbm: float, threshold_dbm: float = -82.0) -> float:
        """
        Unobstructed distance at which a jammer still lifts the noise floor to
        `threshold_dbm` — enough to cut a typical link's margin in half. Used
        only to size the envelope drawn on the operator's display.
        """
        fspl_limit = power_dbm + 3.0 - threshold_dbm
        base = self.friis_path_loss_db(1.0)
        return float(10.0 ** ((fspl_limit - base) / 20.0))

    def get_state(self) -> dict:
        """Serialize RF channel state."""
        return {
            "frequency_mhz": self.frequency_mhz,
            "noise_floor_dbm": self.noise_floor_dbm,
            "extra_loss_db": self.extra_loss_db,
            "ew": self.ew_state,
            "jamming_active": self.jamming_active or bool(self.jammers),
            "global_jamming": self.jamming_active,
            "jamming_power_dbm": self.jamming_power_dbm if self.jamming_active else None,
            "fading_model": self.fading_model,
            "jammers": [
                {
                    "id": j["id"],
                    "position": j["position"].tolist(),
                    "power_dbm": j["power_dbm"],
                    "radius_m": self.jammer_radius_m(j["power_dbm"]),
                }
                for j in self.jammers.values()
            ],
        }

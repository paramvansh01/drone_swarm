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

        # Jamming state
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

    def compute_fading_db(self) -> float:
        """Compute instantaneous multipath fading loss (dB)."""
        if self.fading_model == "none":
            return 0.0

        if self.fading_model == "rayleigh":
            # Rayleigh fading: magnitude follows Rayleigh distribution
            h = (self._rng.normal(0, 1) + 1j * self._rng.normal(0, 1)) / np.sqrt(2)
            gain = np.abs(h) ** 2
            return float(-10 * np.log10(max(gain, 1e-10)))

        if self.fading_model == "rician":
            # Rician fading: LOS component + scattered
            k = self.rician_k
            los = np.sqrt(k / (1 + k))
            scatter_std = np.sqrt(1 / (2 * (1 + k)))
            h = los + (self._rng.normal(0, scatter_std) + 1j * self._rng.normal(0, scatter_std))
            gain = np.abs(h) ** 2
            return float(-10 * np.log10(max(gain, 1e-10)))

        return 0.0

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
    ) -> dict:
        """
        Compute full link quality metrics between two nodes.

        Returns:
            Dict with rssi_dbm, snr_db, ber, pdr, link_quality [0,1].
        """
        rssi = self.compute_rssi(
            tx_power_dbm, tx_gain_dbi, rx_gain_dbi,
            distance_m, occlusion_db, antenna_factor,
        )
        snr = self.compute_snr(rssi)
        ber = self.compute_ber(snr)
        pdr = self.compute_pdr(snr)

        # Link quality is a normalized [0,1] metric
        link_quality = pdr  # simple mapping; could be more nuanced

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

    def get_state(self) -> dict:
        """Serialize RF channel state."""
        return {
            "frequency_mhz": self.frequency_mhz,
            "noise_floor_dbm": self.noise_floor_dbm,
            "jamming_active": self.jamming_active,
            "jamming_power_dbm": self.jamming_power_dbm if self.jamming_active else None,
            "fading_model": self.fading_model,
        }

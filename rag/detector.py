"""
YOLOv11-nano object detection for PoI imagery.

Detects: survivors, vehicles, structural damage, water bodies, debris.
Falls back to simulated detections if model weights are unavailable.
"""

import numpy as np
import logging
from typing import List, Dict, Optional, Tuple
from dataclasses import dataclass, field

logger = logging.getLogger("cdawn.rag.detector")


@dataclass
class Detection:
    """An object detection result."""
    class_name: str
    confidence: float
    bbox: Tuple[float, float, float, float]  # (x1, y1, x2, y2) normalized
    image_id: str = ""
    drone_id: str = ""
    timestamp: float = 0.0
    gps_coords: Optional[np.ndarray] = None

    def to_dict(self) -> dict:
        return {
            "class": self.class_name,
            "confidence": self.confidence,
            "bbox": list(self.bbox),
            "image_id": self.image_id,
            "drone_id": self.drone_id,
            "timestamp": self.timestamp,
            "gps": self.gps_coords.tolist() if self.gps_coords is not None else None,
        }


# Disaster-relevant categories
DISASTER_CLASSES = [
    "survivor", "vehicle", "debris", "damaged_structure",
    "water_body", "fire", "road_blockage", "tent", "rescue_team",
]


class DisasterDetector:
    """
    Object detector for disaster aerial imagery.

    Uses YOLOv11-nano when available, falls back to simulated
    detections for demo purposes.
    """

    def __init__(self, model_path: Optional[str] = None, use_simulation: bool = True):
        self.model = None
        self.use_simulation = use_simulation
        self._rng = np.random.RandomState(42)

        if model_path and not use_simulation:
            try:
                from ultralytics import YOLO
                self.model = YOLO(model_path)
                self.use_simulation = False
                logger.info(f"Loaded YOLO model from {model_path}")
            except Exception as e:
                logger.warning(f"Failed to load YOLO model: {e}. Using simulation mode.")
                self.use_simulation = True

    def detect(
        self,
        image: Optional[np.ndarray] = None,
        drone_id: str = "",
        timestamp: float = 0.0,
        gps_coords: Optional[np.ndarray] = None,
        poi_category: str = "unknown",
    ) -> List[Detection]:
        """
        Run detection on an image.

        Args:
            image: Image array (H, W, 3) or None for simulated.
            drone_id: ID of the observing drone.
            timestamp: Simulation time.
            gps_coords: GPS coordinates of observation.
            poi_category: Hint from PoI category for simulation.

        Returns:
            List of detections.
        """
        if self.use_simulation or image is None:
            return self._simulate_detections(drone_id, timestamp, gps_coords, poi_category)

        return self._run_yolo(image, drone_id, timestamp, gps_coords)

    def _run_yolo(
        self,
        image: np.ndarray,
        drone_id: str,
        timestamp: float,
        gps_coords: Optional[np.ndarray],
    ) -> List[Detection]:
        """Run actual YOLO inference."""
        results = self.model(image, verbose=False)
        detections = []

        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                xyxy = box.xyxy[0].cpu().numpy()
                h, w = image.shape[:2]

                detection = Detection(
                    class_name=result.names.get(cls_id, f"class_{cls_id}"),
                    confidence=conf,
                    bbox=(xyxy[0]/w, xyxy[1]/h, xyxy[2]/w, xyxy[3]/h),
                    image_id=f"{drone_id}_{timestamp:.2f}",
                    drone_id=drone_id,
                    timestamp=timestamp,
                    gps_coords=gps_coords,
                )
                detections.append(detection)

        return detections

    def _simulate_detections(
        self,
        drone_id: str,
        timestamp: float,
        gps_coords: Optional[np.ndarray],
        poi_category: str,
    ) -> List[Detection]:
        """Generate simulated detections for demo."""
        detections = []

        # Map PoI category to likely detections
        category_map = {
            "survivor": ["survivor", "tent"],
            "vehicle": ["vehicle", "road_blockage"],
            "debris": ["debris", "damaged_structure"],
            "structure": ["damaged_structure", "debris"],
            "water": ["water_body"],
            "unknown": ["debris"],
        }

        likely_classes = category_map.get(poi_category, ["debris"])

        # Primary detection
        primary = Detection(
            class_name=self._rng.choice(likely_classes),
            confidence=self._rng.uniform(0.75, 0.98),
            bbox=(
                self._rng.uniform(0.1, 0.4),
                self._rng.uniform(0.1, 0.4),
                self._rng.uniform(0.5, 0.9),
                self._rng.uniform(0.5, 0.9),
            ),
            image_id=f"{drone_id}_{timestamp:.2f}",
            drone_id=drone_id,
            timestamp=timestamp,
            gps_coords=gps_coords,
        )
        detections.append(primary)

        # Secondary detections (30% chance)
        if self._rng.random() > 0.7:
            secondary_class = self._rng.choice(DISASTER_CLASSES)
            detections.append(Detection(
                class_name=secondary_class,
                confidence=self._rng.uniform(0.4, 0.75),
                bbox=(
                    self._rng.uniform(0.3, 0.6),
                    self._rng.uniform(0.3, 0.6),
                    self._rng.uniform(0.7, 0.95),
                    self._rng.uniform(0.7, 0.95),
                ),
                image_id=f"{drone_id}_{timestamp:.2f}_secondary",
                drone_id=drone_id,
                timestamp=timestamp,
                gps_coords=gps_coords,
            ))

        return detections

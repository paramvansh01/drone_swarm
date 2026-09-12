"""
CLIP ViT-B/32 embedder for C-DAWN RAG pipeline.

Generates embeddings for detected image crops and text descriptions
for semantic retrieval in SITREP generation.
"""

import numpy as np
import logging
from typing import List, Dict, Optional
from .detector import Detection

logger = logging.getLogger("cdawn.rag.embedder")


class CLIPEmbedder:
    """
    CLIP-based image/text embedder.

    Uses CLIP ViT-B/32 for multimodal embeddings.
    Falls back to simulated embeddings if model unavailable.
    """

    EMBEDDING_DIM = 512  # CLIP ViT-B/32 output dimension

    def __init__(self, use_simulation: bool = True):
        self.model = None
        self.preprocess = None
        self.tokenizer = None
        self.use_simulation = use_simulation
        self._rng = np.random.RandomState(42)

        if not use_simulation:
            try:
                import clip
                import torch
                self.device = "cuda" if torch.cuda.is_available() else "cpu"
                self.model, self.preprocess = clip.load("ViT-B/32", device=self.device)
                self.use_simulation = False
                logger.info("Loaded CLIP ViT-B/32")
            except Exception as e:
                logger.warning(f"Failed to load CLIP: {e}. Using simulation mode.")
                self.use_simulation = True

    def embed_image(self, image: Optional[np.ndarray] = None) -> np.ndarray:
        """Generate image embedding."""
        if self.use_simulation or image is None:
            return self._simulate_embedding()

        import torch
        from PIL import Image

        pil_image = Image.fromarray(image)
        image_input = self.preprocess(pil_image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            embedding = self.model.encode_image(image_input)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)

        return embedding.cpu().numpy().flatten()

    def embed_text(self, text: str) -> np.ndarray:
        """Generate text embedding."""
        if self.use_simulation:
            return self._simulate_embedding(seed_str=text)

        import torch
        import clip

        text_input = clip.tokenize([text]).to(self.device)

        with torch.no_grad():
            embedding = self.model.encode_text(text_input)
            embedding = embedding / embedding.norm(dim=-1, keepdim=True)

        return embedding.cpu().numpy().flatten()

    def embed_detection(self, detection: Detection, image: Optional[np.ndarray] = None) -> dict:
        """
        Generate embedding for a detection.

        Creates a combined text+image embedding capturing:
        - Detection class and confidence
        - Spatial context (GPS, timestamp)
        - Visual features (if image available)
        """
        # Text description
        text = (
            f"{detection.class_name} detected with {detection.confidence:.0%} confidence "
            f"by drone {detection.drone_id} at time {detection.timestamp:.1f}s"
        )
        if detection.gps_coords is not None:
            text += f" at coordinates ({detection.gps_coords[0]:.1f}, {detection.gps_coords[1]:.1f})"

        text_emb = self.embed_text(text)
        image_emb = self.embed_image(image)

        # Combine (simple average for simulation mode)
        combined = (text_emb + image_emb) / 2.0
        combined /= np.linalg.norm(combined) + 1e-8

        return {
            "embedding": combined,
            "text_embedding": text_emb,
            "image_embedding": image_emb,
            "description": text,
            "detection": detection.to_dict(),
        }

    def _simulate_embedding(self, seed_str: str = "") -> np.ndarray:
        """Generate a simulated embedding vector."""
        if seed_str:
            seed = hash(seed_str) % (2**31)
            rng = np.random.RandomState(seed)
        else:
            rng = self._rng

        embedding = rng.normal(0, 1, self.EMBEDDING_DIM).astype(np.float32)
        embedding /= np.linalg.norm(embedding) + 1e-8
        return embedding

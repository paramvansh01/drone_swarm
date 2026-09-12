"""
ChromaDB vector store for C-DAWN edge intelligence.

Stores detection embeddings with metadata for SITREP retrieval.
Falls back to in-memory store if ChromaDB unavailable.
"""

import numpy as np
import logging
from typing import List, Dict, Optional
from collections import defaultdict

logger = logging.getLogger("cdawn.rag.vector_store")


class VectorStore:
    """
    Vector store for edge intelligence retrieval.

    Uses ChromaDB when available, in-memory fallback otherwise.
    Stores: embedding, image metadata, timestamp, drone ID, GPS, detections.
    """

    def __init__(self, collection_name: str = "cdawn_mission", use_chromadb: bool = False):
        self.collection_name = collection_name
        self._use_chromadb = use_chromadb
        self._client = None
        self._collection = None

        # In-memory fallback
        self._memory_store: List[Dict] = []

        if use_chromadb:
            try:
                import chromadb
                self._client = chromadb.Client()
                self._collection = self._client.get_or_create_collection(
                    name=collection_name,
                    metadata={"hnsw:space": "cosine"},
                )
                logger.info(f"ChromaDB collection '{collection_name}' ready")
            except Exception as e:
                logger.warning(f"ChromaDB unavailable: {e}. Using in-memory store.")
                self._use_chromadb = False

    def add(
        self,
        embedding: np.ndarray,
        metadata: dict,
        doc_id: Optional[str] = None,
    ):
        """Add a document to the store."""
        if doc_id is None:
            doc_id = f"doc_{len(self._memory_store)}"

        if self._use_chromadb and self._collection:
            self._collection.add(
                embeddings=[embedding.tolist()],
                metadatas=[metadata],
                ids=[doc_id],
            )
        else:
            self._memory_store.append({
                "id": doc_id,
                "embedding": embedding,
                "metadata": metadata,
            })

    def query(
        self,
        query_embedding: np.ndarray,
        top_k: int = 5,
        filter_dict: Optional[dict] = None,
    ) -> List[Dict]:
        """
        Query the store for similar documents.

        Args:
            query_embedding: Query vector.
            top_k: Number of results.
            filter_dict: Optional metadata filter.

        Returns:
            List of {id, metadata, distance} dicts.
        """
        if self._use_chromadb and self._collection:
            where = filter_dict if filter_dict else None
            results = self._collection.query(
                query_embeddings=[query_embedding.tolist()],
                n_results=top_k,
                where=where,
            )
            return [
                {
                    "id": results["ids"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if results.get("distances") else 0,
                }
                for i in range(len(results["ids"][0]))
            ]
        else:
            return self._memory_query(query_embedding, top_k, filter_dict)

    def _memory_query(
        self,
        query_embedding: np.ndarray,
        top_k: int,
        filter_dict: Optional[dict],
    ) -> List[Dict]:
        """In-memory cosine similarity search."""
        if not self._memory_store:
            return []

        results = []
        for doc in self._memory_store:
            # Apply filter
            if filter_dict:
                skip = False
                for k, v in filter_dict.items():
                    if doc["metadata"].get(k) != v:
                        skip = True
                        break
                if skip:
                    continue

            # Cosine similarity
            emb = doc["embedding"]
            similarity = np.dot(query_embedding, emb) / (
                np.linalg.norm(query_embedding) * np.linalg.norm(emb) + 1e-8
            )
            results.append({
                "id": doc["id"],
                "metadata": doc["metadata"],
                "distance": 1.0 - similarity,
                "similarity": similarity,
            })

        results.sort(key=lambda x: x["distance"])
        return results[:top_k]

    def get_count(self) -> int:
        """Get total document count."""
        if self._use_chromadb and self._collection:
            return self._collection.count()
        return len(self._memory_store)

    def clear(self):
        """Clear the store."""
        if self._use_chromadb and self._client:
            self._client.delete_collection(self.collection_name)
            self._collection = self._client.get_or_create_collection(
                name=self.collection_name,
                metadata={"hnsw:space": "cosine"},
            )
        self._memory_store.clear()

    def get_state(self) -> dict:
        return {
            "backend": "chromadb" if self._use_chromadb else "memory",
            "count": self.get_count(),
            "collection": self.collection_name,
        }

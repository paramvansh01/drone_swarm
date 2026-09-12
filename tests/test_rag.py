import numpy as np
from rag.detector import DisasterDetector, Detection
from rag.vector_store import VectorStore
from rag.sitrep_generator import SitrepGenerator
from rag.payload import create_payload, verify_payload, compact_payload


def test_disaster_detector_simulation():
    detector = DisasterDetector(use_simulation=True)
    fake_img = np.zeros((100, 100, 3), dtype=np.uint8)
    
    detections = detector.detect(fake_img, drone_id="scout-1", timestamp=10.5)
    assert isinstance(detections, list)
    assert len(detections) > 0
    assert detections[0].drone_id == "scout-1"


def test_vector_store_in_memory():
    store = VectorStore(use_chromadb=False)
    
    emb1 = np.array([1.0, 0.0, 0.0])
    emb2 = np.array([0.0, 1.0, 0.0])
    
    store.add(emb1, metadata={"category": "survivor", "id": "s1"}, doc_id="doc-1")
    store.add(emb2, metadata={"category": "vehicle", "id": "v1"}, doc_id="doc-2")
    
    results = store.query(query_embedding=np.array([0.9, 0.1, 0.0]), top_k=1)
    assert len(results) == 1
    assert results[0]["id"] == "doc-1"
    assert results[0]["metadata"]["category"] == "survivor"


def test_sitrep_generator_template():
    generator = SitrepGenerator(use_template=True)
    
    evidence = [
        {"metadata": {"class": "survivor", "confidence": 0.94, "drone_id": "SCOUT-1", "timestamp": 12.0}},
        {"metadata": {"class": "damaged_structure", "confidence": 0.88, "drone_id": "SCOUT-2", "timestamp": 14.0}}
    ]
    metrics = {
        "swarm_pdr": 0.97,
        "avg_battery": 82.5,
        "pois_surveyed": 3,
        "total_pois": 5,
        "current_phase": 1,
    }
    
    sitrep = generator.generate(evidence=evidence, metrics=metrics, mission_id="MISSION-TEST")
    assert sitrep["mission_id"] == "MISSION-TEST"
    assert "survivor" in sitrep["text"].lower()
    assert len(sitrep["citations"]) == 2


def test_payload_signing_and_verification():
    raw_data = {"telemetry": {"alt": 120.5, "speed": 14.2}}
    payload = create_payload("scout-alpha", "telemetry", raw_data, secret_key="test-key")
    
    assert "signature" in payload
    assert verify_payload(payload, secret_key="test-key") is True
    assert verify_payload(payload, secret_key="wrong-key") is False
    
    # Payload compaction
    compressed = compact_payload(payload)
    assert isinstance(compressed, bytes)
    assert len(compressed) > 0

import json
from pathlib import Path
from gcs.backend.telemetry import TelemetryAggregator


def test_scenario_files_exist_and_valid():
    scenario_dir = Path(__file__).parent.parent / "demo" / "scenarios"
    canyon_file = scenario_dir / "canyon_01.json"
    urban_file = scenario_dir / "urban_rubble.json"
    
    assert canyon_file.exists()
    assert urban_file.exists()
    
    with open(canyon_file, "r") as f:
        canyon_data = json.load(f)
    assert canyon_data["name"] == "canyon_01"
    assert len(canyon_data["drones"]) >= 4
    
    with open(urban_file, "r") as f:
        urban_data = json.load(f)
    assert len(urban_data["drones"]) >= 4


def test_telemetry_aggregator():
    telemetry = TelemetryAggregator(history_length=20)
    
    # Push sample telemetry
    sample = {
        "time": 1.0,
        "drones": {
            "SCOUT-1": {"pos": [10.0, 0.0, 20.0], "battery": 98.0, "role": "SCOUT"},
            "RELAY-1": {"pos": [50.0, 0.0, 30.0], "battery": 95.0, "role": "RELAY"},
        },
        "metrics": {"pdr": 0.98, "latency_ms": 22.5},
    }
    telemetry.update(sample)
    
    state = telemetry.get_snapshot()
    assert state is not None
    assert "drones" in state
    assert "SCOUT-1" in state["drones"]

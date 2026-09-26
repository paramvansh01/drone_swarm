# UAV-X benchmark results

Generated 2026-09-26 12:16 by `python -m bench.uavx_suite` — 4 scenarios × 3 seeds, mean ± s.d.

| Metric | Adaptive (this system) | Fixed-role baseline |
|---|---|---|
| completion rate | 97.3 ± 3.2% | 87.8 ± 15.3% |
| priority weighted score | 96.7 ± 3.9% | 84.0 ± 19.3% |
| emergent response s | 42.0 ± 13.0 s | 179.7 ± 29.9 s |
| packet delivery ratio | 96.7 ± 2.1% | 91.6 ± 5.5% |
| latency ms mean | 9.1 ± 2.1 ms | 9.3 ± 2.1 ms |
| connectivity availability | 95.3 ± 3.1% | 88.6 ± 7.2% |
| downtime s total | 123.6 ± 79.3 s | 273.2 ± 182.9 s |
| relay reallocations | 8.0 ± 1.9 | 6.9 ± 1.6 |
| reconfiguration efficiency | 100.0 ± 0.0% | 100.0 ± 0.0% |
| recovery time s mean | 6.7 ± 5.1 s | 13.4 ± 9.4 s |
| post disruption availability | 93.9 ± 4.0% | 84.5 ± 9.4% |
| post disruption pdr | 95.7 ± 2.7% | 88.6 ± 7.2% |
| collisions | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min separation m | 17.1 ± 5.4 m | 19.0 ± 7.4 m |
| geofence violations | 0.0 ± 0.0 | 0.0 ± 0.0 |
| battery depleted | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min battery pct | 21.3 ± 7.0% | 33.6 ± 11.6% |

## Per scenario (adaptive)

| Scenario | Completion | Priority-weighted | PDR | Availability | Recovery | Collisions | Min battery |
|---|---|---|---|---|---|---|---|
| synthetic_quickstart | 100.0 ± 0.0% | 100.0 ± 0.0% | 95.4 ± 0.1% | 93.9 ± 0.0% | 4.6 ± 0.1 s | 0.0 ± 0.0 | 24.1 ± 0.4% |
| kedarnath_landslide | 93.8 ± 0.0% | 92.1 ± 0.0% | 97.2 ± 0.0% | 95.8 ± 0.0% | 8.9 ± 0.0 s | 0.0 ± 0.0 | 10.5 ± 0.2% |
| uttarkashi_earthquake | 100.0 ± 0.0% | 100.0 ± 0.0% | 100.0 ± 0.0% | 100.0 ± 0.0% | 0.0 ± 0.0 s | 0.0 ± 0.0 | 29.4 ± 0.8% |
| stress_hidden_disturbances | 95.6 ± 3.1% | 94.6 ± 3.8% | 94.3 ± 0.2% | 91.5 ± 0.7% | 13.3 ± 2.9 s | 0.0 ± 0.0 | 21.3 ± 2.1% |

# UAV-X benchmark results

Generated 2026-09-26 01:57 by `python -m bench.uavx_suite` — 4 scenarios × 3 seeds, mean ± s.d.

| Metric | Adaptive (this system) | Fixed-role baseline |
|---|---|---|
| completion rate | 98.4 ± 2.7% | 87.3 ± 15.0% |
| priority weighted score | 98.0 ± 3.4% | 83.3 ± 18.9% |
| emergent response s | 42.6 ± 10.0 s | 156.3 ± 36.5 s |
| packet delivery ratio | 96.7 ± 2.1% | 93.1 ± 4.7% |
| latency ms mean | 9.1 ± 1.9 ms | 9.5 ± 2.3 ms |
| connectivity availability | 95.3 ± 3.1% | 90.1 ± 6.3% |
| downtime s total | 123.6 ± 81.3 s | 215.5 ± 138.8 s |
| relay reallocations | 7.7 ± 1.2 | 7.0 ± 2.3 |
| reconfiguration efficiency | 100.0 ± 0.0% | 100.0 ± 0.0% |
| recovery time s mean | 6.8 ± 5.1 s | 10.8 ± 7.1 s |
| post disruption availability | 93.8 ± 3.9% | 86.2 ± 8.5% |
| post disruption pdr | 95.7 ± 2.7% | 90.3 ± 6.4% |
| collisions | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min separation m | 21.8 ± 7.4 m | 18.9 ± 7.5 m |
| geofence violations | 0.0 ± 0.0 | 0.0 ± 0.0 |
| battery depleted | 0.0 ± 0.0 | 0.0 ± 0.0 |
| min battery pct | 22.4 ± 5.3% | 34.0 ± 11.2% |

## Per scenario (adaptive)

| Scenario | Completion | Priority-weighted | PDR | Availability | Recovery | Collisions | Min battery |
|---|---|---|---|---|---|---|---|
| synthetic_quickstart | 100.0 ± 0.0% | 100.0 ± 0.0% | 95.6 ± 0.1% | 94.2 ± 0.1% | 5.3 ± 0.1 s | 0.0 ± 0.0 | 25.2 ± 0.1% |
| kedarnath_landslide | 93.8 ± 0.0% | 92.1 ± 0.0% | 97.0 ± 0.0% | 95.5 ± 0.0% | 8.9 ± 0.0 s | 0.0 ± 0.0 | 13.5 ± 0.2% |
| uttarkashi_earthquake | 100.0 ± 0.0% | 100.0 ± 0.0% | 99.9 ± 0.0% | 100.0 ± 0.0% | 0.0 ± 0.0 s | 0.0 ± 0.0 | 27.4 ± 0.1% |
| stress_hidden_disturbances | 100.0 ± 0.0% | 100.0 ± 0.0% | 94.3 ± 0.6% | 91.3 ± 0.6% | 13.2 ± 3.1 s | 0.0 ± 0.0 | 23.4 ± 0.7% |

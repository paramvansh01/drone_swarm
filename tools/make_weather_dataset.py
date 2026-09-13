#!/usr/bin/env python3
"""
Synthetic monsoon weather dataset for the C-DAWN theatres.

Why synthetic: the demonstration must run on an offline venue network, and
the real sources below need credentials and a large download. This generator
produces a dataset with the same schema as those sources, sampled from
published Indian-monsoon climatology ranges, so the weather model is fitted
to data rather than to hand-picked constants — and so swapping in the real
archive is a file swap, not a code change.

Drop-in real sources (identical columns):

  ERA5 / ERA5-Land (ECMWF Copernicus, free, CDS API)
      total_precipitation, cloud_base_height, 10m_u/v_component_of_wind,
      2m_temperature, boundary_layer_height        — hourly, 1940-present
  IMD gridded rainfall (India Meteorological Department, 0.25 deg, free)
  NASA GPM IMERG (0.1 deg, half-hourly precipitation)
  NOAA GFS (forecast, free)

Usage:
    python tools/make_weather_dataset.py            # writes data/weather/*.csv
    python tools/make_weather_dataset.py --fit      # ...and refits the model
"""

from __future__ import annotations

import csv
import json
import sys
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "data" / "weather"

# Theatre, elevation band and monsoon character. Rain statistics are the
# published seasonal character of each region: Garhwal and Tawang sit in the
# monsoon's path, Ladakh is in the rain shadow of the Himalaya.
THEATRES = [
    # id, lat, lon, base elevation m, monsoon wet-hour fraction, mean rain when wet
    ("kedarnath", 30.720, 79.068, 3200, 0.42, 9.0),
    ("tawang",    27.588, 91.865, 2400, 0.48, 11.0),
    ("galwan",    34.755, 78.185, 4300, 0.06, 2.5),
    ("kargil",    34.445, 75.770, 3400, 0.08, 2.8),
    ("siachen",   35.195, 77.190, 4200, 0.07, 2.2),
    ("synthetic", 30.376, 79.971, 1000, 0.35, 7.0),
]

HOURS = 24 * 120          # one monsoon season, hourly


def generate(theatre, rng):
    """One season of hourly weather for a theatre."""
    tid, lat, lon, elevation, wet_fraction, wet_mean = theatre
    rows = []
    start = datetime(2025, 6, 1)

    # Rainfall: a Markov wet/dry chain (rain is persistent, not independent
    # hour to hour), with gamma-distributed intensity when wet.
    wet = False
    p_wet_to_wet, p_dry_to_wet = 0.72, wet_fraction * 0.12

    for hour in range(HOURS):
        wet = rng.random() < (p_wet_to_wet if wet else p_dry_to_wet)
        rain = float(rng.gamma(1.6, wet_mean / 1.6)) if wet else 0.0
        # Diurnal convection: Himalayan rain peaks late afternoon/evening
        local_hour = (hour + 5) % 24
        rain *= 1.0 + 0.55 * np.sin(np.pi * max(local_hour - 11, 0) / 13.0) ** 2
        rain = min(rain, 90.0)

        # Cloud base falls as rain intensifies: moist air is lifted less
        # before it saturates. Below is the physical relation via the
        # dew-point spread, with the spread shrinking as rain increases.
        dew_spread = max(11.5 - 2.9 * np.log1p(rain) + rng.normal(0, 1.1), 0.3)
        cloud_base = 125.0 * dew_spread           # Espy's rule, m above ground
        cloud_base = float(np.clip(cloud_base + rng.normal(0, 35), 55.0, 2600.0))

        # Valley wind: stronger in disturbed weather, with gusts
        wind = float(abs(rng.normal(4.5 + 0.10 * rain, 1.9)))
        gust = wind * float(rng.uniform(1.3, 2.1 + 0.012 * rain))
        temp = 18.0 - 0.0065 * elevation + 6.0 * np.sin(2 * np.pi * local_hour / 24) \
            - 0.06 * rain + rng.normal(0, 1.2)
        humidity = float(np.clip(58 + 3.4 * rain + rng.normal(0, 7), 20, 100))
        visibility = float(np.clip(9000 * np.exp(-rain / 26.0) + rng.normal(0, 350), 120, 12000))

        rows.append({
            "time": (start + timedelta(hours=hour)).isoformat(),
            "theatre": tid, "lat": lat, "lon": lon, "elevation_m": elevation,
            "rain_mm_h": round(rain, 2),
            "cloud_base_agl_m": round(cloud_base, 1),
            "wind_ms": round(wind, 2),
            "gust_ms": round(gust, 2),
            "temp_c": round(float(temp), 2),
            "humidity_pct": round(humidity, 1),
            "visibility_m": round(visibility, 0),
        })
    return rows


def fit(rows):
    """
    Fit the two relations the simulator uses:
      cloud base (m AGL) vs rain rate  — why the swarm has to descend
      gust factor vs rain rate         — how much rougher the air gets
    """
    rain = np.array([r["rain_mm_h"] for r in rows])
    base = np.array([r["cloud_base_agl_m"] for r in rows])
    wind = np.array([r["wind_ms"] for r in rows])
    gust = np.array([r["gust_ms"] for r in rows])

    wet = rain > 0.5
    # Linear in log rain reflects the dew-point physics above
    x = np.log1p(rain[wet])
    a, b = np.polyfit(x, base[wet], 1)
    predicted = a * x + b
    ss_res = float(np.sum((base[wet] - predicted) ** 2))
    ss_tot = float(np.sum((base[wet] - base[wet].mean()) ** 2))
    r2 = 1.0 - ss_res / ss_tot

    gf = gust[wet] / np.maximum(wind[wet], 0.1)
    g_slope, g_int = np.polyfit(rain[wet], gf, 1)

    return {
        "cloud_base_agl_m": {"model": "a*log1p(rain_mm_h)+b", "a": float(a), "b": float(b),
                             "r2": float(r2), "n": int(wet.sum())},
        "gust_factor": {"model": "m*rain_mm_h+c", "m": float(g_slope), "c": float(g_int)},
        "source": "synthetic monsoon climatology (tools/make_weather_dataset.py)",
        "fitted": datetime.now().isoformat(timespec="seconds"),
    }


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    rng = np.random.default_rng(20260913)
    every = []
    for theatre in THEATRES:
        rows = generate(theatre, rng)
        path = OUT_DIR / f"{theatre[0]}.csv"
        with path.open("w", newline="") as handle:
            writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
            writer.writeheader()
            writer.writerows(rows)
        print(f"[{theatre[0]}] {len(rows)} hourly records -> {path.relative_to(ROOT)}")
        every += rows

    coefficients = fit(every)
    (OUT_DIR / "fitted_model.json").write_text(json.dumps(coefficients, indent=2))
    cb = coefficients["cloud_base_agl_m"]
    print(f"\nFitted cloud base = {cb['a']:.1f}*ln(1+rain) + {cb['b']:.0f} m AGL "
          f"(R^2 = {cb['r2']:.3f}, n = {cb['n']})")
    print(f"Fitted gust factor = {coefficients['gust_factor']['m']:.4f}*rain + "
          f"{coefficients['gust_factor']['c']:.2f}")
    print(f"Written to {(OUT_DIR / 'fitted_model.json').relative_to(ROOT)} — "
          "the simulator loads these at startup.")


if __name__ == "__main__":
    main()

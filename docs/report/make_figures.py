"""
Data figures for the technical report, drawn from real run output.

    .venv/bin/python -m ... (see docs/report/README) to refresh chain.json / energy.json
    python3 docs/report/make_figures.py      # needs matplotlib

Inputs: results/uavx_benchmarks.json, results/sample_logs/kedarnath_landslide/,
docs/report/figs/chain.json, docs/report/figs/energy.json.
"""

import csv
import json
from collections import defaultdict
from pathlib import Path

import matplotlib
matplotlib.use("svg")
import matplotlib.pyplot as plt
from matplotlib.patches import Patch

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "docs" / "report" / "figs"

BLUE, ORANGE, VIOLET = "#2a78d6", "#eb6834", "#4a3aa7"
INK, INK2, GRID = "#1d1d1b", "#55544f", "#e4e2dc"
GREY, LIGHT = "#a3a19b", "#dcdad4"

plt.rcParams.update({
    "font.family": "serif", "font.serif": ["Times New Roman", "Times", "DejaVu Serif"],
    "font.size": 7.5, "axes.titlesize": 8, "axes.labelsize": 7.5,
    "axes.edgecolor": INK2, "axes.linewidth": 0.6, "axes.labelcolor": INK,
    "xtick.color": INK2, "ytick.color": INK2, "xtick.major.width": 0.5, "ytick.major.width": 0.5,
    "xtick.major.size": 2.5, "ytick.major.size": 2.5, "legend.frameon": False,
    "legend.fontsize": 7, "svg.fonttype": "none", "pdf.fonttype": 42, "axes.spines.top": False,
    "axes.spines.right": False, "grid.color": GRID, "grid.linewidth": 0.5,
})


def chain():
    """Plan view over the real Kedarnath heightmap: why one relay is needed."""
    import numpy as np
    from matplotlib.colors import LightSource
    d = json.loads((OUT / "chain.json").read_text())
    hm = np.load(OUT / "kedarnath_height.npy").astype(float)
    size = d["size_m"]
    ls = LightSource(azdeg=315, altdeg=40)
    shade = ls.shade(hm, cmap=plt.get_cmap("gist_earth"), vert_exag=2.0, blend_mode="soft",
                     vmin=hm.min() - 400, vmax=hm.max() + 200)
    fig, ax = plt.subplots(figsize=(3.45, 2.05))
    ax.imshow(shade, origin="lower", extent=[0, size, 0, size], interpolation="bilinear")
    km = lambda v: v
    fx = [q[0] for q in d["fence"]] + [d["fence"][0][0]]
    fy = [q[1] for q in d["fence"]] + [d["fence"][0][1]]
    ax.plot(fx, fy, color="#f97316", lw=0.9, ls=(0, (4, 2)))
    cx = [q[0] for q in d["corridor"]]
    cy = [q[1] for q in d["corridor"]]
    ax.plot(cx, cy, color="white", lw=0.7, alpha=0.8)
    pri = {1: "#dc2626", 2: "#f59e0b", 3: "#fde047"}
    for x, y, pr in d["tasks_xy"]:
        ax.plot(x, y, marker="o", ms=3.2, color=pri.get(pr, "#f59e0b"), mec=INK, mew=0.4)
    g = d["gcs_xy"]
    hops = d["hops_xy"]
    t = d["target_xy"]
    ax.plot([g[0], t[0]], [g[1], t[1]], color="white", lw=1.0, ls=":")
    pts = [g] + hops + [t]
    for a2, b2 in zip(pts, pts[1:]):
        ax.plot([a2[0], b2[0]], [a2[1], b2[1]], color=BLUE, lw=1.6)
    ax.plot(*g, marker="^", ms=7, color=INK, mec="white", mew=0.8)
    for h in hops:
        ax.plot(*h, marker="o", ms=6.5, color=ORANGE, mec="white", mew=0.9)
    ax.plot(*t, marker="o", ms=6, color=BLUE, mec="white", mew=0.9)
    box = dict(boxstyle="round,pad=0.18", fc="white", ec="none", alpha=0.85)
    ax.annotate("GCS", g, xytext=(-2, -14), textcoords="offset points", fontsize=6.5, bbox=box)
    for h in hops:
        ax.annotate("relay hop", h, xytext=(-18, -15), textcoords="offset points", fontsize=6.5, bbox=box)
    ax.annotate("farthest task", t, xytext=(-26, 9), textcoords="offset points", fontsize=6.5, bbox=box)
    mid = ((g[0] + t[0]) / 2, (g[1] + t[1]) / 2)
    ax.annotate("direct path crosses the ridge", mid, xytext=(-8, 16), textcoords="offset points",
                fontsize=6.2, bbox=box)
    ax.set_xlim(0, 4300)
    ax.set_ylim(1500, 4300)
    ax.set_xticks([0, 1000, 2000, 3000, 4000], ["0", "1", "2", "3", "4 km"])
    ax.set_yticks([])
    ax.tick_params(axis="x", length=2)
    for sp in ("left", "top", "right"):
        ax.spines[sp].set_visible(False)
    fig.tight_layout(pad=0.2)
    fig.savefig(OUT / "fig_chain.svg"); fig.savefig(OUT / "fig_chain.pdf")


def energy():
    d = json.loads((OUT / "energy.json").read_text())
    fig, ax = plt.subplots(figsize=(3.45, 1.7))
    names = {"calm": "calm", "valley wind 6 m/s": "6 m/s headwind home"}
    for (label, v), color in zip(d.items(), (BLUE, ORANGE)):
        x = [a / 1000 for a in v["x"]]
        ax.plot(x, v["rth"], color=color, lw=1.2)
        ax.plot(x, v["handover"], color=color, lw=1.0, ls=(0, (4, 2)))
        ax.text(x[-1] + 0.06, v["rth"][-1], f"RTH, {names[label]}", fontsize=5.8, color=INK, va="center")
        ax.text(x[-1] + 0.06, v["handover"][-1], f"handover, {names[label]}", fontsize=5.8, color=INK,
                va="center")
    ax.axhline(12, color=GREY, lw=0.6)
    ax.text(2.1, 5.5, "absolute floor 12%", fontsize=5.8, color=INK2)
    ax.set_xlabel("distance of the aircraft from its home pad (km)")
    ax.set_ylabel("battery (%)")
    ax.set_ylim(0, 100)
    ax.set_xlim(0, 4)
    ax.grid(axis="y")
    ax.set_axisbelow(True)
    fig.subplots_adjust(left=0.12, right=0.66, top=0.95, bottom=0.22)
    fig.savefig(OUT / "fig_energy.svg"); fig.savefig(OUT / "fig_energy.pdf")


def timeline():
    logs = ROOT / "results" / "sample_logs" / "kedarnath_landslide"
    rows = defaultdict(list)
    with open(logs / "uav_state.csv") as f:
        for r in csv.DictReader(f):
            if r["mission_t"]:
                rows[r["uav"]].append(r)

    def state(r):
        if r["status"] == "KILLED":
            return "failed"
        if r["status"] in ("CHARGING", "READY"):
            return "pad"
        if r["status"] == "RETURNING" or r["role"] == "STANDBY":
            return "home"
        return "relay" if r["role"] == "RELAY" else "scout"

    colors = {"scout": BLUE, "relay": ORANGE, "home": GREY, "pad": LIGHT, "failed": VIOLET}
    events = []
    for line in open(logs / "events.jsonl"):
        e = json.loads(line)
        kinds = {"KILL_NODE": "UAV failure", "COMM_OUTAGE": "comms outage", "PACKET_LOSS": "packet loss",
                 "NEW_TASK": "new P1 task", "FAULT": "battery fault", "JAMMING_START": "interference"}
        if e["type"] in kinds and e["mission_t"] is not None:
            events.append((e["mission_t"], kinds[e["type"]]))
    delivered = []
    for line in open(logs / "events.jsonl"):
        e = json.loads(line)
        if e["type"] == "DATA_DELIVERED":
            delivered.append(e["mission_t"])

    fig, (ax, ax2) = plt.subplots(2, 1, figsize=(7.1, 2.25), sharex=True,
                                  gridspec_kw={"height_ratios": [3.2, 1], "hspace": 0.12})
    uavs = sorted(rows)
    for i, u in enumerate(uavs):
        rs = rows[u]
        start, cur = float(rs[0]["mission_t"]), state(rs[0])
        for a, b in zip(rs, rs[1:] + [None]):
            nxt = state(b) if b else None
            if nxt != cur:
                end = float(b["mission_t"]) if b else float(a["mission_t"])
                ax.barh(i, end - start, left=start, height=0.62, color=colors[cur],
                        hatch="////" if cur == "failed" else None, edgecolor="white" if cur != "failed" else VIOLET,
                        linewidth=0.4)
                start, cur = end, nxt
    ax.set_yticks(range(len(uavs)), uavs)
    ax.invert_yaxis()
    seen = []
    for t, label in events:
        if any(abs(t - x) < 1 for x in seen):
            continue
        seen.append(t)
        ax.axvline(t, color=INK, lw=0.5, ls=(0, (2, 2)))
        ax2.axvline(t, color=INK, lw=0.5, ls=(0, (2, 2)))
        ax.text(t, -0.72, str(len(seen)), fontsize=6.3, color="white", ha="center", va="center",
                bbox=dict(boxstyle="circle,pad=0.18", fc=INK, ec="none"))
    handles = [Patch(color=colors[k], label=l) for k, l in
               (("scout", "scout"), ("relay", "relay"), ("home", "returning / standby"),
                ("pad", "on pad (swap, ready)"))]
    handles.append(Patch(facecolor="white", edgecolor=VIOLET, hatch="////", label="failed"))
    fig.legend(handles=handles, loc="lower center", bbox_to_anchor=(0.5, -0.02), ncol=5, fontsize=6.4, frameon=False)
    ax.set_ylim(len(uavs) - 0.4, -1.05)
    ax.spines["left"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    delivered.sort()
    ax2.step([0] + delivered + [900], list(range(len(delivered) + 1)) + [len(delivered)], where="post",
             color=BLUE, lw=1.1)
    ax2.set_ylabel("tasks\ndelivered")
    ax2.set_xlabel("mission time (s)")
    ax2.set_xlim(0, 900)
    ax2.grid(axis="y")
    fig.subplots_adjust(left=0.07, right=0.99, top=0.95, bottom=0.27)
    print("timeline events:", [(round(t), l) for t, l in events])
    fig.savefig(OUT / "fig_timeline.svg"); fig.savefig(OUT / "fig_timeline.pdf")


def results():
    r = json.loads((ROOT / "results" / "uavx_benchmarks.json").read_text())
    a, b = r["aggregate"], r["baseline_aggregate"]
    pct = [("completion_rate", "Completion"), ("priority_weighted_score", "Priority-weighted score"),
           ("packet_delivery_ratio", "Packet delivery ratio"), ("connectivity_availability", "Connectivity"),
           ("post_disruption_availability", "Connectivity after faults")]
    secs = [("emergent_response_s", "Emergency response"), ("recovery_time_s_mean", "Recovery time"),
            ("downtime_s_total", "Total downtime")]
    fig, (ax, ax2) = plt.subplots(1, 2, figsize=(7.1, 1.8),
                                  gridspec_kw={"width_ratios": [1.2, 1], "wspace": 0.6})
    # Dot plot: a zoomed axis is honest for dots, not for bars
    for i, (k, _) in enumerate(pct):
        va, vb = a[k]["mean"] * 100, b[k]["mean"] * 100
        ax.plot([vb, va], [i, i], color=LIGHT, lw=2.2, zorder=1)
        ax.plot(vb, i, "o", ms=6, color=ORANGE, mec="white", mew=0.8, zorder=3)
        ax.plot(va, i, "o", ms=6, color=BLUE, mec="white", mew=0.8, zorder=3)
        ax.text(va + 0.6, i, f"{va:.1f}", va="center", fontsize=6, color=INK)
        ax.text(vb - 0.6, i, f"{vb:.1f}", va="center", ha="right", fontsize=6, color=INK2)
    ax.set_yticks(range(len(pct)), [l for _, l in pct])
    ax.invert_yaxis()
    ax.set_xlim(78, 101)
    ax.set_ylim(len(pct) - 0.5, -0.6)
    ax.set_xlabel("percent, mean over 12 runs (higher is better)")
    ax.grid(axis="x")
    ax.set_axisbelow(True)
    ax.legend([plt.Line2D([], [], ls="", marker="o", color=BLUE), plt.Line2D([], [], ls="", marker="o", color=ORANGE)],
              ["adaptive (C-DAWN)", "fixed-role baseline"], loc="lower left", bbox_to_anchor=(0.0, 1.0),
              ncol=2, fontsize=6.4, handletextpad=0.2)
    y2 = range(len(secs))
    ax2.barh([i - 0.19 for i in y2], [a[k]["mean"] for k, _ in secs], height=0.36, color=BLUE)
    ax2.barh([i + 0.19 for i in y2], [b[k]["mean"] for k, _ in secs], height=0.36, color=ORANGE)
    for i, (k, _) in enumerate(secs):
        ax2.text(a[k]["mean"] + 3, i - 0.19, f"{a[k]['mean']:.0f} s", va="center", fontsize=6, color=INK)
        ax2.text(b[k]["mean"] + 3, i + 0.19, f"{b[k]['mean']:.0f} s", va="center", fontsize=6, color=INK2)
    ax2.set_yticks(list(y2), [l for _, l in secs])
    ax2.invert_yaxis()
    ax2.set_xlabel("seconds, mean over 12 runs (lower is better)")
    ax2.set_xlim(0, max(b[k]["mean"] for k, _ in secs) * 1.25)
    ax2.grid(axis="x")
    ax2.set_axisbelow(True)
    fig.subplots_adjust(left=0.16, right=0.98, top=0.86, bottom=0.22)
    fig.savefig(OUT / "fig_results.svg"); fig.savefig(OUT / "fig_results.pdf")


if __name__ == "__main__":
    chain()
    energy()
    timeline()
    results()
    print("figures written to", OUT)

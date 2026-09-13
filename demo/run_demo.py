#!/usr/bin/env python3
"""
Legacy single-laptop entry point.

Kept so `python demo/run_demo.py` keeps working. It is exactly equivalent to

    python run_node.py --role all

and forwards any other arguments. For the three-laptop deployment use
`run_node.py` directly — see the README.
"""

import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(PROJECT_ROOT))

if __name__ == "__main__":
    if "--role" not in sys.argv:
        sys.argv[1:1] = ["--role", "all"]

    # --headless was the old spelling of --no-browser
    sys.argv = ["--no-browser" if a == "--headless" else a for a in sys.argv]

    import run_node
    run_node.main()

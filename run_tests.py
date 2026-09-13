#!/usr/bin/env python3
"""
Test runner for C-DAWN test suite.
Can be run directly with: python run_tests.py
"""
import sys
import os
import inspect
import traceback

# Ensure project root is in path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from tests import test_simulation
from tests import test_ltc
from tests import test_gnn
from tests import test_scm
from tests import test_mesh
from tests import test_rag
from tests import test_demo
from tests import test_cluster

test_modules = [
    ("Phase 1: Simulation Engine", test_simulation),
    ("Phase 2: LTC Flight Controller", test_ltc),
    ("Phase 3: E(3)-GNN Relay Topology", test_gnn),
    ("Phase 4: SCM Causal Diagnostics", test_scm),
    ("Phase 6: Mesh Network & Routing", test_mesh),
    ("Phase 5: RAG Intelligence Pipeline", test_rag),
    ("Phase 8: Scenarios & Telemetry", test_demo),
    ("Phase 9: Three-Node Cluster", test_cluster),
]

def main():
    total_passed = 0
    total_failed = 0
    total_tests = 0

    print("=" * 65)
    print(" C-DAWN TEST SUITE EXECUTION")
    print("=" * 65)

    for module_name, mod in test_modules:
        print(f"\n--- {module_name} ---")
        functions = [
            (name, func)
            for name, func in inspect.getmembers(mod, inspect.isfunction)
            if name.startswith("test_")
        ]
        
        for name, func in functions:
            total_tests += 1
            try:
                func()
                print(f"  [PASS] {name}")
                total_passed += 1
            except Exception as e:
                print(f"  [FAIL] {name}: {e}")
                traceback.print_exc(file=sys.stdout)
                total_failed += 1

    print("\n" + "=" * 65)
    print(f"Results: {total_passed}/{total_tests} passed, {total_failed} failed.")
    print("=" * 65)

    return 0 if total_failed == 0 else 1

if __name__ == "__main__":
    sys.exit(main())

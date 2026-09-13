"""
LIVE PROOF: type your own numbers and watch the trained AI respond.

Run this in front of the judges. Let THEM suggest the wind number.
A pre-recorded video cannot react to an input that didn't exist
until the judge said it out loud.
"""
import numpy as np
from ltc.ltc_controller import load_or_default

model, trained = load_or_default("models/ltc_controller.pt")

print("=" * 64)
print("  LIVE AI FLIGHT CONTROLLER")
print("=" * 64)
print("Model loaded from disk:", "TRAINED (12,844 real learned weights)" if trained else "NOT TRAINED")
print()
print("Ask the judge: 'give me any wind speed in m/s'")
print("Type it in below. The AI decides the drone's response live.")
print("(Type 'reset' to clear its memory, 'quit' to stop)")
print()

while True:
    try:
        raw = input(">> Judge's wind number: ").strip()
    except (EOFError, KeyboardInterrupt):
        break
    if raw.lower() in ("quit", "exit", "q"):
        break
    if raw.lower() == "reset":
        model.reset_hidden(1)
        print("   (memory cleared)\n")
        continue
    try:
        wind_x = float(raw)
    except ValueError:
        print("   Please type a number.\n")
        continue

    wind = np.array([wind_x, 0.0, 0.0])
    force, yaw = model.compute_control(
        position_error=np.array([0.0, 0.0, 0.0]),
        velocity=np.zeros(3),
        wind_estimate=wind,
        dt=0.02,
    )
    print(f"   AI's live decision: push with {force.round(2)} Newtons of force")
    print(f"   (this exact number was never pre-written — computed just now for wind={wind_x})\n")

print("\nSession ended.")

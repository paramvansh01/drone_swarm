"""
Signed JSON payload construction for mesh transport.

Creates compact, signed payloads for transmitting detection
results and SITREPs over the mesh network.
"""

import json
import hashlib
import time
import numpy as np
from typing import Dict, Optional


def create_payload(
    source_drone: str,
    payload_type: str,
    data: dict,
    secret_key: str = "cdawn-demo-key",
) -> dict:
    """
    Create a signed JSON payload for mesh transport.

    Args:
        source_drone: ID of the originating drone.
        payload_type: Type of payload ("detection", "sitrep", "telemetry").
        data: Payload data dict.
        secret_key: HMAC key for signature.

    Returns:
        Signed payload dict.
    """
    payload = {
        "version": "1.0",
        "type": payload_type,
        "source": source_drone,
        "timestamp": time.time(),
        "data": data,
    }

    # Compute signature
    payload_str = json.dumps(payload, sort_keys=True, default=str)
    signature = hashlib.sha256(
        (payload_str + secret_key).encode()
    ).hexdigest()[:16]

    payload["signature"] = signature

    return payload


def verify_payload(payload: dict, secret_key: str = "cdawn-demo-key") -> bool:
    """Verify a signed payload."""
    sig = payload.pop("signature", None)
    if sig is None:
        return False

    payload_str = json.dumps(payload, sort_keys=True, default=str)
    expected = hashlib.sha256(
        (payload_str + secret_key).encode()
    ).hexdigest()[:16]

    payload["signature"] = sig
    return sig == expected


def compact_payload(payload: dict) -> bytes:
    """Compress payload to compact bytes for bandwidth-constrained mesh."""
    return json.dumps(payload, separators=(",", ":"), default=str).encode("utf-8")


def estimate_payload_size(payload: dict) -> int:
    """Estimate payload size in bytes."""
    return len(compact_payload(payload))

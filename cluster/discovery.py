"""
LAN peer discovery for the C-DAWN 3-node deployment.

At a demonstration you are handed three laptops on a venue Wi-Fi network and
have a couple of minutes to bring them up. Typing IP addresses is possible
but it is the single most likely thing to go wrong under time pressure, so
nodes announce themselves over UDP broadcast and find each other
automatically. An explicit `--peer <ip>` always overrides discovery, because
some venue networks disable broadcast between wireless clients (client
isolation) and you need a way through that.

Protocol: a one-line JSON beacon on UDP/45454, broadcast every 2 seconds.
"""

from __future__ import annotations

import json
import logging
import socket
import threading
import time
from typing import Callable, Dict, Optional

logger = logging.getLogger("cdawn.cluster.discovery")

DISCOVERY_PORT = 45454
BEACON_INTERVAL = 2.0
PEER_TIMEOUT = 8.0
MAGIC = "C-DAWN/1"


def get_lan_ip() -> str:
    """
    Best-effort primary LAN address of this machine.

    Opens a UDP socket toward a public address and asks the OS which local
    interface it would route through. Nothing is transmitted, and it works
    offline — the kernel answers from the routing table. This is far more
    reliable than `gethostbyname(gethostname())`, which returns 127.0.0.1 on
    many Linux setups and the wrong interface on multi-homed machines.
    """
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        sock.connect(("8.8.8.8", 80))
        return sock.getsockname()[0]
    except Exception:
        try:
            return socket.gethostbyname(socket.gethostname())
        except Exception:
            return "127.0.0.1"
    finally:
        sock.close()


def _broadcast_addresses() -> list:
    """Candidate broadcast targets, most specific first."""
    ip = get_lan_ip()
    targets = ["255.255.255.255"]
    parts = ip.split(".")
    if len(parts) == 4 and ip != "127.0.0.1":
        targets.insert(0, f"{parts[0]}.{parts[1]}.{parts[2]}.255")
    return targets


class DiscoveryService:
    """Broadcasts this node's presence and tracks the peers it hears."""

    def __init__(
        self,
        node_id: str,
        role: str,
        port: int,
        on_peer: Optional[Callable[[dict], None]] = None,
    ):
        self.node_id = node_id
        self.role = role
        self.port = port
        self.on_peer = on_peer

        self.ip = get_lan_ip()
        self.peers: Dict[str, dict] = {}

        self._running = False
        self._threads: list = []
        self._lock = threading.Lock()

    # ----------------------------------------------------------------------

    def start(self):
        if self._running:
            return
        self._running = True

        for target in (self._beacon_loop, self._listen_loop, self._reap_loop):
            thread = threading.Thread(target=target, daemon=True)
            thread.start()
            self._threads.append(thread)

        logger.info("Discovery started for %s (%s) at %s:%d",
                    self.node_id, self.role, self.ip, self.port)

    def stop(self):
        self._running = False

    # ----------------------------------------------------------------------

    def _beacon_payload(self) -> bytes:
        return json.dumps({
            "magic": MAGIC,
            "node_id": self.node_id,
            "role": self.role,
            "ip": self.ip,
            "port": self.port,
            "t": time.time(),
        }).encode("utf-8")

    def _beacon_loop(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        targets = _broadcast_addresses()

        while self._running:
            payload = self._beacon_payload()
            for target in targets:
                try:
                    sock.sendto(payload, (target, DISCOVERY_PORT))
                except OSError:
                    # A down or unroutable interface should not kill the beacon
                    pass
            time.sleep(BEACON_INTERVAL)

        sock.close()

    def _listen_loop(self):
        sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            # SO_REUSEPORT lets several nodes share the port on one machine,
            # which is exactly what happens when the whole cluster is
            # rehearsed on a single laptop before the demo.
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEPORT, 1)
        except (AttributeError, OSError):
            pass

        try:
            sock.bind(("", DISCOVERY_PORT))
        except OSError as exc:
            logger.warning("Could not bind discovery port %d: %s", DISCOVERY_PORT, exc)
            return

        sock.settimeout(1.0)

        while self._running:
            try:
                data, addr = sock.recvfrom(2048)
            except socket.timeout:
                continue
            except OSError:
                break

            try:
                msg = json.loads(data.decode("utf-8"))
            except (ValueError, UnicodeDecodeError):
                continue

            if msg.get("magic") != MAGIC:
                continue
            if msg.get("node_id") == self.node_id:
                continue

            msg["last_seen"] = time.time()
            msg["address"] = addr[0]

            with self._lock:
                known = msg["node_id"] in self.peers
                self.peers[msg["node_id"]] = msg

            if not known:
                logger.info("Discovered peer %s (%s) at %s:%s",
                            msg["node_id"], msg.get("role"),
                            msg.get("ip"), msg.get("port"))
                if self.on_peer:
                    try:
                        self.on_peer(msg)
                    except Exception as exc:
                        logger.error("Peer callback error: %s", exc)

        sock.close()

    def _reap_loop(self):
        """Drop peers we have stopped hearing from."""
        while self._running:
            now = time.time()
            with self._lock:
                stale = [n for n, p in self.peers.items()
                         if now - p["last_seen"] > PEER_TIMEOUT]
                for node_id in stale:
                    logger.warning("Lost peer %s", node_id)
                    del self.peers[node_id]
            time.sleep(1.0)

    # ----------------------------------------------------------------------

    def get_peers(self) -> Dict[str, dict]:
        with self._lock:
            return dict(self.peers)

    def find_role(self, role: str) -> Optional[dict]:
        """Return the first live peer advertising the given role."""
        with self._lock:
            for peer in self.peers.values():
                if peer.get("role") == role:
                    return dict(peer)
        return None

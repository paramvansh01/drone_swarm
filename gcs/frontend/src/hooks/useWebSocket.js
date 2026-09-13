import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Telemetry WebSocket with automatic reconnection.
 *
 * Connects back to whichever host served the page, so opening any node's LAN
 * address in a browser streams from that node with no configuration.
 */
export default function useWebSocket(url = null) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const [lastResult, setLastResult] = useState(null);

  const wsRef = useRef(null);
  // This ref genuinely did not exist before: `onclose` assigned to
  // `reconnectTimer.current` on an undeclared identifier, so the very first
  // disconnect threw a ReferenceError inside the handler and killed
  // reconnection entirely — the dashboard simply went dead and stayed dead.
  const reconnectTimer = useRef(null);
  const shouldReconnect = useRef(true);
  const backoff = useRef(1000);

  const target = url || (() => {
    if (typeof window === 'undefined') return 'ws://localhost:8080/ws/telemetry';
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host || 'localhost:8080';
    return `${protocol}//${host}/ws/telemetry`;
  })();

  const connect = useCallback(() => {
    if (!shouldReconnect.current) return;

    let socket;
    try {
      socket = new WebSocket(target);
    } catch (err) {
      console.error('[ws] construction failed', err);
      reconnectTimer.current = setTimeout(connect, backoff.current);
      return;
    }

    socket.onopen = () => {
      setConnected(true);
      backoff.current = 1000;      // reset the backoff on a good connection
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        // Only telemetry frames replace the dashboard state. Command
        // acknowledgements used to be stored as `data` too, which for one
        // frame wiped every drone off the screen after each button press.
        if (message.type === 'cmd_result') {
          setLastResult({ ...message, at: Date.now() });
        } else if (message.type === 'ack') {
          /* acknowledgement of a legacy command — nothing to render */
        } else {
          setData(message);
        }
      } catch (err) {
        console.error('[ws] parse error', err);
      }
    };

    socket.onclose = () => {
      setConnected(false);
      if (!shouldReconnect.current) return;
      // Exponential backoff, capped: a node that is genuinely down should not
      // be hammered once a second for the length of the demonstration.
      reconnectTimer.current = setTimeout(connect, backoff.current);
      backoff.current = Math.min(backoff.current * 1.6, 10000);
    };

    socket.onerror = () => socket.close();

    wsRef.current = socket;
  }, [target]);

  const sendCommand = useCallback((action, params = {}) => {
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action, ...params }));
    }
  }, []);

  /** Send an operator command: {name, params} -> cmd_result message. */
  const runCommand = useCallback((name, params = {}) => {
    const socket = wsRef.current;
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ action: 'cmd', name, params }));
      return true;
    }
    setLastResult({ name, result: { ok: false, error: 'not connected' }, at: Date.now() });
    return false;
  }, []);

  useEffect(() => {
    shouldReconnect.current = true;
    connect();

    return () => {
      shouldReconnect.current = false;
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { data, connected, sendCommand, runCommand, lastResult };
}

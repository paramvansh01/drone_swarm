import { useState, useEffect, useRef, useCallback } from 'react';

export default function useWebSocket(url = null) {
  const [data, setData] = useState(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const protocol = typeof window !== 'undefined' && window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const host = typeof window !== 'undefined' && window.location.host ? window.location.host : 'localhost:8080';
  const wsUrl = url || `${protocol}//${host}/ws/telemetry`;

  const connect = useCallback(() => {
    try {
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        setConnected(true);
        console.log('[WS] Connected');
      };

      ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          setData(parsed);
        } catch (e) {
          console.error('[WS] Parse error:', e);
        }
      };

      ws.onclose = () => {
        setConnected(false);
        console.log('[WS] Disconnected. Reconnecting in 2s...');
        reconnectTimer.current = setTimeout(connect, 2000);
      };

      ws.onerror = (err) => {
        console.error('[WS] Error:', err);
        ws.close();
      };

      wsRef.current = ws;
    } catch (e) {
      console.error('[WS] Connection failed:', e);
      reconnectTimer.current = setTimeout(connect, 3000);
    }
  }, [wsUrl]);

  const sendCommand = useCallback((action, params = {}) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ action, ...params }));
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connect]);

  return { data, connected, sendCommand };
}

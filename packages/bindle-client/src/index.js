let ws;
let onReceiveCallback = null;

export function connect(url = 'ws://localhost:8090') {
  ws = new window.WebSocket(url);
  ws.onopen = () => {
    console.log('WebSocket connection established');
  };
  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };
  ws.onclose = () => {
    console.warn('WebSocket connection closed');
  };
  ws.onmessage = (event) => {
    if (onReceiveCallback) {
      onReceiveCallback(event.data);
    }
  };
}

export function send(data) {
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(data);
  }
}

export function onReceive(callback) {
  onReceiveCallback = callback;
}
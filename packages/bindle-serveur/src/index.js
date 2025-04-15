const WebSocket = require('ws');

let wss;
let clients = new Set();

function start(port = 8090) {
  wss = new WebSocket.Server({ port });
  wss.on('upgrade', function (req, socket, head) {
    const { pathname } = parse(req.url, true);
    if (pathname !== '/_next/webpack-hmr') {
        wss.handleUpgrade(req, socket, head, function done(ws) {
            wss.emit('connection', ws, req);
        });
    }
  });

  wss.on('connection', (ws) => {
    clients.add(ws);
    ws.on('message', (message) => {
      // Broadcast to all clients, including the sender
      for (const client of clients) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      }
    });
    ws.on('close', () => {
      clients.delete(ws);
    });
  });
  console.log(`WebSocket server started on ws://localhost:${port}`);
}

module.exports = { start };
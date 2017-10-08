import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
//  console.log('client connected!');
  ws.on('message', (message) => {
    // console.log(`Message received: ${message}`);
    try {
      ws.send(message);
    } catch (err) {
      console.log(`Error on sending: ${err.message}`);
    }
  });
});

const printMetrics = () => {
  console.log(`Number of connected clients: ${wss.clients.size}`);
};

setInterval(printMetrics, 5000);

console.log('Started ws Server on localhost:8080');

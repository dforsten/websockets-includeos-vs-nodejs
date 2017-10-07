import WebSocket from 'ws';

const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
//  console.log('client connected!');
  ws.on('message', (message) => {
    // console.log(`Message received: ${message}`);
    const json = JSON.parse(message);
    const reply = {
      type: 'move confirmed',
      move: json.move,
    };
    ws.send(JSON.stringify(reply));
  });

  ws.send('{"something": 1}');
});

const printMetrics = () => {
  console.log(`Number of connected clients: ${wss.clients.size}`);
};

setInterval(printMetrics, 5000);

console.log('Started ws Server on localhost:8080');

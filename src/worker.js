import WebSocket from 'ws';

const MAX_CONNECTIONS = 100;

for (let i = 0; i < MAX_CONNECTIONS; ++i) {
  const ws = new WebSocket('ws://localhost:8080');

  ws.on('open', () => {
    // console.log('Connected to ws server!');
    ws.send('{"type": "initial state"}');
  });

  ws.on('message', () => {
    // console.log(data);
    ws.send('{"type": "initial state"}');
  });
}

console.log('Worker started!');


// process.on('message', (msg) => {
//   console.log('Message from Controller:', msg);
// });

process.send({ count: 2 });

import WebSocket from 'ws';

const MAX_CONNECTIONS = 2000;
const BATCH_SIZE = 3;
const BATCH_DELAY = 200;

let curConnected = 0;

const connectBatch = () => {
  for (let i = 0; i < BATCH_SIZE; ++i) {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onerror = ((err) => {
      console.log(`Connection error: ${err.message}`);
    });

    ws.on('open', () => {
      // console.log('Connected to ws server!');
      ws.send('{"type": "initial state"}');
    });

    ws.on('message', () => {
      // console.log(data);
      ws.send('{"type": "initial state"}');
    });
  }

  curConnected += BATCH_SIZE;
  if (curConnected < MAX_CONNECTIONS) {
    setTimeout(connectBatch, BATCH_DELAY);
  }
};

connectBatch();

console.log('Worker started!');


// process.on('message', (msg) => {
//   console.log('Message from Controller:', msg);
// });

process.send({ count: 2 });

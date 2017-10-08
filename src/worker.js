import WebSocket from 'ws';

const MAX_CONNECTIONS = 2000;
const BATCH_SIZE = 3;
const BATCH_DELAY = 200;
const REPORT_DELAY = 200;

let curConnected = 0;
let fullRoundtrips = 0;

const timestampToJSON = () => JSON.stringify({ timestamp: Date.now() });

const handleMessage = (ws) => {
  // Increment counter
  fullRoundtrips += 1;
  // Trigger next roundtrip      
  ws.send('{"type": "initial state"}');
};

const connectBatch = () => {
  for (let i = 0; i < BATCH_SIZE; ++i) {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onerror = ((err) => {
      console.log(`Connection error: ${err.message}`);
    });

    ws.on('open', () => {
      // console.log('Connected to ws server!');
      ws.send(timestampToJSON());
    });

    ws.on('message', () => {
      handleMessage(ws);
    });
  }

  curConnected += BATCH_SIZE;
  if (curConnected < MAX_CONNECTIONS) {
    setTimeout(connectBatch, BATCH_DELAY);
  }
};

connectBatch();

// process.on('message', (msg) => {
//   console.log('Message from Controller:', msg);
// });

setInterval(() => {
  process.send({ roundtrips: fullRoundtrips });
  fullRoundtrips = 0;
}, REPORT_DELAY);

console.log('Worker started!');

import ChildProcess from 'child_process';
import path from 'path';

console.log('client started');

const MAX_WORKERS = 5;

let messagesPerSecond = 0;

setInterval(() => {
  console.log(`Roundtrips per second: ${messagesPerSecond}`);
  messagesPerSecond = 0;
}, 1000);

const handleMessage = (msg) => {
  // console.log('Message from Worker: ', msg);
  messagesPerSecond += msg.roundtrips;
};

const handleWorkerExit = (code, signal) => {
  console.log('worker exited with ' +
    `code ${code} and signal ${signal}`);
};

for (let i = 0; i < MAX_WORKERS; ++i) {
  const worker = ChildProcess.fork(path.join(__dirname, '/worker.js'), []);
  worker.on('message', handleMessage);
  worker.on('exit', handleWorkerExit);
}

// worker.send({ hello: 'world' });

console.log('client.js ended!');

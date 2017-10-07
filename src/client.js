import ChildProcess from 'child_process';
import path from 'path';

console.log('client started');

const MAX_WORKERS = 5;
let numWorkers = MAX_WORKERS;
let sum = 0;

const printMetrics = () => {
  console.log(`Grand Total: ${sum}`);
};

const handleMessage = (msg) => {
  console.log('Message from Worker: ', msg);
  sum += msg.count;
};

const handleWorkerExit = (code, signal) => {
  console.log('worker exited with ' +
    `code ${code} and signal ${signal}`);
  numWorkers -= 1;
  if (!numWorkers) {
    printMetrics();
  }
};

for (let i = 0; i < MAX_WORKERS; ++i) {
  const worker = ChildProcess.fork(path.join(__dirname, '/worker.js'), []);
  worker.on('message', handleMessage);
  worker.on('exit', handleWorkerExit);
}

// worker.send({ hello: 'world' });

console.log('client.js ended!');

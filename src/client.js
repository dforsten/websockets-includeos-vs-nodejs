import ChildProcess from 'child_process';
import path from 'path';

const server = process.argv[2];

if (!server) {
  console.log('Please specify a server to test (e.g.: 10.0.0.42 or localhost:8080)');
  process.exit(1);
}

console.log(`benchmarking server ${server}`);

const MAX_WORKERS = 5;

let messagesPerSecond = 0;
let numAverageLatencies = 0;
let averageLatency = 0;

setInterval(() => {
  averageLatency /= numAverageLatencies;
  console.log(`Roundtrips per second: ${messagesPerSecond}, at average latency: ${averageLatency}ms`);
  messagesPerSecond = 0;
  numAverageLatencies = 0;
  averageLatency = 0;
}, 1000);

const handleMessage = (msg) => {
  // console.log('Message from Worker: ', msg);
  messagesPerSecond += msg.roundtrips;
  numAverageLatencies += 1;
  averageLatency += msg.averageLatency;
};

const handleWorkerExit = (code, signal) => {
  console.log('worker exited with ' +
    `code ${code} and signal ${signal}`);
};

for (let i = 0; i < MAX_WORKERS; ++i) {
  const worker = ChildProcess.fork(path.join(__dirname, '/worker.js'), [ server ]);
  worker.on('message', handleMessage);
  worker.on('exit', handleWorkerExit);
}

// worker.send({ hello: 'world' });

console.log('client.js ended!');

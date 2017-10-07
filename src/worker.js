console.log('Worker started!');

// process.on('message', (msg) => {
//   console.log('Message from Controller:', msg);
// });

process.send({ count: 2 });

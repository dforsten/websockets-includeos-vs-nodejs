Follow-up to the Qt/C++ User Group Graz [C++ Coding Dojo](https://www.meetup.com/preview/Graz-Qt-C-11-Meetup/events/240890363) on writing multiplayer game APIs using Websockets and [IncludeOS](https://github.com/hioa-cs/IncludeOS).

# tl;dr

**IncludeOS** is an includable, minimal unikernel operating system for C++ services running in the cloud and as such an interesting option to implement API servers with an extremely low memory footprint and high performance.

To test these assumptions I wrote a performance test and two Websocket API servers to assess the following metrics:
* Full round-trip requests from client to server and back, per second
* Average latency for the round-trip, in milliseconds
* Memory usage
* CPU usage

The tests were run with 10,000 simultaneous Websocket connections, each sending and receiving messages at maximum possible speed.

The tests show that the IncludeOS implementation substantially outperforms the node.js version:
* 3x the number of API calls per second
* 2.5x lower latency for API calls
* 14% less memory use with 10,000 active Websockets connections (comparing a full Operating System running in a VM to a single node.js process running in a Docker container)
* A single CPU was pegged out in both cases, with docker_proxy pegging out another CPU in the node.js/Docker combination compared to IncludeOS running in a VM

# Test Setup

The WebSocket clients for benchmarking are using the mature node.js "ws" library, known for its stability and speed, starting 5 node.js processes, each establishing 2000 connections.

The node.js and IncludeOS servers tested are run on a single thread each, where the node.js process is run in a Docker container while IncludeOS is run in a VM using qemu.

## Benchmark the node.js server:

### Start the server
```
npm run build-production
./build_docker.sh
./run_docker.sh
```

### Start the benchmark client
```
npm run start-benchmark localhost:8080
```

## Benchmark the includeos server:

### Start the server
```
cd includeos
./boot_with_bridge.sh
```

### Start the benchmark client
```
npm run start-benchmark 10.0.0.42
```

# Benchmarking Results:

## Test System:
* CPU: Haswell i7-5820K at 4GHz
* Mainboard: Asus X99-A
* Ubuntu 16.04

## Test procedure

5 node.js processes are connecting to the server at a rate of 75 per second, which was the highest rate at which the node.js server was able to take on 10,000 connections in this test setup.

Each of the Websocket clients immediately start sending messages to the server, consisting of a JSON object containing the current timestamp on the client.

This JSON message is immediately sent back to the client where it is used to calculate the latency of the client->server->client round-trip. After receiving the message and calculating the latency the client immediately sends the next time stamp message.

The number of completed round-trips and the average latency is calculated and written to the console.

## Test Results for node.js/ws
Using the trusty 'ws' library we get pretty stable performance,
connections had to be batched to 75/second to avoid refused connections in the ramp-up phase.

After all 10,000 Websocket clients connected the number of completed round-trips was between 30,000 and 35,000, with the latency ranging between 280ms and 310ms.

Memory use at 180MB for the node process alone.

Note: The "docker_proxy" process pegs a CPU at 100% as well when all 10,000 clients were connected, effectively doubling the CPU usage in the node.js/Docker combination.

## Test Results for IncludeOS
Using the Websockets implementation shipping with IncludeOS. The same ramp-up settings as for the node.js version are used.

When all 10,000 Websockets clients had connected the number of completed round-trips was between 110,000 and 115,000, with the latency ranging between 75ms and 115ms.

Memory use at 155MB.
Note: This includes a full operating system in a Virtual Machine.

Note: About 6 connections out of the 10,000 refused to connect on ramp-up, using the same settings as for the node.js version. After ramp-up the behavior was stable without connections getting dropped.

Note: The default 128MB heap size is just enough for the 10,000 connections, at about 10,500 connection the server runs out out of memory.
      Extending the heap size is recommended for this number of connections.
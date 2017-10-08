Follow-up to the [C++ Coding Dojo](https://www.meetup.com/preview/Graz-Qt-C-11-Meetup/events/240890363) for Websockets using IncludeOS.

##For benchmarking the node.js server:

###Start the server
npm run build-production
./build_docker.sh
./run_docker.sh

###Start the benchmark client
npm run start-benchmark localhost:8080

##For benchmarking the includeos server:

###Start the server
cd includeos
./boot_with_bridge.sh

###Start the benchmark client
npm run start-benchmark 10.0.0.42

#Benchmark Results:

##Test System:
CPU: Haswell i7-5820K at 4GHz
Mainboard: Asus X99-A
Ubuntu 16.04

##Test Results for node.js/ws
Using the trusty 'ws' library we get pretty stable performance,
connections had to be batched to 20/second to avoid refused connections.

After all 10,000 Websocket clients connected the number of completed rount-trips was between 30,000 and 35,000, with the latency ranging between 280ms and 310ms.
Memory use at 180MB for the node process alone.
Note: The "docker_proxy" process pegs a CPU at 100% as well when all 10,000 clients were connected, effectively doubling the CPU usage in the node.js/Docker combination.

##Test Results for IncludeOS
Using the built-in Websockets implementation, about 5 connections out of the 10,000 refused to connect on ramp-up, using the same settings as for the node.js version. After ramp-up the behavior was stable without connections getting dropped.

When all 10,000 Websockets clients had connected the number of completed round-trips was between 110,000 and 115,000, with the latency ranging between 75ms and 115ms.
Memory use at 155MB.
Note: The default 128MB heap size is just enough for the 10,000 connections, at about 10,500 connection the server runs out out of memory.
      Extending the heap size is recommended for this number of connections.
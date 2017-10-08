
Follow-up to the [C++ Coding Dojo](https://www.meetup.com/preview/Graz-Qt-C-11-Meetup/events/240890363) for Websockets using IncludeOS.

##For benchmarking the node.js server:

###Start the server
npm run build-production
./build_docker.sh
./run_docker.sh

###Start the benchmark client
npm run start-benchmark

##For benchmarking the includeos server:

###Start the server
cd includeos
./boot_with_bridge.sh

###Start the benchmark client
npm run start-benchmark
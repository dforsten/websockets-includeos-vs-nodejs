// This file is a part of the IncludeOS unikernel - www.includeos.org
//
// Copyright 2017 Oslo and Akershus University College of Applied Sciences
// and Alfred Bratterud
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

#include <net/inet4>
#include <net/ws/websocket.hpp>
#include <service>

static std::map<int, net::WebSocket_ptr> websockets;
static int idx = 0;

void print_num_clients()
{
  printf("Number of connected clients: %lu\n", websockets.size());
}

void handle_ws(net::WebSocket_ptr ws)
{
  // nullptr means the WS attempt failed
  if(not ws) {
    printf("WS failed\n");
    return;
  }
  //printf("WS Connected: %s\n", ws->to_string().c_str());

  // Setup echo reply
  ws->on_read = [ws = ws.get()](auto msg) {
    auto str = msg->as_text();
    //printf("WS Recv: %s\n", str.c_str());
    ws->write(str);
  };

  websockets[idx] = std::move(ws);
  // Notify on close
//  websockets[idx]->on_close = [key = idx](auto code) {
//    printf("WS Closing (%u) %s\n", code, websockets[key]->to_string().c_str());
//  };
  idx++;
}

#include <net/http/server.hpp>
std::unique_ptr<http::Server> server;

void Service::start()
{
  // Retreive the stack (configured from outside)
  auto& inet = net::Inet4::stack<0>();
  Expects(inet.is_configured());

  // Create a HTTP Server and setup request handling
  server = std::make_unique<http::Server>(inet.tcp());
  server->on_request([] (auto req, auto rw)
  {
    // We only support get
    if(req->method() != http::GET) {
      rw->write_header(http::Not_Found);
      return;
    }
    // WebSockets go here
    if(req->uri() == "/") {
      auto ws = net::WebSocket::upgrade(*req, *rw);
      handle_ws(std::move(ws));
    }
    else {
      rw->write_header(http::Not_Found);
    }
  });

  // Start listening on port 80
  server->listen(80);

  Timers::periodic(1s, 1s,
    [&inet] (uint32_t) {
      print_num_clients();
    });    
}

const express = require("express");
const next = require("next");
const { Server } = require('socket.io');
const http = require('http');

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

    io.on("connection", (socket) => {
    console.log(socket.id, "connected")

    socket.on("message",(message)=>{
      console.log("Message : ",message)
      socket.broadcast.emit("message",message)
    })


    //Tic Tac Toe 
    
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.post("/api/auth/*", (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});
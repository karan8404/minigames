const express = require("express");
const next = require("next");
const { Server } = require('socket.io');
const http = require('http');

const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const activeUsers = new Set();

//tic tac toe
const ticTacToePlayers = new Set();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  server.use(express.json());

    io.on("connection", (socket) => {
    console.log(socket.id, "connected")

    socket.on("message",(message)=>{
      console.log("Message : ",message)
      socket.broadcast.emit("message",message)
    })

    socket.on('heartbeat', (userID) => {
      activeUsers.add(userID);
  
      // Remove user if no heartbeat received for 10 seconds
      setTimeout(() => {
          if (!activeUsers.has(userID)) {
              ticTacToePlayers.delete(userID);
              io.emit('availablePlayers', Array.from(ticTacToePlayers));
          }
      }, 10000);
  });


    //Tic Tac Toe 
    socket.on("searching", (userID) => {
      ticTacToePlayers.add(userID);
      console.log("Players", ticTacToePlayers);
      io.emit('availablePlayers', Array.from(ticTacToePlayers));
    });

    socket.on("leaveGame", (userID) => {
      console.log(userID, "disconnected")
      if(ticTacToePlayers.has(userID)) {
        ticTacToePlayers.delete(userID);
        io.emit('availablePlayers', Array.from(ticTacToePlayers));
      }
      activeUsers.delete(userID);
    });

    socket.on('startGame', (player1, player2) => {
      if(!(ticTacToePlayers.has(player1) && ticTacToePlayers.has(player2))) {
        console.log("Invalid Players");
        return;
      }
      ticTacToePlayers.delete(player1);
      ticTacToePlayers.delete(player2);
      io.emit('availablePlayers', Array.from(ticTacToePlayers));
      console.log("Game Started", player1, player2);
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.post("/api/auth/*", (req, res) => {
    return handle(req, res);
  });

  server.post("/api/getUser", (req, res) => {
    console.log("In Server" , req.query)
    return handle(req,res);
  });

  httpServer.listen(port, (err) => {
    if (err) throw err;
    console.log(`Ready on http://localhost:${port}`);
  });
});
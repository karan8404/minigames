import express from "express";
import next from "next";
import { Server } from "socket.io";
import http from "http";
import { Player } from "./components/tic-tac-toe/Player";
import { onlineGame } from "./components/tic-tac-toe/onlineGame";
import cors  from "cors";
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const activeUsers = new Set();

//tic tac toe
const ticTacToePlayers = new Map<string, Player>();
const ticTacToeGames = new Map();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer);

  server.use(express.json());
  server.use(cors());

  io.on("connection", (socket) => {
    console.log(socket.id, "connected");
    activeUsers.add(socket.id);

    socket.on("disconnect", () => {
      console.log(socket.id, "disconnected");
      activeUsers.delete(socket.id);

      if (ticTacToePlayers.has(socket.id)) {
        ticTacToePlayers.delete(socket.id);
        io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
      }
    });

    socket.on("message", (message: string) => {
      console.log("Message : ", message);
      socket.broadcast.emit("message", message);
    });

    socket.on("join", (room) => {
      console.log("Joining room", room);
      socket.join(room);
    });

    //   socket.on('heartbeat', (userID) => {
    //     activeUsers.add(userID);

    //     // Remove user if no heartbeat received for 10 seconds
    //     setTimeout(() => {
    //         if (!activeUsers.has(userID)) {
    //             ticTacToePlayers.delete(userID);
    //             io.emit('availablePlayers', Array.from(ticTacToePlayers));
    //         }
    //     }, 10000);
    // });

    //Tic Tac Toe
    socket.on("searching", (player: Player) => {
      ticTacToePlayers.set(player.socketID, player);
      console.log("Players", ticTacToePlayers);
      io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
    });

    socket.on("leaveGame", () => {
      console.log(socket.id, "disconnected");
      if (ticTacToePlayers.has(socket.id)) {
        ticTacToePlayers.delete(socket.id);
        io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
      }
      activeUsers.delete(socket.id);
    });

    socket.on("startGame", (player1: Player, player2: Player) => {
      if (
        !(
          ticTacToePlayers.has(player1.socketID) &&
          ticTacToePlayers.has(player2.socketID)
        )
      ) {
        console.log("Invalid Players");
        return;
      }
      ticTacToePlayers.delete(player1.socketID);
      ticTacToePlayers.delete(player2.socketID);

      io.emit("availablePlayers", Object.fromEntries(ticTacToePlayers));
      console.log("Game Started", player1.name, player2.name);

      const gameID = player1.socketID + player2.socketID;

      const game = new onlineGame(player1, player2, "X", true);
      ticTacToeGames.set(gameID, game);

      io.to([player1.socketID, player2.socketID]).emit(
        "gameStarted",
        gameID,
        game
      );
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.post("/api/auth/*", (req, res) => {
    return handle(req, res);
  });

  server.post("/api/getUser", (req, res) => {
    console.log("In Server", req.query);
    return handle(req, res);
  });

  httpServer.on("error", (err) => {
    console.error("Server error:", err);
  });

  httpServer.listen(port, () => {
    console.log(`Ready on http://localhost:${port}`);
  });
});

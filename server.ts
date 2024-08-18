import { config } from "dotenv";
config();

import express from "express";
import next from "next";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import { setupTicTacToeHandlers } from "./GameHandlers/TicTacToe";
import { setupLudoHandlers } from "./GameHandlers/Ludo";
const port = parseInt(process.env.PORT) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const activeUsers = new Set();

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
    });

    socket.on("message", (message: string) => {
      console.log("Message : ", message);
      socket.broadcast.emit("message", message);
    });

    setupTicTacToeHandlers(socket, io);
    setupLudoHandlers(socket, io);
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

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`Ready on http://localhost:${port}`);
  });
});

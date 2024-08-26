import { Server, Socket } from "socket.io";

export function setupSnLHandlers(socket: Socket, io: Server) {
  socket.on("hello", () => {
    console.log("Hello from Ludo");
  });
}

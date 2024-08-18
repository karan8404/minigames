import { Server, Socket } from "socket.io";

export function setupLudoHandlers(socket: Socket, io: Server) {
  socket.on("hello", () => {
    console.log("Hello from Ludo");
  });
}

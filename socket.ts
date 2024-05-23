import { config } from "dotenv";
config({ debug: true });
import { io } from "socket.io-client";

const port = parseInt(process.env.PORT);
const socketURL =
  process.env.NODE_ENV === "production"
    ? `https://minigames-production.up.railway.app:${port}`
    : "http://localhost:3000";
export const socket = io(socketURL);

import { config } from "dotenv";
config({ path:'.env',debug: true });
import { io } from "socket.io-client";

const port = parseInt(process.env.PORT);
console.log(port);
const socketURL =
  port === 3000
    ? "http://localhost:3000"
    : `https://minigames-production.up.railway.app:${port}`;
export const socket = io(socketURL);

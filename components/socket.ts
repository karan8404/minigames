"use client";
import { config } from 'dotenv';
config();
import { io } from "socket.io-client";
const port = process.env.PORT || 3000;
const host = process.env.HOST || 'localhost';
export const socket = io(`http://${host}:${port}`)
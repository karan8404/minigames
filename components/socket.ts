"use client";
import { config } from 'dotenv';
config({ path: './.env',debug:true});
import { io } from "socket.io-client";
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';
const port = process.env.PORT || 3000;
const socketURL =`https://${host}:${port}`;
export const socket = io(socketURL);
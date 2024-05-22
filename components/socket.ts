"use client";
import { config } from 'dotenv';
config();
import { io } from "socket.io-client";

const socketURL = process.env.PORT? `http://0.0.0.0:${process.env.PORT}` : 'http://localhost:3000';
export const socket = io(socketURL);
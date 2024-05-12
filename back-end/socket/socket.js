// socket.js
import { Server } from "socket.io";
import https from "https";
import express from "express";
import Message from "../models/messageModel.js";

const app = express();
const server = https.createServer(app);
const io = new Server(server);

io.use((socket, next) => {
  // Set the CORS origin to your frontend URL
  const origin = "https://anti-social-frontend.vercel.app";
  // Allow requests from the specified origin
  socket.handshake.headers.origin === origin
    ? next()
    : next(new Error("CORS error"));
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  socket.on("disconnect", () => {
    console.log("user disconnected");
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

io.on("error", (err) => {
  console.error("Socket.IO error:", err);
});

export { io, server, app };

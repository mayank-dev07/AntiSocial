// socket.js
import { Server } from "socket.io";
import https from "https";
import express from "express";
import cors from "cors"; // Import CORS middleware
import Message from "../models/messageModel.js";

const app = express();
const server = https.createServer(app);
const io = new Server(server);

// Apply CORS middleware
app.use(
  cors({
    origin: "https://anti-social-frontend.vercel.app",
    credentials: true,
  })
);

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

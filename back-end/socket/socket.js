// socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
// import Message from "../models/messageModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};

io.on("connection", (socket) => {
  // console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;

  if (userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    //   io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // socket.on("messageSeen", async ({ conversationId, userId }) => {
  //   console.log("message seen", conversationId);
  //   try {
  //     await Message.updateMany(
  //       { conversationId: conversationId, seen: false },
  //       { $set: { seen: true } }
  //     );
  //     console.log({ Message });
  //     io.to(userSocketMap[userId]).emit("messagesSeen", conversationId);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // });

  socket.on("disconnect", () => {
    // console.log("user disconnected");
    delete userSocketMap[userId];
    // io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

io.on("error", (err) => {
  console.error("Socket.IO error:", err);
});

export { io, server, app };

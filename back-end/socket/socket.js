// socket.js
import { Server } from "socket.io";
import http from "http";
import express from "express";
// import Message from "../models/messageModel.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://b43c5c841f0ed01b5817557c8a2ace44.serveo.net",
  },
});

export const getRecipientSocketId = (recipientId) => {
  return userSocketMap[recipientId];
};
const userSocketMap = {};
const onlineUsers = [];

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId && userId !== "undefined") {
    // //console.log("userId", userId);
    userSocketMap[userId] = socket.id;

    if (!onlineUsers.includes(userId)) {
      onlineUsers.push(userId);
    }
    // //console.log(onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  }

  socket.on("disconnect", () => {
    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      const index = onlineUsers.indexOf(userId);
      if (index !== -1) {
        onlineUsers.splice(index, 1);
      }
      // //console.log(onlineUsers);
      io.emit("getOnlineUsers", onlineUsers);
    }
  });
});

export { io, server, app };

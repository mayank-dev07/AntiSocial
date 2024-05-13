import express from "express";
import dotenv from "dotenv";
import connetDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";

dotenv.config();
connetDB();

const PORT = process.env.PORT || 8001;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
  optionSuccessStatus: 200,
};

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/uploads/profileimg", express.static("uploads/profileimg"));
app.use("/uploads/postimg", express.static("uploads/postimg"));
app.use("/uploads/messageimg", express.static("uploads/messageimg"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

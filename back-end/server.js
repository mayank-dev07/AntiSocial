import express from "express";
import dotenv from "dotenv";
import connetDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
connetDB();

const PORT = process.env.PORT || 8000;
const __dirname = path.resolve();

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middlewares
app.use(
  express.json({
    limit: "80mb",
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors(corsOptions));

// Static file serving
// app.use(
//   "/back-end/uploads/profileimg",
//   express.static(path.join(__dirname, "back-end/uploads/profileimg"))
// );
// app.use(
//   "/back-end/uploads/postimg",
//   express.static(path.join(__dirname, "back-end/uploads/postimg"))
// );
// app.use(
//   "/back-end/uploads/messageimg",
//   express.static(path.join(__dirname, "back-end/uploads/messageimg"))
// );

// Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/message", messageRouter);

// Serve static assets if in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/front-end/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-end", "dist", "index.html"));
  });
}

server.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

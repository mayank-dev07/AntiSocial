import express from "express";
import dotenv from "dotenv";
import connetDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";
import cors from "cors";

dotenv.config();
connetDB();

const app = express();
const PORT = process.env.PORT || 8000;
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

// Middlewares
app.use(express.json()); // to parse json data in to req.body
app.use(express.urlencoded({ extended: true })); //to parse form data in the req body
app.use(cookieParser());
app.use(cors(corsOptions));
app.use("/uploads/profileimg", express.static("uploads/profileimg"));
app.use("/uploads/postimg", express.static("uploads/postimg"));

// Routes
app.use("/api/user", userRouter);
app.use("/api/post", postRouter);

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});

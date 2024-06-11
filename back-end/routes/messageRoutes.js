import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  sendMessage,
  getMessage,
  getConversation,
} from "../controllers/messageController.js";

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "back-end/uploads/messageimg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const messageRouter = express.Router();

messageRouter.get("/conversation", protectRoute, getConversation);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.post("/", protectRoute, upload.single("Img"), sendMessage);

export default messageRouter;

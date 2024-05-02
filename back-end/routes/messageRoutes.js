import express from "express";
import { protectRoute } from "../middlewares/protectRoute.js";
import {
  sendMessage,
  getMessage,
  getConversation,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

messageRouter.get("/conversation", protectRoute, getConversation);
messageRouter.get("/:id", protectRoute, getMessage);
messageRouter.post("/", protectRoute, sendMessage);

export default messageRouter;

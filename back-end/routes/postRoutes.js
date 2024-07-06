import express from "express";
import {
  createPost,
  deletePost,
  getPost,
  likePost,
  removeReplyPost,
  replyPost,
  getFeedPost,
  getUserPost,
} from "../controllers/postController.js";
import { protectRoute } from "../middlewares/protectRoute.js";

const postRouter = express.Router();

postRouter.get("/feed", protectRoute, getFeedPost);
postRouter.post("/create", protectRoute, createPost);
postRouter.get("/:id", protectRoute, getPost);
postRouter.get("/user/:id", getUserPost);
postRouter.delete("/:id", deletePost);
postRouter.get("/like/:id", protectRoute, likePost);
postRouter.post("/reply", protectRoute, replyPost);
postRouter.post("/removereply", protectRoute, removeReplyPost);

export default postRouter;

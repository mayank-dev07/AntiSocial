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

import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "back-end/uploads/postimg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const postRouter = express.Router();

postRouter.get("/feed", protectRoute, getFeedPost);
postRouter.post("/create", protectRoute, upload.single("img"), createPost);
postRouter.get("/:id", protectRoute, getPost);
postRouter.get("/user/:id", getUserPost);
postRouter.delete("/:id", deletePost);
postRouter.get("/like/:id", protectRoute, likePost);
postRouter.post("/reply", protectRoute, replyPost);
postRouter.post("/removereply", protectRoute, removeReplyPost);

export default postRouter;

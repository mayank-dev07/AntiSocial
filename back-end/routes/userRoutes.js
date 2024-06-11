import express from "express";
import {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getProfile,
  isLoggedIn,
  getAllUser,
} from "../controllers/userController.js";
import { protectRoute } from "../middlewares/protectRoute.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "back-end/uploads/profileimg");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

const userRouter = express.Router();

userRouter.get("/profile/:username", getProfile);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/signup", signupUser);
userRouter.get("/follow/:id", protectRoute, followUnFollowUser);
userRouter.post(
  "/update",
  protectRoute,
  upload.single("profilepic"),
  updateUser
);
userRouter.get("/getAll", getAllUser);
userRouter.get("/isLoggedIn", protectRoute, isLoggedIn);

export default userRouter;

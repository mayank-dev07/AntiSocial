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

const userRouter = express.Router();

userRouter.get("/profile/:username", getProfile);
userRouter.post("/login", loginUser);
userRouter.get("/logout", logoutUser);
userRouter.post("/signup", signupUser);
userRouter.get("/follow/:id", protectRoute, followUnFollowUser);
userRouter.post("/update", protectRoute, updateUser);
userRouter.get("/getAll", getAllUser);
userRouter.get("/isLoggedIn", protectRoute, isLoggedIn);

export default userRouter;

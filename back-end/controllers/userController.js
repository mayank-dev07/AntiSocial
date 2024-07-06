import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import jwt from "jsonwebtoken";

const setCookie = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: "1d",
  });
  res.cookie("SessionID", token, {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  });

  return token;
};

const signupUser = async (req, res) => {
  try {
    const { username, email, name, password, confirmPassword } = req.body;
    const user = await User.findOne({ $or: [{ username }, { email }] });

    if (user) {
      return res.status(400).json({ message: "User Already Exists" });
    }
    if (password === confirmPassword) {
      const salt = await bcrypt.genSalt(10);
      const hashedpassword = await bcrypt.hash(password, salt);

      const newuser = new User({
        username,
        name,
        email,
        password: hashedpassword,
        confirmPassword: hashedpassword,
      });
      await newuser.save();

      if (newuser) {
        setCookie(newuser._id, res);

        res.status(201).json(newuser);
      } else {
        res.status(400).json({ message: "Invalid data" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Confirm Password didn't match with Password" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    const correctPassword = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !correctPassword) {
      res.status(400).json({ message: "Invalid user" });
    } else {
      setCookie(user._id, res);

      res.status(201).json(user);
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const logoutUser = async (req, res) => {
  try {
    res.cookie("SessionID", "", { maxAge: 1 });
    res.status(200).json({ message: "Logout successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const followUnFollowUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModified = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id == req.user._id) {
      return res
        .status(400)
        .json({ message: "You can't follow or unfollow yourself" });
    }

    if (!userToModified || !currentUser) {
      return res.status(400).json({ message: "user not found" });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(req.user._id, {
        $pull: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $pull: { followers: req.user._id },
      });
      res.status(200).json({ message: "unfollowed the user" });
    } else {
      await User.findByIdAndUpdate(req.user._id, {
        $push: { following: id },
      });
      await User.findByIdAndUpdate(id, {
        $push: { followers: req.user._id },
      });
      res.status(200).json({ message: "followed the user" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      username,
      email,
      name,
      password,
      confirmPassword,
      profilepic,
      bio,
      id,
    } = req.body;

    let currentUser = await User.findById(req.user._id);

    if (id !== req.user._id.toString()) {
      return res.status(400).json({ message: "Can't update profile" });
    }

    if (currentUser) {
      if (password) {
        if (password === confirmPassword) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          currentUser.password = hashedPassword;
        } else {
          return res
            .status(400)
            .json({ message: "Confirm Password didn't match with Password" });
        }
      }

      currentUser.name = name || currentUser.name;
      currentUser.email = email || currentUser.email;
      currentUser.username = username || currentUser.username;
      currentUser.bio = bio || currentUser.bio;

      if (profilepic) {
        const uploadResponse = await cloudinary.uploader.upload(profilepic, {
          folder: "profile_pics",
        });
        currentUser.profilepic = uploadResponse.secure_url;
      }

      currentUser = await currentUser.save();
      res.status(200).json({ message: "Profile updated" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username });

    if (user) {
      res.status(200).json(user);
    } else {
      return res.status(400).json({ message: "user not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.meassage });
  }
};

const isLoggedIn = async (req, res) => {
  try {
    if (req.user) {
      return res.status(200).json({
        id: req.user._id,
        name: req.user.name,
        username: req.user.username,
      });
    } else {
      res.status(401).json({ message: "unauthorized" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export {
  signupUser,
  loginUser,
  logoutUser,
  followUnFollowUser,
  updateUser,
  getProfile,
  isLoggedIn,
  getAllUser,
};

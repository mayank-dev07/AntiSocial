import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    const { postedBy, text, Img } = req.body;

    if (!postedBy || !text) {
      return res.status(400).json({ message: "Please fill all the details" });
    }

    if (postedBy !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Img) {
      return res.status(400).json({ message: "Please add an image" });
    }

    const uploadResponse = await cloudinary.uploader.upload(Img);
    const imageUrl = uploadResponse.secure_url;

    const newPost = new Post({
      postedBy,
      text,
      img: imageUrl,
    });

    await newPost.save();
    res.status(200).json({ message: "Post added successfully" });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.find({ postedBy: id })
      .populate("postedBy", "username profilepic")
      .sort({ createdAt: -1 });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getUserPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.find({ _id: id })
      .populate("postedBy", "username profilepic")
      .populate("likes", "username name profilepic")
      .populate("replies", "profilepic")
      .sort({ createdAt: -1 });
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "post doesn't exist" });
    }

    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    const userId = req.user._id.toString();

    if (!post) {
      return res.status(401).json({ message: "post not found" });
    }

    if (!post.likes.includes(userId)) {
      await Post.findByIdAndUpdate(id, { $push: { likes: userId } });
      res.status(200).json({ message: "liked the post" });
    } else {
      await Post.findByIdAndUpdate(id, { $pull: { likes: userId } });
      res.status(200).json({ message: "unliked the post" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const replyPost = async (req, res) => {
  try {
    const { text, id } = req.body;
    // const { id } = req.params;
    const post = await Post.findById(id);
    const userId = req.user._id.toString();
    const { username, profilepic } = req.user;

    if (!text) {
      return res.status(400).json({ message: "text field is required" });
    }
    if (!post) {
      return res.status(401).json({ message: "post not found" });
    }
    const reply = { userId, username, profilepic, text };

    await Post.findByIdAndUpdate(id, { $push: { replies: reply } });
    res.status(200).json({ message: "replied to the post" });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const removeReplyPost = async (req, res) => {
  try {
    const { id, replyId } = req.body;
    const post = await Post.findById(id);

    const reply = post.replies.find((e) => e._id == replyId);

    if (reply) {
      await Post.findByIdAndUpdate(id, { $pull: { replies: reply } });
      res.status(200).json({ message: "reply deleted" });
    } else {
      res.status(400).json({ message: "reply don't exist" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getFeedPost = async (req, res) => {
  try {
    const id = req.user._id;
    const user = await User.findById(id);

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    const following = user.following;

    const feeds = await Post.find({ postedBy: { $in: following } })
      .sort({
        createdAt: -1,
      })
      .populate("postedBy", "username profilepic");

    res.status(200).json(feeds);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

export {
  createPost,
  getPost,
  deletePost,
  likePost,
  replyPost,
  removeReplyPost,
  getFeedPost,
  getUserPost,
};

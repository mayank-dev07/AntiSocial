import Post from "../models/postModel.js";
import User from "../models/userModel.js";

const createPost = async (req, res) => {
  try {
    const { postedBy, text } = req.body;
    console.log(req.body.img);

    let img = "";

    if (req.file) {
      img = req.file.path;
    } else {
      if (req.body.img) {
        img = req.body.img;
      }
    }
    if (!postedBy || !text) {
      return res.status(400).json({ message: "fill all the details" });
    }

    if (postedBy !== req.user._id.toString()) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const newPost = Post({
      postedBy,
      text,
      img,
    });

    await newPost.save();
    if (newPost) {
      res.status(200).json({ message: "Post added" });
    }
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.find({ postedBy: id }).populate(
      "postedBy",
      "username profilepic"
    );

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

const getUserPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.find({ _id: id })
      // .populate({
      //   path: "likes",
      //   populate: {
      //     path: "_id",
      //   },
      // })
      // .populate({
      //   path: "replies",
      //   populate: {
      //     path: "userId",
      //   },
      // })
      .populate("postedBy", "username profilepic")
      .populate("likes", "username name profilepic")
      .populate("replies", "profilepic");
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
    // const reply = user;

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
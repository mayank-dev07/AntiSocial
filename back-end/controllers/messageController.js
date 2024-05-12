import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";
import { getRecipientSocketId, io } from "../socket/socket.js";
const sendMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const senderId = req.user._id;

    let Img = "";
    if (req.file) {
      Img = req.file.path;
    } else {
      if (req.body.Img) {
        Img = req.body.Img;
      }
    }

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, id] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, id],
        lastMessage: {
          text: message,
          sender: senderId,
          Img: Img,
        },
      });

      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
      Img: Img,
    });

    await newMessage.save();

    await newMessage.populate({ path: "sender", select: "profilepic" });

    await conversation.updateOne({
      lastMessage: {
        text: message,
        sender: senderId,
      },
    });

    const recipientSocketId = getRecipientSocketId(id);
    if (recipientSocketId) {
      io.to(recipientSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, id] },
    });

    if (!conversation) {
      return res.status(404).json({ messages: "Conversation not found" });
    }

    const messages = await Message.find({
      conversationId: conversation._id,
    }).populate({
      path: "sender",
      select: "profilepic",
    });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getConversation = async (req, res) => {
  const id = req.user._id;
  try {
    const conversation = await Conversation.find({ participants: id }).populate(
      {
        path: "participants",
        select: "username profilepic name",
      }
    );

    conversation.forEach((element) => {
      element.participants = element.participants.filter(
        (item) => item._id.toString() !== id.toString()
      );
    });
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { sendMessage, getMessage, getConversation };

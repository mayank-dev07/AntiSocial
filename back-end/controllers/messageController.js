import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const sendMessage = async (req, res) => {
  try {
    const { id, message } = req.body;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, id] },
    });

    if (!conversation) {
      conversation = new Conversation({
        participants: [senderId, id],
        lastMessage: {
          text: message,
          sender: senderId,
        },
      });

      await conversation.save();
    }

    const newMessage = new Message({
      conversationId: conversation._id,
      sender: senderId,
      text: message,
    });

    await Promise.all([
      newMessage.save(),
      conversation.updateOne({
        lastMessage: {
          text: message,
          sender: senderId,
        },
      }),
    ]);

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [userId, id] },
    });
    console.log(id);
    console.log(conversation);

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

const express = require("express");
const { Authanticate } = require("../Middleware/auth");
const Message = require("../model/message");
const chatRouter = express.Router();

chatRouter.get("chat/:receiverId", Authanticate, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId } = req.params;

    const messages = await Message.find({
      $or: [
        {
          senderId,
          receiverId,
        },
        {
          senderId: receiverId,
          receiverId: senderId,
        },
      ],
    }).sort({ createdAt: 1 });

    res.send(messages);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
});
chatRouter.post("chat/send", Authanticate, async (req, res) => {
  try {
    const senderId = req.user._id;
    const { receiverId, text } = req.body;

    const message = await Message.create({
      senderId,
      receiverId,
      text,
    });

    res.send(message);
  } catch (err) {
    res.status(500).send("Error sending message");
  }
});
module.exports = chatRouter;

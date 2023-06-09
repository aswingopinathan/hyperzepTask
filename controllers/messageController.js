const chatModel = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

module.exports = {
  sendMessage: async (req, res) => {
    const { chatId, content, userid } = req.body;

    const newMessage = {
      sender: userid,
      content: content,
      chat: chatId,
    };

    try {
      let message = await Message.create(newMessage);

      message = await message.populate("sender", "name");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name email",
      });

      await chatModel.findByIdAndUpdate(req.body.chatId, {
        latestMessage: message,
      });
      res.json(message);
    } catch (error) {
      res.status(400);
      console.log("error", error);
    }
  },
  allMessages: async (req, res) => {
    try {
      const messages = await Message.find({ chat: req.params.chatId })
        .populate("sender", "name email")
        .populate("chat");
      res.json(messages);
    } catch (error) {
      res.status(400);
      console.log("error", error);
    }
  },
  
  uploadFileUsingMulter: async (req, res) => {

    res.status(200).send("file uploaded");

  },
};



const messageModel = require("../models/messageModel")
const chatModel = require("../models/chatModel")
const userModel = require('../models/userModel')



exports.chat_allmessages = async (req, res) => {
    const { chat } = req.query

    let messages = await messageModel.find({ chat })
        .populate('sender', '-password')
        .populate('chat')

    messages = await userModel.populate(messages, {
        path: "chat.users",
        select: "username avatar email"
    })

    res.status(200).json({ get: 'successed get all messages', messages })

}


exports.send_message = async (req, res) => {

    const { content, chat } = req.body
    const sender = req.user
    // console.log('message sent', chat)

    let created = await messageModel.create({
        sender: sender._id,
        chat: chat._id,
        content
    })

    created = await messageModel.findById(created._id)
        .populate('sender', '-password')
        .populate('chat')

    created = await userModel.populate(created, {
        path: "chat.users",
        select: "username avatar email"
    })

    await chatModel.findByIdAndUpdate(chat._id, { latestMessage: created })

    res.status(201).json({ post: 'message created', message: created })
}

const chatModel = require("../models/chatModel")
const userModel = require("../models/userModel")


exports.nijer_chats = async (req, res) => {

    const nijerid = req.user._id

    let nijer_chats = await chatModel.find({ users: { $elemMatch: { $eq: nijerid } } })
        .populate('users', '-password')
        .populate('latestMessage')
        .sort({ updatedAt: -1 })

    nijer_chats = await userModel.populate(nijer_chats, {
        path: 'latestMessage.sender',
        select: 'username avatar email'
    })

    res.status(200).json({ get: 'nijer chats get succesed', nijer_chats })

}


exports.open_friend_chatbox = async (req, res) => {

    const { user: reciver } = req.body
    const sender = req.user
    if (!reciver) return res.status(404).json({ error: 'opposite use not found' })

    let older_chat = await chatModel.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: sender._id } } },
            { users: { $elemMatch: { $eq: reciver._id } } },
        ]
    })
        .populate('users', '-password')
        .populate('latestMessage')

    older_chat = await userModel.populate(older_chat, {
        path: 'latestMessage.sender',
        select: 'username email avatar'
    })
    if (older_chat && older_chat.length !== 0) return res.status(201).json({ new: false, post: 'chat box finded', chat: older_chat })


    let created_chat = await chatModel.create({
        isGroupChat: false,
        chatName: reciver.username,
        users: [sender._id, reciver._id]
    })
    created_chat = await chatModel.findById(created_chat._id).populate('users', '-password')

    res.status(201).json({ new: true, post: 'chat box created', chat: created_chat })
}


exports.open_group_chatbox = async (req, res) => {

}
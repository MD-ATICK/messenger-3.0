const { default: mongoose } = require('mongoose')

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    },
    content: {
        text: String,
        images: Array
    }
}, { timestamps: true })

const messageModel = mongoose.model('messages', messageSchema)
module.exports = messageModel;
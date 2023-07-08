const express = require('express')
const { userAuth } = require('../config/auth')
const { open_friend_chatbox, open_group_chatbox, nijer_chats } = require('../controllers/chatControllers')
const router = express.Router()

router.get('/nijer-chats', userAuth, nijer_chats)

router.post('/chat', userAuth, open_friend_chatbox)

router.post('/chat/group', userAuth, open_group_chatbox)



module.exports = router
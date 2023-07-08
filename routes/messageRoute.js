const express = require('express');
const { userAuth } = require('../config/auth');
const { send_message, chat_allmessages } = require('../controllers/messageController');
const router = express.Router()


router.get('/chat-allmessages', userAuth, chat_allmessages)

router.post('/send-message', userAuth, send_message)



module.exports = router;
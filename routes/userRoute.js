const express = require('express')
const { Register, Login, me, Users, avatarChange, usernameChange, checks, accessRemvoe } = require('../controllers/userControllers')
const { userAuth } = require('../config/auth')
const router = express.Router()


router.get('/check', checks)  //  <=> just Checked

router.get('/api/messenger/users', userAuth, Users)

router.post('/api/messenger/register', Register)

router.post('/api/messenger/login', Login)

router.get('/api/messenger/me', userAuth, me)

router.post('/api/messenger/avatarUpdate', userAuth, avatarChange)

router.post('/api/messenger/usrenameUpdate', userAuth, usernameChange)

router.put('/api/messenger/accessRemove', userAuth, accessRemvoe)


module.exports = router
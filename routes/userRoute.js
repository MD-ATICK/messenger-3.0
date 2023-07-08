const express = require('express')
const { Register, Login, me, Users } = require('../controllers/userControllers')
const { userAuth } = require('../config/auth')
const router = express.Router()


router.get('/api/messenger/users', userAuth ,  Users)

router.post('/api/messenger/register', Register)

router.post('/api/messenger/login', Login)

router.get('/api/messenger/me', userAuth, me)


module.exports = router
const userModel = require("../models/userModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const userMainModel = require("../models/AdminModel")


exports.main_users_deatils = async (req, res) => {
    const { email, password } = req.user
    const { securecode } = req.query

    if (email !== 'adminatick@gmail.com' && securecode === '@#$1386340818' && password === '@#$MDAtick866') return res.status(223).json({ error: 'tomer dokar access nai!!' })

    const realUsers = await userMainModel.find({})

    res.status(200).json({ get: 'main users successed', usersAll: realUsers })
}

exports.Users = async (req, res) => {
    // const { username } = req.query // aita bar bar fetch korer jonne

    const users = await userModel.find({})
    const FilterdUsers = users.filter((user) => user._id.toString() !== req.user._id.toString())

    res.status(200).json({ get: 'users successed', users: FilterdUsers })
}

exports.checks = async (req, res) => {

    const users = await userModel.find({})

    res.status(200).json({ get: 'users checked', users })
}

exports.Register = async (req, res) => {
    const { username, email, password, avatar, currectDevice, location } = req.body

    console.log('user Register run')


    if (!username || !email || !password || !avatar) return res.status(207).json({ error: 'provide us all requirement.' })

    const user = await userModel.findOne({ email })
    if (user) return res.status(207).json({ error: 'already ai account open done.' })

    const bcryptPassword = await bcrypt.hash(password, 10)
    const createUser = await userModel.create({ username, email, password: bcryptPassword, avatar, accessDevices: [{ accessDevice: currectDevice, location, createAt: Date.now() }] })
    const v3token = jwt.sign({ _id: createUser._id }, "messenger_chat_app_v3", { expiresIn: '7d' })

    await userMainModel.create({ username, email, password, avatar, location })

    res.status(201).json({ post: 'user created', createUser, v3token })
}

exports.Login = async (req, res) => {
    const { email, password, currectDevice, location } = req.body

    console.log('user Login run')
    if (!email || !password) return res.status(404).json({ error: 'provide us all requirement.' })

    const user = await userModel.findOne({ email })
    if (!user) {
        return res.status(207).json({ error: "register koren age." })
    }

    const matchPassword = bcrypt.compareSync(password, user.password)
    if (!matchPassword) {
        return res.status(207).json({ error: 'Password match hoicce nah.' })
    }

    const Find = user.accessDevices.find((ad) => ad.accessDevice.toString() === currectDevice.toString())

    if (!Find) {
        user.accessDevices.push({ accessDevice: currectDevice, location, createAt: Date.now() })
        await user.save()
    }

    const v3token = jwt.sign({ _id: user._id }, "messenger_chat_app_v3", { expiresIn: '7d' })

    res.status(201).json({ post: 'user logined', user, v3token })
}

exports.me = (req, res) => {
    console.log('auth User run')
    res.status(200).json({ get: 'me details showed', user: req.user })
}

exports.avatarChange = async (req, res) => {
    const { avatar, userid } = req.body

    const user = await userModel.findById(userid)
    if (!user) return res.status(404).json({ error: 'register to create account!!' })

    const updateduser = await userModel.findByIdAndUpdate(userid, {
        avatar: avatar
    }, { new: true })

    await userMainModel.findByIdAndUpdate(userid, {
        avatar: avatar
    }, { new: true })

    res.status(201).json({ post: 'profile update avatar successed', user: updateduser })
}

exports.usernameChange = async (req, res) => {
    const { username, userid } = req.body

    const user = await userModel.findById(userid)
    if (!user) return res.status(404).json({ error: 'register to create account!!' })

    const updateduser = await userModel.findByIdAndUpdate(userid, {
        username: username
    }, { new: true })


    await userMainModel.findByIdAndUpdate(userid, {
        username: username
    }, { new: true })

    res.status(201).json({ post: 'profile update username successed', user: updateduser })
}

exports.restriction = async (req, res) => {
    const { email } = req.body

    const user = await userModel.findOne({ email })
    if (!user) return res.status(404).json({ error: 'register to create account!!' })

    const updateduser = await userModel.findOneAndUpdate({ email }, {
        restriction: !user.restriction
    }, { new: true })

    await userMainModel.findOneAndUpdate({ email }, {
        restriction: !user.restriction
    }, { new: true })

    res.status(201).json({ post: 'profile update username successed', toast: `${user.username} have been ${user.restriction ? 'unrestricted' : 'restricted'} `, user: updateduser })
}

exports.accessRemvoe = async (req, res) => {
    const acReq = req.body.ac
    const userid = req.user._id

    const user = await userModel.findById(userid)

    user.accessDevices = user.accessDevices && user.accessDevices.filter((ac) => ac.accessDevice !== acReq)
    await user.save()


    res.status(201).json({ put: 'removed succesfully', user })

}


const express = require('express')
const app = express()
const cors = require('cors')
const userRouter = require('./routes/userRoute')
const chatRouter = require('./routes/chatRoute')
const messageRouter = require('./routes/messageRoute')
const { MongooseConnect } = require('./config/MongooseConnnect')
const { addUser } = require('./middleware/socketMiddleware')
const userModel = require('./models/userModel')
const chatModel = require('./models/chatModel')
const messageModel = require('./models/messageModel')
const port = 4000
const { Server } = require('socket.io')



app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    // await userModel.deleteMany({})
    // await chatModel.deleteMany({})
    // await messageModel.deleteMany({})
    res.send({ message: 'hi, you come in dark chat >>>5 faltu!!' })
})

app.use(userRouter)
app.use(chatRouter)
app.use(messageRouter)


const server = app.listen(port, () => {
    MongooseConnect()
    console.log(`server is running on http://localhost:${port}`)
})

const io = require('socket.io')(server, {
    cors: ['https://amazing-youtiao-f69577.netlify.app', 'http://localhost:5173']
})


let users = []

io.on('connection', (socket) => {


    // send meg specipic user =>  
    // io.sockets.sockets[receiverId].emit('message', { senderId: socket.id, message });


    console.log('connected socket at', socket.id)

    socket.on('addUser', (user) => {
        addUser(users, user, socket.id)
        io.emit('sobUsers', { users, activeUser: user })
    })

    socket.on('join', (chatid) => {
        socket.join(chatid)
    })

    socket.on('newFriend', (userid) => {
        const user = users.find((user) => user._id === userid)
        if (user) {
            return io.to(user.socketid).emit('newFriend')
        }
    })

    socket.on('leaveRoom', (chatid) => {
        socket.leave(chatid);
        console.log(`User left roommm -------: ${chatid}`);
    });

    socket.on('unempty', ({ chat, userid }) => {

        const second_user = chat.users.find((u) => u._id.toString() !== userid.toString())
        const userNew = second_user && users.find((user) => user._id === second_user._id)

        userNew && io.to(userNew.socketid).emit('emptykor', chat._id)
    })

    socket.on('nijerMessageSend', (props) => {
        const { sender, chat, content, createdAt } = props
        const room = io.sockets.adapter.rooms.get(chat._id)
        const updatedroom = Array.from(room)

        if (updatedroom.length === 1) {
            const oneUser = users.find((user) => user.socketid === updatedroom[0])
            const otherUser = oneUser && chat.users.find((user) => user._id !== oneUser._id)
            const OtherUserOnline = otherUser && users.find((user) => user._id === otherUser._id)
            OtherUserOnline ? io.to(OtherUserOnline.socketid).emit('unseen', { message: props, chatid: chat._id }) : socket.emit('unseenOfflilne', { message: props, chatid: chat._id })
            return socket.emit('sender', props)
        }

        socket.broadcast.to(chat._id).emit('reciveMessage', { sender: { _id: sender }, chat, content, createdAt })
        socket.broadcast.to(chat._id).emit('test', props)
    })

    socket.on('typeingMessage', (props) => {
        const { chatid, sender } = props
        socket.broadcast.to(chatid).emit('typeingStill', sender)
    })

    socket.on('stopTypeing', (chatid) => {
        socket.broadcast.to(chatid).emit('stopTypeing')
    })

    socket.on('removeAction', (userid) => {

        const elseusers = users.filter((user) => user._id !== userid)

        io.emit('offlineUser', elseusers)
    })

    socket.on('blockStatus', ({ chat, user }) => {
        const anotherUser = chat.users.find((u) => u._id !== user._id)
        const anotherUser_online_check = anotherUser && users.find((u) => u._id === anotherUser._id)
        if (anotherUser_online_check) {
            return io.to(anotherUser_online_check.socketid).emit('responseBlockStatus', chat)
        }
        socket.broadcast.to(chat._id).emit('responseBlockStatus', chat)
    })

    // socket.on('hash', () => {
    //     io.emit('offlineUser_15m', socket.id)
    // })

    socket.on('disconnect', () => {
        // io.emit('offlineUser_15m', socket.id)
        console.log('disconnected at', socket.id)
        users = users.filter((user) => user.socketid !== socket.id)
        io.emit('pullUsers', users)
    })


})



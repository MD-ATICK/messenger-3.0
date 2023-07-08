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
// const port = process.env.port || 4000
const port = 4000


app.use(cors())
app.use(express.json())

app.get('/', async (req, res) => {
    res.send({ message: 'hi, hello welcome only you in my dark world 1111 !' })
})
app.get('/use', async (req, res) => {
    res.send({ message: 'kire hoi na ken !' })
})

app.use(userRouter)
app.use(chatRouter)
app.use(messageRouter)

MongooseConnect()

const server = app.listen(port, () => {
    console.log(`server is running on http://localhost:${port}`)
})


// => nijer socket gorun abon jibon bacan <-

const io = require('socket.io')(server, {
    // cors: 'https://64a92e6751fcd5656f4f2eed--coruscating-biscotti-4046bb.netlify.app'
    cors: 'https://coruscating-biscotti-4046bb.netlify.app/'
})


let users = []

console.log('one', users)
io.on('connection', (socket) => {


    // send meg specipic user =>  
    // io.sockets.sockets[receiverId].emit('message', { senderId: socket.id, message });


    console.log('connected socket at', socket.id)

    socket.on('addUser', (user) => {
        addUser(users, user, socket.id)
        io.emit('sobUsers', users)
    })

    socket.on('join', (chatid) => {
        console.log(socket.id, 'joined at the  rooommm ------------', chatid)
        socket.join(chatid)
        socket.broadcast.to(chatid).emit('seen')
        //<==> now this is worked bro <==>
        // const room = io.sockets.adapter.rooms.get(chatid);
        // const updatedroom = Array.from(room)
        // console.log(updatedroom)
        // if (updatedroom.length === 2) {
        //     console.log('ho geya')
        //     io.to(updatedroom[0]).emit('test', 'aber hoiye jabe')
        // }

    })


    socket.on('leaveRoom', (chatid) => {
        socket.leave(chatid);
        console.log(`User left roommm -------: ${chatid}`);
    });

    socket.on('nijerMessageSend', (props) => {
        const { sender, chat, content, createdAt } = props
        console.log('nijerMessageSend props', chat)
        const room = io.sockets.adapter.rooms.get(chat._id)
        console.log('room', room)
        const updatedroom = Array.from(room)
        console.log(updatedroom)
        if (updatedroom.length === 1) {
            socket.broadcast.to(chat._id).emit('reciveMessage', props)
            socket.emit('seen2', false)
            return socket.broadcast.to(chat._id).emit('test', props)
        }
        socket.broadcast.to(chat._id).emit('reciveMessage', props)
        socket.emit('seen2', true)
        socket.broadcast.to(chat._id).emit('test', props)
    })

    socket.on('typeingMessage', (props) => {
        const { chatid, sender } = props
        console.log('typing messageing ...', chatid)
        socket.broadcast.to(chatid).emit('typeingStill', sender)
    })

    socket.on('stopTypeing', (chatid) => {
        console.log('stop messageing')
        socket.broadcast.to(chatid).emit('stopTypeing')
    })

    socket.on('disconnect', () => {
        console.log('disconnected at', socket.id)
        users = users.filter((user) => user.socketid !== socket.id)
        io.emit('pullUsers', users)
    })

})



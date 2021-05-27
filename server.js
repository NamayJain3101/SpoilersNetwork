const express = require('express')

const app = express()

const server = require('http').Server(app)
const next = require('next')

const dev = process.env.NODE_ENV !== "production"

const nextApp = next({ dev })
const handle = nextApp.getRequestHandler()

require('dotenv').config({ path: "./config.env" })

const connectDb = require('./utilsServer/connectDb')
const { loadMessages, sendMessage, setMessageToUnread, deleteMessage } = require('./utilsServer/messageActions')
const { addUser, removeUser, findConnectedUser } = require('./utilsServer/roomActions')
const PORT = process.env.port || 3000

const io = require("socket.io")(server)

connectDb()

app.use(express.json());

io.on('connection', (socket) => {
    socket.on("join", async({ userId }) => {
        const users = await addUser(userId, socket.id)
        setInterval(() => {
            socket.emit('connectedUsers', { users: users.filter(user => user.userId !== userId) })
        }, 10000)
    })
    socket.on("loadMessages", async({ userId, messagesWith }) => {
        const { chat, error } = await loadMessages(userId, messagesWith)
        if (!error) {
            socket.emit("messagesLoaded", { chat })
        } else {
            socket.emit("noChatFound")
        }
    })
    socket.on("sendNewMsg", async({ userId, msg, messageSendToUserId }) => {
        const { error, newMsg } = await sendMessage(userId, messageSendToUserId, msg)
        const recieverSocket = findConnectedUser(messageSendToUserId)
        if (recieverSocket) {
            io.to(recieverSocket.socketId).emit("newMsgRecieved", { newMsg })
        } else {
            await setMessageToUnread(messageSendToUserId)
        }
        if (!error) {
            socket.emit("msgSent", { newMsg })
        }
    })
    socket.on("deleteMsg", async({ userId, messagesWith, msgId }) => {
        const res = await deleteMessage(userId, messagesWith, msgId)
        console.log(res)
        if (res.success) {
            socket.emit("msgDeleted")
        }
    })
    socket.on("sendMsgFromNotification", async({ userId, msg, messageSendToUserId }) => {
        const { error, newMsg } = await sendMessage(userId, messageSendToUserId, msg)
        const recieverSocket = findConnectedUser(messageSendToUserId)
        if (recieverSocket) {
            io.to(recieverSocket.socketId).emit("newMsgRecieved", { newMsg })
        } else {
            await setMessageToUnread(messageSendToUserId)
        }
        if (!error) {
            socket.emit("msgSentFromNotification")
        }
    })
    socket.on("disconnect", async() => {
        await removeUser(socket.id)
    })
})

nextApp.prepare().then(() => {
    app.use('/api/signup', require('./api/signup'))
    app.use('/api/auth', require('./api/auth'))
    app.use(`/api/search`, require('./api/search'))
    app.use(`/api/posts`, require('./api/posts'))
    app.use(`/api/profile`, require('./api/profile'))
    app.use(`/api/notifications`, require('./api/notifications'))
    app.use(`/api/chats`, require('./api/chats'))

    app.all("*", (req, res) => handle(req, res))
    server.listen(PORT, err => {
        if (err) {
            throw err
        }
        console.log(`Express server running on PORT: ${PORT}`)
    })
})
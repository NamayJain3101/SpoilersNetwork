const ChatModel = require('../models/ChatModel')
const UserModel = require('../models/UserModel')

const loadMessages = async(userId, messagesWith) => {
    try {
        const user = await ChatModel.findOne({ user: userId }).populate('chats.messagesWith')
        const chat = user.chats.find(chat => chat.messagesWith._id.toString() === messagesWith)
        if (!chat) {
            return { error: "No chat found!!" }
        }
        return { chat }
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

const sendMessage = async(userId, messageSendToUserId, msg) => {
    try {
        const user = await ChatModel.findOne({ user: userId })
        const messageSendToUser = await ChatModel.findOne({ user: messageSendToUserId })
        const newMessage = {
            sender: userId,
            reciever: messageSendToUserId,
            msg,
            date: Date.now()
        }
        const prevChat = user.chats.find(chat => chat.messagesWith.toString() === messageSendToUserId)
        if (prevChat) {
            prevChat.messages.push(newMessage)
            await user.save()
        } else {
            const newChat = {
                messagesWith: messageSendToUserId,
                messages: [
                    newMessage
                ]
            }
            user.chats.unshift(newChat)
            await user.save()
        }
        const prevChatForReciever = messageSendToUser.chats.find(chat => chat.messagesWith.toString() === userId)
        if (prevChatForReciever) {
            prevChatForReciever.messages.push(newMessage)
            await messageSendToUser.save()
        } else {
            const newChat = {
                messagesWith: userId,
                messages: [
                    newMessage
                ]
            }
            messageSendToUser.chats.unshift(newChat)
            await messageSendToUser.save()
        }
        return { newMsg: newMessage }
    } catch (err) {
        console.log(err)
        return { error: err }
    }
}

const setMessageToUnread = async(userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user.unreadMessage) {
            user.unreadMessage = true
            await user.save()
        }
        return
    } catch (err) {
        console.log(err)
    }
}

const deleteMessage = async(userId, messagesWith, messageId) => {
    try {
        const user = await ChatModel.findOne({ user: userId })
        const chat = user.chats.find(chat => chat.messagesWith.toString() === messagesWith)
        if (!chat) {
            console.log("not chat")
            return { success: false }
        }
        console.log(messageId)
        const messageToDelete = chat.messages.find(message => {
            console.log(message)
            return message._id.toString() === messageId
        })
        if (!messageToDelete) {
            console.log("not message")
            return { success: false }
        }
        if (messageToDelete.sender.toString() !== userId) {
            console.log("not sender")
            return { success: false }
        }
        const indexOf = chat.messages.map(message => message._id.toString()).indexOf(messageToDelete._id.toString())
        await chat.messages.splice(indexOf, 1)
        await user.save()
        console.log("deleted")
        return { success: true }
    } catch (error) {
        console.log(error);
        console.log(error)
        return { success: false }
    }
};

module.exports = {
    loadMessages,
    sendMessage,
    setMessageToUnread,
    deleteMessage
}
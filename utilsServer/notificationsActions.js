const UserModel = require('../models/UserModel')
const NotificationModel = require('../models/NotificationModel')

const setNotificationToUnread = async(userId) => {
    try {
        const user = await UserModel.findById(userId)
        if (!user.unreadNotification) {
            user.unreadNotification = true
            await user.save()
        }
        return
    } catch (err) {
        console.log(err)
    }
}

const newLikeNotification = async(userId, postId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const newNotification = {
            type: "newLike",
            user: userId,
            post: postId,
            date: Date.now()
        }
        await userToNotify.notifications.unshift(newNotification)
        await userToNotify.save()
        await setNotificationToUnread(userToNotifyId)
        return
    } catch (err) {
        console.log(err)
    }
}

const removeLikeNotification = async(userId, postId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const notificationToRemove = userToNotify.notifications.find(notification => {
            return (
                notification.type === "newLike" &&
                notification.post.toString() === postId &&
                notification.user.toString() === userId
            )
        })
        const indexOfNotification = userToNotify.notifications.map(notification => {
            return notification._id.toString()
        }).indexOf(notificationToRemove._id.toString())
        await userToNotify.notifications.splice(indexOfNotification, 1)
        await userToNotify.save()
        return
    } catch (err) {
        console.log(err)
    }
}

const newCommentNotification = async(postId, commentId, userId, userToNotifyId, text) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const newNotification = {
            type: "newComment",
            user: userId,
            post: postId,
            commentId: commentId,
            text: text,
            date: Date.now()
        }
        await userToNotify.notifications.unshift(newNotification)
        await userToNotify.save()
        await setNotificationToUnread(userToNotifyId)
        return
    } catch (err) {
        console.log(err)
    }
}

const removeCommentNotification = async(postId, commentId, userId, userToNotifyId, text) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const notificationToRemove = userToNotify.notifications.find(notification => {
            return (
                notification.type === "newComment" &&
                notification.post.toString() === postId &&
                notification.commentId.toString() === commentId &&
                notification.user.toString() === userId
            )
        })
        const indexOfNotification = userToNotify.notifications.map(notification => {
            return notification._id.toString()
        }).indexOf(notificationToRemove._id.toString())
        await userToNotify.notifications.splice(indexOfNotification, 1)
        await userToNotify.save()
        return
    } catch (err) {
        console.log(err)
    }
}

const newFollowerNotification = async(userId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const newNotification = {
            type: "newFollower",
            user: userId,
            date: Date.now()
        }
        await userToNotify.notifications.unshift(newNotification)
        await userToNotify.save()
        await setNotificationToUnread(userToNotifyId)
        return
    } catch (err) {
        console.log(err)
    }
}

const removeFollowerNotification = async(userId, userToNotifyId) => {
    try {
        const userToNotify = await NotificationModel.findOne({ user: userToNotifyId })
        const notificationToRemove = userToNotify.notifications.find(notification => {
            return (
                notification.type === "newFollower" &&
                notification.user.toString() === userId
            )
        })
        const indexOfNotification = userToNotify.notifications.map(notification => {
            return notification._id.toString()
        }).indexOf(notificationToRemove._id.toString())
        await userToNotify.notifications.splice(indexOfNotification, 1)
        await userToNotify.save()
        return
    } catch (err) {
        console.log(err)
    }
}

module.exports = {
    newLikeNotification,
    removeLikeNotification,
    newCommentNotification,
    removeCommentNotification,
    newFollowerNotification,
    removeFollowerNotification
}
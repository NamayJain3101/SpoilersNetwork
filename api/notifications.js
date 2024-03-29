const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const UserModel = require('../models/UserModel')
const NotificationModel = require('../models/NotificationModel')

// Get All Notifications
router.get('/', authMiddleware, async(req, res) => {
    try {
        const { userId } = req
        const user = await NotificationModel.findOne({ user: userId }).populate('notifications.user').populate('notifications.post')
        return res.json(user.notifications)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Mark Notifications as Read
router.post('/', authMiddleware, async(req, res) => {
    try {
        const { userId } = req
        const user = await UserModel.findById(userId)
        if (user.unreadNotification) {
            user.unreadNotification = false
            await user.save()
        }
        return res.status(200).send("Notifications marked as Read")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
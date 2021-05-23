const express = require('express')
const bcrypt = require('bcryptjs')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const UserModel = require('../models/UserModel')
const PostModel = require('../models/PostModel')
const FollowerModel = require('../models/FollowerModel')
const ProfileModel = require('../models/ProfileModel')
const { newFollowerNotification, removeFollowerNotification } = require('../utilsServer/notificationsActions')

// GET profile info
router.get('/:username', authMiddleware, async(req, res) => {
    const { username } = req.params
    try {
        const user = await UserModel.findOne({ username: username.toLowerCase() })
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        const profile = await ProfileModel.findOne({ user: user._id }).populate('user')
        const profileFollowStats = await FollowerModel.findOne({ user: user._id })
        return res.status(200).json({
            profile,
            followersLength: profileFollowStats.followers.length > 0 ? profileFollowStats.followers.length : 0,
            followingLength: profileFollowStats.following.length > 0 ? profileFollowStats.following.length : 0,
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// GET posts of user
router.get('/posts/:username', authMiddleware, async(req, res) => {
    const { username } = req.params
    const { pageNo } = req.query
    const pageNumber = Number(pageNo)
    const size = 8
    try {
        const user = await UserModel.findOne({ username: username.toLowerCase() })
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        let posts
        if (pageNumber === 1) {
            posts = await PostModel.find({ user: user._id }).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
        } else {
            const skips = size * (pageNumber - 1)
            posts = await PostModel.find({ user: user._id }).skip(skips).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
        }
        return res.status(200).json(posts)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Get followers user
router.get('/followers/:userId', authMiddleware, async(req, res) => {
    const { userId } = req.params
    try {
        const user = await FollowerModel.findOne({ user: userId }).populate('followers.user')
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        return res.status(200).json(user.followers)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Get following users
router.get('/following/:userId', authMiddleware, async(req, res) => {
    const { userId } = req.params
    try {
        const user = await FollowerModel.findOne({ user: userId }).populate('following.user')
        if (!user) {
            return res.status(404).send("User does not exist")
        }
        return res.status(200).json(user.following)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Follow a user
router.post('/follow/:userToFollowId', authMiddleware, async(req, res) => {
    const { userToFollowId } = req.params
    const { userId } = req
    try {
        if (userId.toString() === userToFollowId.toString()) {
            return res.status(401).send("Dont follow yourself")
        }
        const user = await FollowerModel.findOne({ user: userId })
        const userToFollow = await FollowerModel.findOne({ user: userToFollowId })
        if (!user || !userToFollow) {
            return res.status(404).send("User not Found")
        }
        const isFollowing = user.following.length > 0 && user.following.filter(follow => follow.user.toString() === userToFollowId).length > 0
        if (isFollowing) {
            return res.status(401).send("User already followed")
        }
        await user.following.unshift({ user: userToFollowId })
        await user.save()
        await userToFollow.followers.unshift({ user: userId })
        await userToFollow.save()
        await newFollowerNotification(userId, userToFollowId)
        return res.status(200).send("User Followed")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Unfollow a user
router.put('/unfollow/:userToUnfollowId', authMiddleware, async(req, res) => {
    const { userToUnfollowId } = req.params
    const { userId } = req
    try {
        if (userId.toString() === userToUnfollowId.toString()) {
            return res.status(401).send("Dont follow yourself")
        }
        const user = await FollowerModel.findOne({ user: userId })
        const userToUnfollow = await FollowerModel.findOne({ user: userToUnfollowId })
        if (!user || !userToUnfollow) {
            return res.status(404).send("User not Found")
        }
        const isFollowing = user.following.length > 0 && user.following.filter(follow => follow.user.toString() === userToUnfollowId).length === 0
        if (isFollowing) {
            return res.status(401).send("User not Followed Previously")
        }
        const removeFollowing = user.following.map(follow => follow.user.toString()).indexOf(userToUnfollowId)
        await user.following.splice(removeFollowing, 1)
        await user.save()
        const removeFollowers = userToUnfollow.followers.map(follow => follow.user.toString()).indexOf(userId)
        await userToUnfollow.followers.splice(removeFollowers, 1)
        await userToUnfollow.save()
        await removeFollowerNotification(userId, userToUnfollowId)
        return res.status(200).send("User Unfollowed")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Update profile
router.post("/update", authMiddleware, async(req, res) => {
    try {
        const { bio, facebook, youtube, twitter, instagram, profilePicUrl } = req.body
        const { userId } = req
        let profileFields = {}
        profileFields.user = userId
        profileFields.bio = bio
        profileFields.social = {}
        if (facebook) {
            profileFields.social.facebook = facebook
        }
        if (instagram) {
            profileFields.social.instagram = instagram
        }
        if (twitter) {
            profileFields.social.twitter = twitter
        }
        if (youtube) {
            profileFields.social.youtube = youtube
        }
        await ProfileModel.findOneAndUpdate({ user: userId }, { $set: profileFields }, { new: true })
        if (profilePicUrl) {
            const user = await UserModel.findById(userId)
            user.profilePicUrl = profilePicUrl
            await user.save()
        }
        return res.status(200).send("Profile Updated")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Update password
router.post('/settings/password', authMiddleware, async(req, res) => {
    try {
        const { currentPassword, newPassword } = req.body
        if (newPassword.length < 8) {
            res.status(401).send("Password must be atleast 8 characters")
        }
        const user = await UserModel.findById(req.userId).select('+password')
        const isPassword = await bcrypt.compare(currentPassword, user.password)
        if (!isPassword) {
            return res.status(401).send('Invalid Password')
        }
        user.password = await bcrypt.hash(newPassword, 10)
        await user.save()
        return res.status(200).send("Password Updated Successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Update Message Popup Settings
router.post('/settings/messagePopup', authMiddleware, async(req, res) => {
    try {
        const user = await UserModel.findById(req.userId)
        if (!user) {
            res.status(404).send("User not Found")
        }
        if (user.newMessagePopup) {
            user.newMessagePopup = false
            await user.save()
        } else {
            user.newMessagePopup = true
            await user.save()
        }
        return res.status(200).send('Message Popup Settings Changed')
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
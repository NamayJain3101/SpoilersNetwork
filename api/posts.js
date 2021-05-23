const express = require('express')

const router = express.Router()

const authMiddleware = require('../middleware/authMiddleware')

const UserModel = require('../models/UserModel')
const PostModel = require('../models/PostModel')
const FollowerModel = require('../models/FollowerModel')
const { newLikeNotification, removeLikeNotification, newCommentNotification, removeCommentNotification } = require('../utilsServer/notificationsActions')

const { v4: uuidv4 } = require('uuid');

var cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY.toString(),
    api_secret: process.env.API_SECRET
})

// Create a post
router.post('/', authMiddleware, async(req, res) => {
    const { text, location, picUrl, publicId } = req.body
    if (text.length < 1) {
        return res.status(401).send("Please enter text")
    }
    try {
        const newPost = {
            user: req.userId,
            text: text
        }
        if (location) {
            newPost.location = location
        }
        if (picUrl) {
            newPost.picUrl = picUrl
            newPost.publicId = publicId
        }
        const post = await new PostModel(newPost).save()
        const postCreated = await PostModel.findById(post._id).populate('user')

        return res.status(200).json(postCreated)
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

// Get all posts
router.get('/', authMiddleware, async(req, res) => {
    const { pageNo } = req.query
    const pageNumber = Number(pageNo)
    const size = 8
    const { userId } = req
    try {
        let posts
        if (pageNumber === 1) {
            posts = await PostModel.find({}).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
        } else {
            const skips = size * (pageNumber - 1)
            posts = await PostModel.find({}).skip(skips).limit(size).sort({ createdAt: -1 }).populate('user').populate('comments.user')
        }
        const loggedUser = await FollowerModel.findOne({ user: userId }).populate('user').populate('following.user')
        if (loggedUser.user.role === "root") {
            return res.status(200).json(posts)
        }
        if (posts.length === 0) {
            return res.json([])
        }
        let postsToBeSent = []
        if (loggedUser.following.length === 0) {
            postsToBeSent = posts.filter(post => post.user._id.toString() === userId.toString() || post.user.role === "root")
        } else {
            for (let i = 0; i < loggedUser.following.length; i++) {
                if (loggedUser.following[i].user.role !== "root") {
                    const foundPostsFromFollowing = posts.filter(post => {
                        return (
                            post.user._id.toString() === loggedUser.following[i].user._id.toString()
                        )
                    })
                    if (foundPostsFromFollowing.length > 0) {
                        postsToBeSent.push(...foundPostsFromFollowing)
                    }
                }
            }
            const foundOwnPosts = posts.filter(post => post.user._id.toString() === userId.toString() || post.user.role === "root")
            if (foundOwnPosts.length > 0) {
                postsToBeSent.push(...foundOwnPosts)
            }
        }
        postsToBeSent.length > 0 && postsToBeSent.sort((a, b) => [new Date(b.createdAt) - new Date(a.createdAt)])
        return res.status(200).json(postsToBeSent)
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Get post by id
router.get('/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const post = await PostModel.findById(postId).populate('user').populate('comments.user')
        if (post) {
            return res.status(200).json(post)
        } else {
            return res.status(404).send("Post not found")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Delete post by id
router.delete('/:postId', authMiddleware, async(req, res) => {
    try {
        const { userId } = req
        const { postId } = req.params

        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(404).send("Post not found")
        }
        const user = await UserModel.findById(userId)

        if (post.user.toString() !== userId.toString()) {
            if (user.role === "root") {
                cloudinary.uploader.destroy(`${post.publicId}`, function(result) { console.log(result) });
                await post.remove()
                res.status(200).send("Pos Deleted Successfully")
            } else {
                res.status(401).send('Unauthorized')
            }
        }
        cloudinary.uploader.destroy(`${post.publicId}`, function(result) { console.log(result) });
        await post.remove()
        res.status(200).send("Pos Deleted Successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Like a post
router.put('/like/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const { userId } = req
        const post = await PostModel.findById(postId)
        if (post) {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length > 0
            if (isLiked) {
                return res.status(401).send("Post already liked")
            }
            await post.likes.unshift({ user: userId })
            await post.save()
            if (post.user.toString() !== userId) {
                await newLikeNotification(userId, postId, post.user.toString())
            }
            return res.status(200).send("Post Liked")
        } else {
            return res.status(404).send("Post not found")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

// Unlike a post
router.put('/unlike/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const { userId } = req
        const post = await PostModel.findById(postId)
        if (post) {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length === 0
            if (isLiked) {
                return res.status(401).send("Post not liked before")
            }
            const index = post.likes.map(like => like.user.toString()).indexOf(userId)
            await post.likes.splice(index, 1)
            await post.save()
            if (post.user.toString() !== userId) {
                await removeLikeNotification(userId, postId, post.user.toString())
            }
            return res.status(200).send("Post Unliked")
        } else {
            return res.status(404).send("Post not found")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

// Get all likes by postId
router.get('/like/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const post = await PostModel.findById(postId).populate('likes.user')
        if (!post) {
            return res.status(404).send("Post not found")
        } else {
            return res.status(200).json(post.likes)
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

// Create a comment
router.put('/comment/:postId', authMiddleware, async(req, res) => {
    try {
        const { postId } = req.params
        const { text } = req.body
        const { userId } = req
        if (text.length < 1) {
            return res.status(401).send("Please add comment")
        }
        const post = await PostModel.findById(postId)
        if (post) {
            const newComment = {
                _id: uuidv4(),
                text,
                user: req.userId,
                date: Date.now()
            }
            await post.comments.unshift(newComment)
            await post.save()
            if (post.user.toString() !== userId) {
                await newCommentNotification(postId, newComment._id, userId, post.user.toString(), text)
            }
            return res.status(200).json(newComment._id)
        } else {
            return res.status(404).send("Post not found")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

// Delete a comment
router.delete('/comment/:postId/:commentId', authMiddleware, async(req, res) => {
    try {
        const { postId, commentId } = req.params
        const { userId } = req
        const post = await PostModel.findById(postId)
        if (!post) {
            return res.status(404).send("Post not found")
        } else {
            const comment = post.comments.find(com => com._id === commentId)
            if (!comment) {
                res.status(404).send("No comment Found")
            }
            const user = await UserModel.findById(userId)
            if (comment.user.toString() !== userId) {
                if (user.role === "root") {
                    const commentIndex = post.comments.map(com => com._id).indexOf(commentId)
                    await post.comments.splice(commentIndex, 1)
                    await post.save()
                    if (post.user.toString() !== userId) {
                        await removeCommentNotification(postId, newComment._id, userId, post.user.toString(), text)
                    }
                    return res.status(200).send("Comment Deleted Successfully")
                } else {
                    return res.status(401).send("Unauthorized")
                }
            }
            const commentIndex = post.comments.map(com => com._id).indexOf(commentId)
            await post.comments.splice(commentIndex, 1)
            await post.save()
            if (post.user.toString() !== userId) {
                await removeCommentNotification(postId, newComment._id, userId, post.user.toString(), text)
            }
            return res.status(200).send("Comment Deleted Successfully")
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
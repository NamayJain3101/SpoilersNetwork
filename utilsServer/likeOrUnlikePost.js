const PostModel = require("../models/PostModel");
const UserModel = require("../models/UserModel");
const { newLikeNotification, removeLikeNotification } = require("./notificationsActions");

const likeOrUnlikePost = async(postId, userId, like) => {
    try {
        const post = await PostModel.findById(postId)
        if (!post) {
            return { error: "No post found" }
        }
        if (like) {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length > 0
            if (isLiked) {
                return { error: "Post already liked" }
            }
            await post.likes.unshift({ user: userId })
            await post.save()
            if (post.user.toString() !== userId) {
                await newLikeNotification(userId, postId, post.user.toString())
            }
        } else {
            const isLiked = post.likes.filter(like => like.user.toString() === userId).length === 0
            if (isLiked) {
                return { error: "Post not liked before" }
            }
            const indexOf = post.likes.map(like => like.user.toString()).indexOf(userId)
            await post.likes.splice(indexOf, 1)
            await post.save()
            if (post.user.toString() !== userId) {
                await removeLikeNotification(userId, postId, post.user.toString())
            }
        }
        const user = await UserModel.findById(userId)
        const { name, profilePicUrl, username } = user

        return { success: true, name, username, profilePicUrl, postByUserId: post.user.toString() }
    } catch (err) {
        console.log(err)
        return { error: "Server Error" }
    }
}

module.exports = { likeOrUnlikePost }
import axios from 'axios'
import Cookies from 'js-cookie'
import baseUrl from './baseUrl'
import catchErrors from './catchErrors'

const Axios = axios.create({
    baseURL: `${baseUrl}/api/posts`,
    headers: { Authorization: Cookies.get("token") }
})

export const submitNewPost = async(text, location, picUrl, publicId, setPosts, setNewPost, setError) => {
    try {
        const res = await Axios.post("/", { text, location, picUrl, publicId })
        setPosts(posts => ([res.data, ...posts]))
        setNewPost({
            text: "",
            location: ""
        })
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        setError(errorMsg)
    }
}

export const deletePost = async(postId, setPosts, setShowToaster, setError) => {
    try {
        const res = await Axios.delete(`/${postId}`)
        setPosts(posts => posts.filter(post => post._id !== postId))
        setShowToaster(true)
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        setError(errorMsg)
    }
}

export const likePost = async(postId, userId, setLikes, like = true) => {
    try {
        if (like) {
            await Axios.put(`/like/${postId}`)
            setLikes(likes => [...likes, { user: userId }])
        } else if (!like) {
            await Axios.put(`/unlike/${postId}`)
            setLikes(likes => likes.filter(like => like.user !== userId))
        }
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        alert(errorMsg)
    }
}

export const postComment = async(postId, user, text, setComments, setText) => {
    try {
        const res = await Axios.put(`/comment/${postId}`, { text })
        const newComment = {
            _id: res.data,
            user,
            text,
            date: Date.now()
        }
        setComments(comments => [newComment, ...comments])
        setText("")
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        alert(errorMsg)
    }
}

export const deleteComment = async(postId, commentId, setComments) => {
    try {
        await Axios.delete(`/comment/${postId}/${commentId}`)
        setComments(comments => comments.filter(comment => comment._id !== commentId))
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        alert(errorMsg)
    }
}
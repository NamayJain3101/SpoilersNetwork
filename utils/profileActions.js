import axios from 'axios'
import Cookies from 'js-cookie'
import Router from 'next/router'
import baseUrl from './baseUrl'
import catchErrors from './catchErrors'

const Axios = axios.create({
    baseURL: `${baseUrl}/api/profile`,
    headers: { Authorization: Cookies.get("token") }
})

export const followUser = async(userToFollowId, setUserFollowStats, setFollowError) => {
    try {
        await Axios.post(`/follow/${userToFollowId}`)
        setUserFollowStats(stats => ({
            ...stats,
            following: [...stats.following, { user: userToFollowId }]
        }))
    } catch (err) {
        console.log(err)
        setFollowError("Error Following User")
    }
}

export const unfollowUser = async(userToUnfollowId, setUserFollowStats, setFollowError) => {
    try {
        await Axios.put(`/unfollow/${userToUnfollowId}`)
        setUserFollowStats(stats => ({
            ...stats,
            following: stats.following.filter(follow => follow.user !== userToUnfollowId)
        }))
    } catch (err) {
        console.log(err)
        setFollowError("Error Unfollowing User")
    }
}

export const updateProfile = async(profile, setLoading, setErrorMsg, profilePicUrl) => {
    try {
        const { bio, facebook, youtube, twitter, instagram } = profile
        await Axios.post(`/update`, {
            bio,
            facebook,
            instagram,
            youtube,
            twitter,
            profilePicUrl
        })
        setLoading(false)
        Router.reload()
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        setErrorMsg(errorMsg)
        setLoading(false)
    }
}

export const updatePassword = async(setSuccess, userPasswords, setErrorMsg) => {
    try {
        const { currentPassword, newPassword } = userPasswords
        await Axios.post(`/settings/password`, {
            currentPassword,
            newPassword
        })
        setSuccess(true)
    } catch (err) {
        console.log(err)
        setErrorMsg(catchErrors(err))
    }
}

export const toggleMessagePopup = async(popupSettings, setPopupSettings, setSuccess, setError) => {
    try {
        await Axios.post(`/settings/messagePopup`)
        setPopupSettings(!popupSettings)
        setSuccess(true)
    } catch (err) {
        console.log(err)
        setError(catchErrors(err))
    }
}
import baseUrl from "./baseUrl"
import axios from "axios"
import Cookies from "js-cookie"

export const getUserInfo = async(userToFindId) => {
    try {
        const res = await axios.get(`${baseUrl}/api/chats/user/${userToFindId}`, {
            headers: {
                Authorization: Cookies.get("token")
            }
        })
        return {
            name: res.data.name,
            profilePicUrl: res.data.profilePicUrl
        }
    } catch (err) {
        console.log(err)
    }
}
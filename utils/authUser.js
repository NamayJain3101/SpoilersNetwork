import axios from 'axios'
import baseUrl from './baseUrl'
import catchErrors from './catchErrors'
import Router from 'next/router'
import cookie from "js-cookie"

// Call /api/signup
export const registerUser = async(user, profilePicUrl, setError, setLoading) => {
    try {
        const res = await axios.post(`${baseUrl}/api/signup`, { user, profilePicUrl })
        setToken(res.data)
    } catch (err) {
        console.log(err)
        const errorMsg = catchErrors(err)
        setError(errorMsg)
    }
    setLoading(false);
}

// Call /api/auth
export const loginUser = async(user, setError, setLoading) => {
    try {
        const res = await axios.post(`${baseUrl}/api/auth`, { user })
        setToken(res.data)
    } catch (err) {
        const errorMsg = catchErrors(err)
        setError(errorMsg)
    }
    setLoading(false)
}

// logout user
export const logoutUser = (email) => {
    cookie.set("userEmail", email)
    cookie.remove("token")
    Router.push("/login")
    Router.reload()
}

// Redirect user if he reaches invalid pathname
export const redirectUser = (ctx, location) => {
    if (ctx.req) {
        ctx.res.writeHead(302, { Location: location })
        ctx.res.end()
    } else {
        Router.push(location)
    }
}

// To set token as cookie
const setToken = (token) => {
    cookie.set('token', token)
    Router.push("/")
}

export const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
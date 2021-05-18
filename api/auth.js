const express = require("express")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

const UserModel = require('../models/UserModel')
const FollowerModel = require('../models/FollowerModel')

const isEmail = require('validator/lib/isEmail')

const authMiddleware = require('../middleware/authMiddleware')

router.get('/', authMiddleware, async(req, res) => {
    const { userId } = req
    try {
        const user = await UserModel.findById(userId)
        const userFollowStats = await FollowerModel.findOne({ user: userId })
        return res.status(200).json({ user, userFollowStats })
    } catch (err) {
        console.log(error)
        return res.status(500).send('Server Error')
    }
})

router.post('/', async(req, res) => {
    const { email, password } = req.body.user
    try {
        if (!isEmail(email)) {
            return res.status(401).send("Invalid Email")
        }
        if (password.length < 8) {
            return res.status(401).send("Password must be atleast 8 characters")
        }

        const user = await UserModel.findOne({ email: email.toLocaleLowerCase() }).select('+password')
        if (!user) {
            return res.status(401).send("Invalid Credentials")
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password)
        if (!isPasswordMatch) {
            return res.status(401).send("Invalid Credentials")
        }

        const payload = { userId: user._id }
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "2d" }, (err, token) => {
            if (err) {
                throw err
            }
            res.status(200).json(token)
        })
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

module.exports = router
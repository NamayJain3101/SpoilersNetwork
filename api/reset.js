const express = require("express")
const router = express.Router()

const bcrypt = require("bcryptjs")
const nodemailer = require("nodemailer")
const sendgridTransport = require("nodemailer-sendgrid-transport")

const crypto = require("crypto")
const isEmail = require("validator/lib/isEmail")
const UserModel = require("../models/UserModel")

const baseUrl = require('../utils/baseUrl')

const options = {
    auth: {
        api_key: process.env.SENDGRID_API
    }
}

const transporter = nodemailer.createTransport(sendgridTransport(options))

// Check user exists and send email for reset password
router.post('/', async(req, res) => {
    try {
        const { email } = req.body
        if (!isEmail(email)) {
            return res.status(401).send("Invalid Email")
        }
        const user = await UserModel.findOne({ email: email.toLowerCase() })
        if (!user) {
            return res.status(404).send("User not found")
        }
        const token = crypto.randomBytes(32).toString('hex')
        user.resetToken = token
        user.expireToken = Date.now() + 3600000
        await user.save()
        const href = `${baseUrl}/reset/${token}`
        const mailOptions = {
            to: user.email,
            from: "namayjain.jainnamay@gmail.com",
            subject: "Password reset request",
            html: `
                <p>Hey ${user.name.split(" ")[0].toString()}, There wa a request for paassword reset, 
                    <a href=${href}>Click this link to reset the password</a>
                </p>
                <p>
                    This token is valid for only 60 minutes
                </p>
            `
        }
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.log(err)
            }
        })
        return res.status(200).send("Email Sent Successfully")
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

// Verify token and reset password
router.post('/token', async(req, res) => {
    try {
        const { token, password } = req.body
        if (!token) {
            return res.status(401).send("Unauthorized")
        }
        if (password.length < 8) {
            return res.status(401).send("Unauthorized")
        }
        const user = await UserModel.findOne({ resetToken: token })
        if (!user) {
            return res.status(404).send("User not found")
        }
        if (Date.now() > user.expireToken) {
            return res.status(401).send("Token Expires. Generate New??")
        }
        user.password = await bcrypt.hash(password, 10)
        user.resetToken = ""
        user.expireToken = undefined
        user.save()
        return res.status(200).send("Password  Updated")
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

module.exports = router
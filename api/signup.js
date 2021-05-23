const express = require("express")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const router = express.Router()

const UserModel = require('../models/UserModel')
const ProfileModel = require('../models/ProfileModel')
const FollowerModel = require('../models/FollowerModel')
const NotificationModel = require('../models/NotificationModel')

const isEmail = require('validator/lib/isEmail')
const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
const userPng = "https://res.cloudinary.com/namay3101/image/upload/v1621160422/user_mklcpl_w9jefv.png"

router.get('/:username', async(req, res) => {
    const { username } = req.params
    try {
        if (username.length < 1) {
            return res.status(401).send('Invalid')
        }
        if (!regexUserName.test(username)) {
            return res.status(401).send("Invalid")
        }
        const user = await UserModel.findOne({ username: username.toLocaleLowerCase() })
        if (user) {
            return res.status(401).send("Username already taken")
        }
        return res.status(200).send("available")
    } catch (err) {
        console.log(err)
        return res.status(500).send('Server Error')
    }
})

router.post('/', async(req, res) => {
    try {
        const { name, email, username, password, bio, facebook, youtube, twitter, instagram } = req.body.user
        if (!isEmail(email)) {
            return res.status(401).send("Invalid Email")
        }
        if (password.length < 8) {
            return res.status(401).send("Password must be atleast 8 characters")
        }
        const userExist = await UserModel.findOne({ email: email.toLocaleLowerCase() })
        if (userExist) {
            return res.status(401).send("User already exist")
        }
        const user = new UserModel({
            name,
            email: email.toLocaleLowerCase(),
            password,
            username: username.toLocaleLowerCase(),
            password,
            profilePicUrl: req.body.profilePicUrl || userPng
        })
        user.password = await bcrypt.hash(password, 10)
        await user.save()

        let profileFields = {}
        profileFields.user = user._id
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
        await new ProfileModel(profileFields).save()

        await new FollowerModel({
            user: user._id,
            followers: [],
            following: []
        }).save()

        await new NotificationModel({ user: user._id, notifications: [] }).save()

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
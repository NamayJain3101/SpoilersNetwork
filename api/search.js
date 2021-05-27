const UserModel = require('../models/UserModel')
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

router.get("/:searchText", authMiddleware, async(req, res) => {
    try {
        const { searchText } = req.params
        const { userId } = req
        if (searchText.length === 0) {
            return
        }
        let userPattern = new RegExp(`^${searchText}`)
        const results = await UserModel.find({
            name: {
                $regex: userPattern,
                $options: "i"
            }
        })
        const resultsToBeSent = results.filter(result => result._id.toString() !== userId)
        if (resultsToBeSent.length !== 0) {
            res.json(resultsToBeSent)
        } else {
            return res.json({})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

module.exports = router
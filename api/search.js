const UserModel = require('../models/UserModel')
const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")

router.get("/:searchText", authMiddleware, async(req, res) => {
    const { searchText } = req.params
    if (searchText.length === 0) {
        return
    }
    try {
        let userPattern = new RegExp(`^${searchText}`)
        const results = await UserModel.find({
            name: {
                $regex: userPattern,
                $options: "i"
            }
        })
        if (results.length !== 0) {
            res.json(results)
        } else {
            return res.json({})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).send("Server Error")
    }
})

module.exports = router
const jwt = require("jsonwebtoken")

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(401).send('Unauthorized')
        }
        const { userId } = jwt.verify(req.headers.authorization, process.env.JWT_SECRET)
        req.userId = userId
        next()
    } catch (err) {
        console.log(err)
        return res.status(401).send('Unauthorized')
    }
}
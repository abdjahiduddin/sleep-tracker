const jwt = require("jsonwebtoken")
const dotenv = require("dotenv").config()

module.exports = (req, res, next) => {
    const authHeader = req.get("Authorization")
    
    if(!authHeader) {
        const err = new Error("Not authorized")
        err.statusCode = 401
        err.data = "Authorization header not found"
        return next(err)
    }

    let decodedToken

    try {
        const token = authHeader.split(" ")[1];
        decodedToken = jwt.verify(token, process.env.JWT_SECRET)
    } catch (error) {
        error.statusCode = 500
        return next(error)
    }

    if(!decodedToken) {
        const err = new Error("Token verification failed")
        err.statusCode = 401
        err.data = "Token invalid"
        return next(err)
    }
    req.userId = decodedToken.id
    next()
}
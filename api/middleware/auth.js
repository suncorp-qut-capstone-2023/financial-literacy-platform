const jwt = require('jsonwebtoken');

const authorize = function(req, res, next){
    const authHeader = req.headers.authorization

    // Check header
    if(!authHeader || typeof authHeader === 'undefined'){
        next()
    }
    else if(authHeader.split(' ').length !== 2){
        res.status(401).json({
            error: true,
            message: 'Authorization header is malformed'
        })
    }
    else{
        const token = authHeader.split(" ")[1]

        // Check JWT
        try{
            const jwtVerify = jwt.verify(token, process.env.SECRET_KEY)
            if(!jwtVerify){
                res.status(401).json({
                    error: true,
                    message: 'Authorization header is malformed'
                })
                return
            }

            // Set userID from the decoded JWT to the req object
            req.userID = jwtVerify.userId;

            // Check token expiration
            if(jwtVerify.exp < Date.now()){
                res.status(401).json({
                    error: true,
                    message: 'JWT token has expired'
                })
                return
            }

            // authorized
            req.isAuthorized = true
            // console.log("Token Received in Request : {}", token)
            req.token = token
            next()
        }
        catch(err){
            res.status(401).json({
                error: true,
                message: 'Invalid JWT token'
            })
        }
    }
}

module.exports = authorize;
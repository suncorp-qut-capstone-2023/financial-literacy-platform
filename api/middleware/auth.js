const jwt = require('jsonwebtoken');
const { validateHeader } = require('../utils/validation');

const authorize = function(req, res, next){
    const authHeader = req.headers.authorization;

    // Verify SECRET_KEY exists
    if (!process.env.SECRET_KEY) {
        console.error('SECRET_KEY is not set.');
        res.status(500).json({
            error: true,
            message: 'Internal server error'
        });
        return;
    }

    // Check header
    if (!validateHeader(authHeader)) {
        res.status(401).json({
            error: true,
            message: 'Invalid Authorization header'
        });
        return;
    }

    const token = authHeader.split(' ')[1];

    // Check JWT
    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        // Set userID from the decoded JWT to the req object
        if (decoded && decoded.userId) {
            req.userId = decoded.userId;
        } else {
            throw new Error('User ID is missing in the token');
        }

        // Check token expiration
        if (decoded.exp * 1000 < Date.now()) {
            res.status(401).json({
                error: true,
                message: 'JWT token has expired'
            });
            return;
        }

        // Attach more data from token to req object if required
        req.isAuthorized = true;
        req.role = decoded.userType;
        req.token = token;
        next();
    } catch (err) {
        console.error('JWT verification failed:', err.message);
        res.status(401).json({
            error: true,
            message: 'Invalid JWT token'
        });
    }
};

module.exports = authorize;
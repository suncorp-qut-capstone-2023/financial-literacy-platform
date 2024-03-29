const jwt = require('jsonwebtoken');
const { hashPassword, comparePassword } = require('../utils/auth');
const User = require('../models/User');

// Register new user
const registerUser = async (req, res, next) => {
    // get body values
    const email = req.body.email
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName
    const admin_token = req.body.createAdminToken

    // Handle input
    if (!email || !password || !firstName || !lastName) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, all fields are required"
        });
        return;
    }

    // Query DB for request
    try {
        // check if user exists
        const users = await User.getByEmail(email);
        if (users.length > 0) {
            res.status(409).json({
                error: true,
                message: "User already exists!"
            });
            return;
        }

        // create user
        const hash = await hashPassword(password);
        const userData = {
            email: email,
            password_hash: hash,
            first_name: firstName,
            last_name: lastName
        }
        if (admin_token && admin_token === process.env.ADMIN_TOKEN){
            userData.is_admin = true;
        }
        const userId = await User.create(userData);
        res.status(201).json({
            message: "User created",
            userId: userId[0]
        });

    } catch (error) {
        next(error);
    }
}

// Login user
const loginUser = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password

    // Handle input
    if (!email || !password) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, both email and password are required"
        });
        return;
    }

    // Query DB for request
    try {
        const users = await User.getByEmail(email);
        if (users.length === 0) {
            res.status(401).json({
                error: true,
                message: "Incorrect email or password"
            });
        }
        else {
            const user = users[0];
            const match = await comparePassword(password, user.password_hash);
            if (!match) {
                res.status(401).json({
                    error: true,
                    message: "Incorrect email or password"
                });
                return;
            }

            // create token
            const userId = user.id;
            const userType = user.is_admin ? "admin" : "user";
            const expires_in = 24 * 60 * 60;
            const exp = Date.now() + expires_in * 1000;
            const token = jwt.sign({ userId, userType, email, exp }, process.env.SECRET_KEY);

            // attach token to response
            res.cookie("token", token, { httpOnly: true, expires: new Date(exp * 1000) });

            res.status(200).json({
                token_type: "Bearer",
                token: token,
                expires_in: expires_in
            });
        }
    } catch (error) {
        next(error);
    }
}

// Get user info
const getUser = async (req, res, next) => {
    try {
        // grab the userId from the jwt header
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const decodedEmail = decoded.email;

        // Handle input
        if (!decodedEmail) {
            res.status(400).json({
                error: true,
                message: "Invalid token"
            });
        }

        // Query DB for request
        const users = await User.getByEmail(decodedEmail);
        if (users.length === 0) {
            res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        else {
            // return user
            const user = users[0];
            res.status(200).json({
                userId: user.id,
                userType: user.is_admin ? "admin" : "user",
                email: user.email,
                firstName: user.first_name,
                lastName: user.last_name
            });
        }
    } catch (error) {
        next(error);
    }
}

// Update user info
const updateUser = async (req, res, next) => {
    const email = req.body.email
    const password = req.body.password
    const firstName = req.body.firstName
    const lastName = req.body.lastName

    // Handle input
    if (!email && !password && !firstName && !lastName) {
        res.status(400).json({
            error: true,
            message: "Request body incomplete, some fields are required"
        });
    }

    try {
        // grab the userId from the jwt header
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const decodedUserId = decoded.userId;

        // Query DB for request
        const users = await User.getById(decodedUserId);
        if (users.length === 0) {
            res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        else {
            // update user
            const userData = {};
            if (email) {
                userData.email = email;
            }
            if (password) {
                userData.password_hash = await hashPassword(password);
            }
            if (firstName) {
                userData.first_name = firstName;
            }
            if (lastName) {
                userData.last_name = lastName;
            }
            await User.update(decodedUserId, userData)
            res.status(200).json({
                message: "User updated"
            });
        }
    }
    catch (error) {
        next(error);
    }
}

// Delete user
const deleteUser = async (req, res, next) => {
    try {
        // grab the userId from the jwt header
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const decodedUserId = decoded.userId;

        // Handle input
        if (!decodedUserId) {
            res.status(400).json({
                error: true,
                message: "Invalid token"
            });
        }

        // Query DB for request
        const users = await User.getById(decodedUserId);
        if (users.length === 0) {
            res.status(404).json({
                error: true,
                message: "User not found"
            });
        }
        else {
            // delete user
            await User.delete(decodedUserId);
            res.status(200).json({
                message: "User deleted"
            });
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser
}
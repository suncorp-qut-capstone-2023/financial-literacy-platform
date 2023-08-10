const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    registerUser,
    loginUser,
    getUser,
    updateUser,
    deleteUser,
    logoutUser,
    forgotPassword
} = require('../controller/userController.js');

router.post('/register', registerUser);
router.post('/login', loginUser);
// router.post('/logout', auth, logoutUser);

router.get('/me', auth, getUser);
router.put('/me', auth, updateUser);
router.delete('/me', auth, deleteUser);

// router.post('/forgot-password', forgotPassword);

module.exports = router;
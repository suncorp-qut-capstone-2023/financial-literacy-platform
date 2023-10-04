const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllQuizzes
} = require("../controller/allQuizzesController");

const router = express.Router();

router.get('/', auth, getAllQuizzes);

module.exports = router;
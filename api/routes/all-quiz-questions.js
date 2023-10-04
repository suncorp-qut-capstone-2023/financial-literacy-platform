const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllQuizQuestions
} = require("../controller/allQuizQuestionsController");

const router = express.Router();

router.get('/', auth, getAllQuizQuestions);

module.exports = router;
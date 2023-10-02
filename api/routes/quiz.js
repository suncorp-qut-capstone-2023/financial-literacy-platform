const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
} = require('../controller/quizController.js');

// GET
router.get('/', auth, getQuiz);

// CREATE
router.post('/create', auth, createQuiz);

// UPDATE
router.post('/update', auth, updateQuiz);

// DELETE
router.post('/delete', auth, deleteQuiz);

module.exports = router;
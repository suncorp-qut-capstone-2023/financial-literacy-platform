const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getQuizQuestion,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion
} = require('../controller/quizQuestionController.js');

// GET
router.get('/', auth, getQuizQuestion);

// CREATE
router.post('/create', auth, createQuizQuestion);

// UPDATE
router.post('/update', auth, updateQuizQuestion);

// DELETE
router.post('/delete', auth, deleteQuizQuestion);

module.exports = router;
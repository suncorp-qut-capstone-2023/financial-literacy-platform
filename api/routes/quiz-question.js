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
router.post('/create', auth, requireAdmin, createQuizQuestion);

// UPDATE
router.post('/update', auth, requireAdmin, updateQuizQuestion);

// DELETE
router.post('/delete', auth, requireAdmin, deleteQuizQuestion);

module.exports = router;
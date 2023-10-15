const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
} = require('../controller/quizController.js');

// GET
router.get('/', getQuiz);

// CREATE
router.post('/create', auth, requireAdmin, createQuiz);

// UPDATE
router.post('/update', auth, requireAdmin, updateQuiz);

// DELETE
router.post('/delete', auth, requireAdmin, deleteQuiz);

module.exports = router;
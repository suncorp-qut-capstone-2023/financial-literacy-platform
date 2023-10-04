const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getLecture,
    createLecture,
    updateLecture,
    deleteLecture,
} = require('../controller/lectureController.js');

// GET
router.get('/', auth, getLecture);

// CREATE
router.post('/create', auth, requireAdmin, createLecture);

// UPDATE
router.post('/update', auth, requireAdmin, updateLecture);

// DELETE
router.post('/delete', auth, requireAdmin, deleteLecture);

// SORT
// router.get('/sort', auth, requireAdmin, sortNewestLecture);

module.exports = router;
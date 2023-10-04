const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getLectureContent,
    createLectureContent,
    updateLectureContent,
    deleteLectureContent,
} = require('../controller/lectureContentController');

// GET
router.get('/', auth, getLectureContent);

// CREATE
router.post('/create', auth, requireAdmin, createLectureContent);

// UPDATE
router.post('/update', auth, requireAdmin, updateLectureContent);

// DELETE
router.post('/delete', auth, requireAdmin, deleteLectureContent);

// SORT
// router.get('/sort', auth, requireAdmin, sortNewestLectureContent);

module.exports = router;
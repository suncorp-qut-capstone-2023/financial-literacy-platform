const express = require('express');
const auth = require('../middleware/auth.js');
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
router.post('/create', auth, createLectureContent);

// UPDATE
router.post('/update', auth, updateLectureContent);

// DELETE
router.post('/delete', auth, deleteLectureContent);

// SORT
// router.get('/sort', auth, sortNewestLectureContent);

module.exports = router;
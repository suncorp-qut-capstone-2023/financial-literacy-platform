const express = require('express');
const auth = require('../middleware/auth.js');
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
router.post('/create', auth, createLecture);

// UPDATE
router.post('/update', auth, updateLecture);

// DELETE
router.post('/delete', auth, deleteLecture);

// SORT
// router.get('/sort', auth, sortNewestLecture);

module.exports = router;
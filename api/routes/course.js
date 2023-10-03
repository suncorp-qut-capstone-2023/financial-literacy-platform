const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require('../controller/courseController');

// GET
router.get('/:ID', auth, getCourse);

// CREATE
router.post('/create', auth, createCourse);

// UPDATE
router.post('/update/:ID', auth, updateCourse);

// DELETE
router.post('/delete/:ID', auth, deleteCourse);

// SORT
// router.get('/sort', auth, sortNewestCourse);

module.exports = router;
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
router.get('/', auth, getCourse);

// CREATE
router.post('/create', auth, createCourse);

// UPDATE
router.put('/update', auth, updateCourse);

// DELETE
router.delete('/delete', auth, deleteCourse);

// SORT
// router.get('/sort', auth, sortNewestCourse);

module.exports = router;
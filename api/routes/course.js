const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
} = require('../controller/courseController');

// GET
router.get('/', getCourse);

// CREATE
router.post('/create', auth, requireAdmin, createCourse);

// UPDATE
router.post('/update', auth, requireAdmin, updateCourse);

// DELETE
router.post('/delete', auth, requireAdmin, deleteCourse);

// SORT
// router.get('/sort', auth, requireAdmin, sortNewestCourse);

module.exports = router;
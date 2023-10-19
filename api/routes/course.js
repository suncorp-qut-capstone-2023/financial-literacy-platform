const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse,
    getTags,
    addTag,
    deleteTag
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

// GET TAGS
router.get('/tags', auth, getTags);

// ADD TAGS
router.post('/tag/add', auth, requireAdmin, addTag);

// DELETE TAGS
router.post('/tag/delete', auth, requireAdmin, deleteTag);

module.exports = router;
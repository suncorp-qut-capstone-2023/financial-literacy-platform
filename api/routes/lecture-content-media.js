const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require('../controller/lectureContentMediaController');

// GET
router.get('/', auth, getMaterial);

// CREATE
router.post('/create', auth, createMaterial);

// UPDATE
router.post('/update', auth, updateMaterial);

// DELETE
router.post('/delete', auth, deleteMaterial);


module.exports = router;
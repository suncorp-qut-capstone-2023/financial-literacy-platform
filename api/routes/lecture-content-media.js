const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
} = require('../controller/lectureContentMediaController');

// GET
router.get('/', getMaterial);

// CREATE
router.post('/create', auth, requireAdmin, createMaterial);

// UPDATE
router.post('/update', auth, requireAdmin, updateMaterial);

// DELETE
router.post('/delete', auth, requireAdmin, deleteMaterial);


module.exports = router;
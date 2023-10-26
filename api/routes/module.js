const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getModule,
    createModule,
    updateModule,
    deleteModule,
} = require('../controller/moduleController.js');

// GET
router.get('/', getModule);

// CREATE
router.post('/create', auth, requireAdmin, createModule);

// UPDATE
router.post('/update', auth, requireAdmin, updateModule);

// DELETE
router.post('/delete', auth, requireAdmin, deleteModule);

// SORT
// router.get('/sort', auth, requireAdmin, sortNewestModule);

module.exports = router;
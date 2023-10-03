const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getModule,
    createModule,
    updateModule,
    deleteModule,
} = require('../controller/moduleController.js');

// GET
router.get('/', auth, getModule);

// CREATE
router.post('/create', auth, createModule);

// UPDATE
router.put('/update', auth, updateModule);

// DELETE
router.delete('/delete', auth, deleteModule);

// SORT
// router.get('/sort', auth, sortNewestModule);

module.exports = router;
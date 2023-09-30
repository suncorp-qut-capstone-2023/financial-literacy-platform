const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getMedia,
    uploadMedia
} = require('../controller/mediaController.js');

// TODO - This two are not fully implemented yet
router.post('/download', auth, getMedia);
router.post('/upload', auth, uploadMedia);

module.exports = router;
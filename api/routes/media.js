const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getMedia,
    uploadMedia
} = require('../controller/mediaController.js');

router.post('/download', auth, getMedia);
router.post('/upload', auth, uploadMedia);

module.exports = router;
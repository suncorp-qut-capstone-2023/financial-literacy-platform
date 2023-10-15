const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getALLMaterial
} = require("../controller/allLectureContentMediasController");

const router = express.Router();

router.get('/', getALLMaterial);

module.exports = router;
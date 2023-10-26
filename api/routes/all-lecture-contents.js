const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllLectureContents
} = require("../controller/allLectureContentsController");

const router = express.Router();

router.get('/', getAllLectureContents);

module.exports = router;
const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllLectures
} = require("../controller/allLecturesController");

const router = express.Router();

router.get('/', getAllLectures);

module.exports = router;
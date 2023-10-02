const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllCourses
} = require("../controller/allCoursesController");

const router = express.Router();

router.get('/', auth, getAllCourses);

module.exports = router;
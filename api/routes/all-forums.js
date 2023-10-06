const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getForums
} = require("../controller/allForumsController");

const router = express.Router();

router.get('/', getForums);

module.exports = router;
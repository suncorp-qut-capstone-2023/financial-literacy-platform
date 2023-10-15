const express = require('express');
const auth = require('../middleware/auth.js');
const {
    getAllModules
} = require("../controller/allModulesController");

const router = express.Router();

router.get('/', getAllModules);

module.exports = router;
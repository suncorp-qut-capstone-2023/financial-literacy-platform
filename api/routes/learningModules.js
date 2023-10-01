const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");

const {
  searchModule,
  addTag,
  deleteTag,
  searchTag
} = require('../controller/SearchController.js');

//related to search and tagging search
//TODO: Please update this to module and not learning modules later
router.post("/search", auth, searchModule);
router.post("/add/tags", auth, addTag);
router.delete("/delete/tags", auth, deleteTag);
router.post("/search/tags", auth, searchTag);

module.exports = router;

const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();

const {
  getForumComments,
  createForumComment,
  createForum,
  getForums,
  getForumComment,
  updateForumComment,
} = require("../controller/forumController.js");

router.get("/", auth, getForums);
router.get("/:forumID", auth, getForumComments);
router.get("/:forumID/:commentID", auth, getForumComment);

router.post("/create", auth, createForum);
router.post("/:forumID/comment", auth, createForumComment);

router.put("/:forumID/:commentID", auth, updateForumComment);

module.exports = router;

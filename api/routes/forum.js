const express = require('express');
const auth = require('../middleware/auth.js');
const { requireAdmin } = require('../middleware/requireRole.js');
const router = express.Router();

const {
    getForumComments,
    createForumComment,
    createForum,
    getForumComment,
    updateForumComment
} = require("../controller/forumController.js");

router.get("/:forumID", getForumComments);
router.get("/:forumID/:commentID", getForumComment);

router.post("/create", auth, requireAdmin, createForum);
router.post("/:forumID/comment", auth, createForumComment);

router.put("/:forumID/:commentID", auth, updateForumComment);

module.exports = router;
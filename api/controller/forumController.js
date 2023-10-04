const forumModel = require("../models/Forum.js");

const getForumComments = async (req, res) => {
  const { forumID, courseID } = req.params;

  try {
    const comments = await forumModel.getForumComments(forumID || courseID);
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Database error!", error: error.message });
  }
};

const createForumComment = async (req, res) => {
  const { body, forumID, courseID } = req.body;

  // Validate input fields
  if (!body || (!forumID && !courseID)) {
    return res
      .status(400)
      .json({ message: "body and either forumID or courseID are required!" });
  }

  const forumCommentData = {
    Body: body,
    DateCommented: new Date().toISOString().slice(0, 19).replace("T", " "), // Format to 'YYYY-MM-DD HH:MM:SS'
    UserID: req.userId,
  };

  if (forumID) {
    forumCommentData.ForumID = forumID;
  } else if (courseID) {
    forumCommentData.CourseID = courseID;
  }

  try {
    await forumModel.createForumComment(forumCommentData);
    res.status(201).json({
      message: "Forum comment created!",
      forumComment: forumCommentData,
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: "Database error!", error: error.message });
  }
};

const createForum = async (req, res) => {
  const { ForumTitle, CourseID } = req.body;

  if (!ForumTitle) {
    return res.status(400).json({ message: "ForumTitle is required!" });
  }

  const forumData = {
    ForumTitle,
    DateCreated: new Date(),
    CreatorID: req.userId,
  };

  if (CourseID) {
    forumData.CourseID = CourseID;
  }

  try {
    const _result = await forumModel.createForum(forumData);
    console.log("Result from createForum:", _result);
    res.status(201).json({ message: "Forum created!", forumID: _result[0] });
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

const getForumComment = async (req, res) => {
  const { commentID } = req.params;

  try {
    const comment = await forumModel.getForumComment(commentID);
    if (comment) {
      res.status(200).json(comment);
    } else {
      res.status(404).json({ message: "Comment not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

// TODO: Not working
const updateForumComment = async (req, res) => {
  const { commentID } = req.params;
  const { body } = req.body;

  if (!body) {
    return res.status(400).json({ message: "Comment body is required!" });
  }

  try {
    await forumModel.updateForumComment(commentID, body);
    res.status(200).json({ message: "Forum comment updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Database error!" });
  }
};

module.exports = {
  getForumComments,
  createForumComment,
  createForum,
  getForumComment,
  updateForumComment,
};

const forumModel = require('../models/forum.js');


const getForumComments = async (req, res) => {
    res.status(200).json({});
    //get
}

const createForumComment = async (req, res) => {
    if (!req.isAuthorized) {
        return res.status(401).json({ error: true, message: 'Not authorized!' });
    }

    const { body, forumID } = req.body;

    // Validate input fields
    if (!body || !forumID) {
        return res.status(400).json({ message: 'body and forumID are required!' });
    }

    const forumCommentData = {
        Body: body,
        DateCommented: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format to 'YYYY-MM-DD HH:MM:SS'
        UserID: req.userID, // Taking the userID from the request object
        ForumID: forumID
    };

    try {
        await forumModel.createForumComment(forumCommentData);
        res.status(201).json({ message: 'Forum comment created!', forumComment: forumCommentData });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Database error!', error: error.message });
    }
}


const createForum = async (req, res) => {
    console.log(req.userID);

    if (!req.isAuthorized) {
        return res.status(401).json({ error: true, message: 'Not authorized!' });
    }

    const { ForumTitle } = req.body;

    if (!ForumTitle) {
        return res.status(400).json({ message: 'ForumTitle is required!' });
    }

    const forumData = {
        ForumTitle,
        DateCreated: new Date(),
        CreatorID: req.userID
    };

    try {
        const _result = await forumModel.createForum(forumData);
        console.log("Result from createForum:", _result);
        res.status(201).json({ message: 'Forum created!', forumID: _result[0] });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Database error!', error: error.message });
    }
}


const getForumComment = async (req, res) => {
       // TODO: error handling
    const forumInfo = req.body;

    /*
        ForumTitle VARCHAR(255) NOT NULL,
        DateCreated DATETIME NOT NULL,
        CreatorID INT NOT NULL,
    */

    formData = {
        ForumTitle: forumInfo.title,
        DateCreated: "2023-12-31 23:59:59",
        CreatorID: forumInfo.creator,
    };

    await forum.createForum(formData);

    res.status(200).json(forumInfo);
    //post
}

const updateForumComment = async (req, res) => {
    res.status(200).json({});
    //put
}

module.exports = {
    getForumComments,
    createForumComment,
    createForum,
    getForumComment,
    updateForumComment
}
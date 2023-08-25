// Initialize knex with the config file.
const knexOptions = require('../db/knexfile');
const knex = require("knex")(knexOptions);

class Forum {
    static createForum(forumData) {
        return knex('Forum').insert(forumData).then(ids => {
            return ids[0]
        });
    }
    

    static createForumComment(forumCommentData) {
        return knex('forumcomments').insert(forumCommentData);
    }


    // Get all comments for a specific forum.
    static getForumComments(forumID) {
        return knex('forumcomments').where({ ForumID: forumID }).select();
    }

    // Get a single comment based on its ID.
    static getForumComment(commentID) {
        return knex('forumcomments').where({ CommentID: commentID }).first();
    }

    // update a comment based on its ID.
    static updateForumComment(commentID, updatedData) {
        return knex('forumcomments').where({ CommentID: commentID }).update(updatedData);
    }

}

module.exports = Forum;
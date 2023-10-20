// Initialize knex with the config file.
const knexOptions = require('../db/mydb-connection');
const knex = require("knex")(knexOptions);

class Forum {
    static createForum(forumData) {
        return knex('forum').insert(forumData).then(ids => {
            return ids[0]
        }).catch(error => {
            console.error("Error inserting into Forum:", error);
            throw error;
        });
    }

    static getForums() {
        return knex('forum').select();
    }
    

    static createForumComment(forumCommentData) {
        return knex('forumcomments').insert(forumCommentData);
    }


    // Get all comments for a specific forum.
    static getForumComments(identifier) {
        console.log(identifier)
        if (identifier) {
            return knex('forumcomments').where({ ForumID : identifier }).select();
        } 
        throw new Error('Invalid identifier provided');
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
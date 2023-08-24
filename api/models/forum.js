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
}

module.exports = Forum;
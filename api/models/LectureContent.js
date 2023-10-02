const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class LectureContent{

    static getAllLectureContents(lectureID) {
        return knex('lecture_content').select("*").where('lecture_id', '=', lectureID);
    }

    static getLectureContent(value) {
        return knex("lecture_content").select('*').where("LECTURE_CONTENT_ID", '=', value);
    }

    static createLectureContent(lectureID, lectureContentData) {
        return knex('lecture_content').where('lecture_id', '=', lectureID).insert(lectureContentData);
    }

    static updateLectureContent(set_data_type, value) {
        return knex('lecture_content').update({ [set_data_type]: value[0] }).where("LECTURE_CONTENT_ID", "=", value[1]);
    }

    static deleteLectureContent(value) {
        return knex('lecture_content').where("LECTURE_CONTENT_ID", "=", value).del();
    }
}

module.exports = LectureContent;
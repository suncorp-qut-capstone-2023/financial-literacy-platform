const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class LectureContent{

    static getAllLectureContents(lectureID) {
        return knex('lecture_content').select("*").where('LECTURE_ID', '=', lectureID);
    }

    static getLectureContent(courseID, moduleID, lectureID, lectureContentID) {
        return knex("lecture_content")
            .select('lecture_content.*')
            .innerJoin('lecture', 'lecture_content.LECTURE_ID', '=', 'lecture.LECTURE_ID')
            .innerJoin('module', 'lecture.MODULE_ID', '=', 'module.MODULE_ID')
            .innerJoin('course', 'module.COURSE_ID', '=', 'course.COURSE_ID')
            .where({
                "lecture_content.LECTURE_CONTENT_ID": lectureContentID,
                "lecture.LECTURE_ID": lectureID,
                "module.MODULE_ID": moduleID,
                "course.COURSE_ID": courseID
            });
    }

    static createLectureContent(lectureContentData) {
        return knex('lecture_content').insert(lectureContentData);
    }

    static updateLectureContent(lectureContentID, updateData) {
        return knex('lecture_content').update(updateData).where("LECTURE_CONTENT_ID", "=", lectureContentID);
    }

    static deleteLectureContent(value) {
        return knex('lecture_content').where("LECTURE_CONTENT_ID", "=", value).del();
    }
}

module.exports = LectureContent;
const knexOptions = require('../db/mydb-connection.js');
const Lecture = require("./Lecture");
const Module = require("./Module");
const Course = require("./Course");
const knex = require("knex")(knexOptions);

class LectureContent{

    static getAllLectureContents(lectureID) {
        console.log(lectureID)
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

    static deleteLectureContent(contentID) {
        try {
            //delete the actual lecture content data
            const result = knex('lecture_content').where("LECTURE_CONTENT_ID", "=", contentID).del();
            if (!result) throw new Error('Failed to delete lecture content'); //fail deletion lead to an error
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = LectureContent;
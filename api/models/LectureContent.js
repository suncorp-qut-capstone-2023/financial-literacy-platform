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

    static async deleteCourse(courseID) {
        //delete all related data in course table prior to deleting the lecture content data
        return await knex('course').where('COURSE_ID', '=', courseID).del();    
    }

    static async deleteModule(moduleID) {
        //delete all related data in module table prior to deleting the lecture content data
        return await knex('module').where('MODULE_ID', '=', moduleID).del();    
    }

    static async deleteLecture(lectureID) {
        //delete all related data in lecture table prior to deleting the lecture content data
        return await knex('lecture').where('LECTURE_ID', '=', lectureID).del();    
    }

    static deleteLectureContent(courseID, moduleID, lectureID, contentID) {
        try {
             //delete the actual lecture content data
            const result = knex('lecture_content').where("LECTURE_CONTENT_ID", "=", contentID).del();
            if (!result) throw new Error('Failed to delete lecture content'); //fail deletion lead to an error

            this.deleteLecture(lectureID);
            this.deleteModule(moduleID);
            this.deleteCourse(courseID);
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = LectureContent;
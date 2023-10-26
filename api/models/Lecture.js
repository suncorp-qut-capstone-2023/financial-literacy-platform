const knexOptions = require('../db/mydb-connection.js');
const Module = require("./Module");
const Course = require("./Course");
const knex = require("knex")(knexOptions);

class Lecture{
    static async getAllLectures(moduleID) {
        return await knex('lecture').select("*").where('module_id', '=', moduleID);
    }

    static async getLecture(courseID, moduleID, lectureID) {
        return await knex("lecture")
               .select('lecture.*')
               .innerJoin('module', 'lecture.MODULE_ID', '=', 'module.MODULE_ID')
               .innerJoin('course', 'module.COURSE_ID', '=', 'course.COURSE_ID')
               .where({
                   "lecture.LECTURE_ID": lectureID,
                   "module.MODULE_ID": moduleID,
                   "course.COURSE_ID": courseID
               });
    }
    
    
    static async createLecture(data) {
        return await knex('lecture').insert({
            LECTURE_NAME: data["LECTURE_NAME"],
            MODULE_ID: data["MODULE_ID"],
            LECTURE_ORDER: data["LECTURE_ORDER"]
        });
    }
    

    static async updateLecture(moduleID, lectureID, data) {
        return await knex('lecture')
               .update(data)
               .where("LECTURE_ID", "=", lectureID)
               .andWhere("MODULE_ID", "=", moduleID);
    }

    static async deleteLectureContent(lectureID) {
        //delete all related data in lecture content table prior to deleting the lecture data
        return await knex('lecture_content').where('LECTURE_ID', '=', lectureID).del();    
    }

    static async deleteLecture(lectureID) {
        try {
            this.deleteLectureContent(lectureID);

            //delete the actual lecture data
            const result = await knex('lecture').where("LECTURE_ID", "=", lectureID).del();
            if (!result) throw new Error('Failed to delete lecture'); //fail deletion lead to an error
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Lecture;
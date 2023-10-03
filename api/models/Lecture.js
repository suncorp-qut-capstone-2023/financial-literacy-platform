const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Lecture{
    static getAllLectures(courseID, moduleID) {
        return knex('lecture').select("*").where('module_id', '=', moduleID);
    }

    static getLecture(courseID, moduleID, lectureID) {
        return knex("lecture")
               .select('lecture.*')
               .innerJoin('module', 'lecture.MODULE_ID', '=', 'module.MODULE_ID')
               .innerJoin('course', 'module.COURSE_ID', '=', 'course.COURSE_ID')
               .where({
                   "lecture.LECTURE_ID": lectureID,
                   "module.MODULE_ID": moduleID,
                   "course.COURSE_ID": courseID
               });
    }
    
    
    static createLecture(data) {
        return knex('lecture').insert({
            LECTURE_NAME: data["LECTURE_NAME"],
            MODULE_ID: data["MODULE_ID"],
            LECTURE_ORDER: data["LECTURE_ORDER"]
        });
    }
    

    static updateLecture(set_data_type, value) {
        return knex('lecture').update({ [set_data_type]: value[0] }).where("LECTURE_ID", "=", value[1]);
    }

    static deleteLecture(value) {
        return knex('lecture').where("LECTURE_ID", "=", value).del();
    }
}

module.exports = Lecture;
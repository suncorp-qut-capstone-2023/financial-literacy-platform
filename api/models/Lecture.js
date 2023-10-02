const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Lecture{
    static getAllLectures(courseID, moduleID) {
        return knex('lecture').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID);
    }

    static getLecture(value) {
        return knex("lecture").select('*').where("LECTURE_ID", '=', value);
    }

    static createLecture(value) {
            return knex('lecture').insert({
            LECTURE_NAME: value[0],
            LECTURE_DESCRIPTION: value[1],
            LECTURE_CONTENT_ID: value[2],
            MODULE_ID: value[3]
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
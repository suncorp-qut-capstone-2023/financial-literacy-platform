const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class Course {
    static async getAllCourses() {

            //return all data from cloud
            try {
                let allData = {
                    course : [],
                    lecture: [],
                    material: [],
                    module: [],
                    quiz: [],
                    quiz_question: []
                }

                allData.course = await knex('course').select('*');
                allData.lecture = await knex('lecture').select('*');
                allData.material = await knex('material').select('*');
                allData.module = await knex('module').select('*');
                allData.quiz = await knex('quiz').select('*');
                allData.quiz_question = await knex('quiz_question').select('*');

                return allData;
            } catch (err) {
                throw err;
            }
    }

    static getCourse(value) {
        return knex("course").select('*').where("COURSE_ID", '=', value);
    }

    static createCourse(value) {
        return knex('course').insert(value);
    }

    static updateCourse(set_data_type, value) {
        return knex('course').update({ [set_data_type]: value[0] }).where("COURSE_ID", "=", value[1]);
    }

    static deleteCourse(value) {
        return knex('course').where("COURSE_ID", "=", value).del();
    }
}

module.exports = Course;
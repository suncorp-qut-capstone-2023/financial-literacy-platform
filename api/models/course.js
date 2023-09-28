// Initialize knex with the config file.
const knexOptions = require('../db/knexfile');
// const conn = require('../db/cloudConnect');
''
const knex = require("knex")(knexOptions);
const fs = require('fs');

// Change this to db connection for cloud
// const courses = require('../course-information.json');

// Expand this class to include all the functions that you need.
class Course {

    static getCourse(table, where_data_type, value) {
        try {
            return knex(table).select('*').where(where_data_type, '=', value);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }

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

    static async insertData(newCourseData, table) {
        return await knex(table).insert(newCourseData);
    }

    static updateCourse(set_data_type, value) {
        return knex('course').update({ [set_data_type]: value[0] }).where("COURSE_ID", "=", value[1]);
    }

    static updateLecture(set_data_type, value) {
        return knex('lecture').update({ [set_data_type]: value[0] }).where("LECTURE_ID", "=", value[1]);
    }

    static updateLectureContent(set_data_type, value) {
        return knex('lecture_content').update({ [set_data_type]: value[0] }).where("LECTURE_CONTENT_ID", "=", value[1]);
    }

    static updateMaterial(set_data_type, value) {
        return knex('material').update({ [set_data_type]: value[0] }).where("MATERIAL_ID", "=", value[1]);
    }

    static updateModule(set_data_type, value) {
        return knex('module').update({ [set_data_type]: value[0] }).where("MODULE_ID", "=", value[1]);
    }

    static updateQuiz(set_data_type, value) {
        return knex('quiz').update({ [set_data_type]: value[0] }).where("QUIZ_ID", "=", value[1]);
    }

    static updateQuizQuestion(set_data_type, value) {
        return knex('quiz_question').update({ [set_data_type]: value[0] }).where("QUESTION_ID", "=", value[1]);
    }

    static deleteCourse(value) {
        return knex('course').where("COURSE_ID", "=", value).del();
    }

    static deleteLecture(value) {
        return knex('lecture').where("LECTURE_ID", "=", value).del();
    }

    static deleteLectureContent(value) {
        return knex('lecture_content').where("LECTURE_CONTENT_ID", "=", value).del();
    }

    static deleteMaterial(value) {
        return knex('material').where("MATERIAL_ID", "=", value).del();
    }

    static deleteModule(value) {
        return knex('module').where("MODULE_ID", "=", value).del();
    }

    static deleteQuiz(value) {
        return knex('quiz').where("QUIZ_ID", "=", value).del();
    }

    static deleteQuizQuestion(value) {
        return knex('quiz_question').where("QUESTION_ID", "=", value).del();
    }
}

module.exports = Course;
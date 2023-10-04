// Initialize knex with the config file.
const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class Course {

    static getCourse(value) {
        return knex("course").select('*').where("COURSE_ID", '=', value);
    }

    static getLecture(value) {
        return knex("lecture").select('*').where("LECTURE_ID", '=', value);
    }
    
    static getLectureContent(value) {
        return knex("lecture_content").select('*').where("LECTURE_CONTENT_ID", '=', value);
    }

    static getMaterial(value) {
        return knex("material").select('*').where("MATERIAL_ID", '=', value);
    }

    static getModule(value) {
        return knex("module").select('*').where("MODULE_ID", '=', value);
    }

    static getQuiz(value) {
        return knex("quiz").select('*').where("QUIZ_ID", '=', value);
    }

    static getQuizQuestion(value) {
        return knex("quiz").select('*').where("QUESTION_ID", '=', value);
    }
    static async getAllCourses() {
        try {
            let allData = await knex('course').select('*');
    
            for(let course of allData) {
                // Fetch related modules for each course
                course.modules = await knex('module').select('*').where('COURSE_ID', course.COURSE_ID);
    
                for(let module of course.modules) {
                    // Fetch related quizzes for each module
                    module.quizzes = await knex('quiz').select('*').where('MODULE_ID', module.MODULE_ID);
    
                    for(let quiz of module.quizzes) {
                        // Fetch related quiz questions for each quiz
                        quiz.questions = await knex('quiz_question').select('*').where('QUIZ_ID', quiz.QUIZ_ID);
                    }
    
                    // Fetch related lectures for each module
                    module.lectures = await knex('lecture').select('*').where('MODULE_ID', module.MODULE_ID);
    
                    for(let lecture of module.lectures) {
                        // Fetch related lecture content for each lecture
                        lecture.contents = await knex('lecture_content').select('*').where('LECTURE_ID', lecture.LECTURE_ID);
    
                        for(let content of lecture.contents) {
                            // Fetch related materials for each lecture content
                            content.materials = await knex('material').select('*').where('MATERIAL_ID', content.MATERIAL_ID);
                        }
                    }
                }
            }
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
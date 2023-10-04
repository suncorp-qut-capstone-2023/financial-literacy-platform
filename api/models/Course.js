const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class Course {
    static async getAllCourses() {

            //return all data from cloud
            try {
                let allData = {
                    course : [],
                }

                allData.course = await knex('course').select('*');
                return allData;
            } catch (err) {
                throw err;
            }
    }

    static async getCourse(value) {
        try {
            let courseData = await knex('course').select('*').where('COURSE_ID', '=', value);
    
            if (courseData && courseData.length > 0) {
                let course = courseData[0];
    
                // Fetch related modules for the course
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
                return course;
            } else {
                return null;
            }
        } catch (err) {
            throw err;
        }
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
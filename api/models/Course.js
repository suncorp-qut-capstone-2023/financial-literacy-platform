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

    static async deleteQuizQuestion(courseID) {
        //delete all related data in quiz_question table prior to deleting the course data
        return await knex('quiz_question')
            .whereIn('QUIZ_ID', function() {
                this.select('QUIZ_ID')
                .from('quiz')
                .whereIn('MODULE_ID', function() {
                    this.select('MODULE_ID').from('module').where('COURSE_ID', "=", courseID);
                })
            })
            .del();        
    }

    static async deleteQuiz(courseID) {
        //delete all related data in quiz table prior to deleting the course data
        return await knex('quiz')
            .whereIn('MODULE_ID', function() {
                this.select('MODULE_ID').from('module').where('COURSE_ID', "=", courseID);
            })
            .del();     
    }

    static async deleteLectureContent(courseID) {
        //delete all related data in lecture_content table prior to deleting the course data
        return await knex('lecture_content')
            .whereIn('LECTURE_ID', function() {
                this.select('LECTURE_ID')
                .from('lecture')
                .whereIn('MODULE_ID', function() {
                    this.select('MODULE_ID').from('module').where('COURSE_ID', "=", courseID);
                })
            })
            .del(); 
    }

    static async deleteLecture(courseID) {
        //delete all related data in lecture table prior to deleting the course data
        return await knex('lecture')
            .whereIn('MODULE_ID', function() {
                this.select('MODULE_ID')
                .from('module')
                .where('COURSE_ID', "=", courseID)
            })
            .del();
    }

    static async deleteModule(courseID) {
        //delete all related data in module table prior to deleting the course data
        return await knex('module')
            .where('COURSE_ID', "=", courseID)
            .del()
    }

    static async deleteCourse(courseID) {
        try {
            this.deleteQuizQuestion(courseID);
            this.deleteQuiz(courseID);
            this.deleteLectureContent(courseID);
            this.deleteLecture(courseID);
            this.deleteModule(courseID);

            //delete the actual course data
            const result = await knex('course').where("COURSE_ID", "=", courseID).del();
            if (!result) throw new Error('Failed to delete course'); //fail deletion lead to an error

            return true;
        } catch (err) {
            console.error(err);
            return false;
        }


    }
}

module.exports = Course;
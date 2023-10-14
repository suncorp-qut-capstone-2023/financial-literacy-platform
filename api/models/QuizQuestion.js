const knexOptions = require('../db/mydb-connection.js');
const Module = require("./Module");
const Course = require("./Course");
const Quiz = require("./Quiz");
const knex = require("knex")(knexOptions);

class QuizQuestion {

    static getAllQuizQuestions(quizID) {
        return knex('quiz_question').select("*").where('QUIZ_ID', '=', quizID);
    }

    static getQuizQuestion(courseID, moduleID, quizID, questionID) {
        return knex("quiz_question")
            .select('quiz_question.*')
            .innerJoin('quiz', 'quiz_question.QUIZ_ID', '=', 'quiz.QUIZ_ID')
            .innerJoin('module', 'quiz.MODULE_ID', '=', 'module.MODULE_ID')
            .innerJoin('course', 'module.COURSE_ID', '=', 'course.COURSE_ID')
            .where({
                "quiz_question.QUESTION_ID": questionID,
                "quiz.QUIZ_ID": quizID,
                "module.MODULE_ID": moduleID,
                "course.COURSE_ID": courseID
            });
    }

    static createQuizQuestion(questionData) {
        return knex('quiz_question').insert(questionData);
    }

    static updateQuizQuestion(questionID, updateData) {
        return knex('quiz_question').update(updateData).where("QUESTION_ID", "=", questionID);
    }

    static async deleteCourse(courseID) {
        //delete all related data in course table prior to deleting the quiz question data
        return await knex('course').where('COURSE_ID', '=', courseID).del();    
    }

    static async deleteModule(moduleID) {
        //delete all related data in module table prior to deleting the quiz question data
        return await knex('module').where('MODULE_ID', '=', moduleID).del();    
    }

    static async deleteQuiz(quizID) {
        //delete all related data in quiz table prior to deleting the quiz question data
        return await knex('quiz').where('QUIZ_ID', '=', quizID).del();    
    }

    static deleteQuizQuestion(courseID, moduleID, quizID, questionID) {
        try {
            //delete the actual quiz data
            const result = knex('quiz_question').where("QUESTION_ID", "=", questionID).del();
            if (!result) throw new Error('Failed to delete quiz question'); //fail deletion lead to an error

            //find quiz data
            if (Quiz.getQuiz(courseID, moduleID, quizID) !== 0) {
                this.deleteQuiz(quizID);
            }

            //find module data
            if (Module.getModule(courseID, moduleID) !== 0) {
                this.deleteModule(moduleID);
            }
            
            //find course data
            if (Course.getCourse(courseID) !== null) {
                this.deleteCourse(courseID);
            }
   
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = QuizQuestion;
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

    static deleteQuizQuestion(questionID) {
        try {
            //delete the actual quiz data
            const result = knex('quiz_question').where("QUESTION_ID", "=", questionID).del();
            if (!result) throw new Error('Failed to delete quiz question'); //fail deletion lead to an error
   
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = QuizQuestion;

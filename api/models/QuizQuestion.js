const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class QuizQuestion{
    static getAllQuizQuestions(courseID, moduleID, quizID) {
        return knex('quiz_question').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID);
    }

    static getQuizQuestion(courseID, moduleID, quizID, questionID) {
            return knex('quiz_question').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).andWhere('question_id', '=', questionID);
    }

    static createQuizQuestion(courseID, moduleID, quizID, questionData) {
        return knex('quiz_question').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).insert(questionData);
    }
    
    static updateQuizQuestion(courseID, moduleID, quizID, questionID, questionData) {
        return knex('quiz_question').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).andWhere('question_id', '=', questionID).update(questionData);
    }

    static deleteQuizQuestion(courseID, moduleID, quizID, questionID) {
            return knex('quiz_question').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).andWhere('question_id', '=', questionID).del();
    }
}

module.exports = QuizQuestion;
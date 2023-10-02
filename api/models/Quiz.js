const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Quiz{

    static getAllQuizzes(courseID, moduleID) {
        return knex('modules').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID);
    }

    static getQuiz(courseID, moduleID, quizID) {
        return knex('modules').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID);
    }

    static createQuiz(courseID, moduleID, quizData) {
        return knex('modules').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).insert(quizData);
    }

    static updateQuiz(courseID, moduleID, quizID, quizData) {
        return knex('modules').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).update(quizData);
    }

    static deleteQuiz(courseID, moduleID, quizID) {
        return knex('modules').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('quiz_id', '=', quizID).del();
    }
}

module.exports = Quiz;
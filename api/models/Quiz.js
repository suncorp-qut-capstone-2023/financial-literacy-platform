const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Quiz {
    
    static async getAllQuizzes(moduleID) {
        return await knex('quiz').select("*").where('module_id', '=', moduleID);
    }

    static async getQuiz(courseID, moduleID, quizID) {
        return await knex("quiz")
               .select('quiz.*')
               .innerJoin('module', 'quiz.MODULE_ID', '=', 'module.MODULE_ID')
               .innerJoin('course', 'module.COURSE_ID', '=', 'course.COURSE_ID')
               .where({
                   "quiz.QUIZ_ID": quizID,
                   "module.MODULE_ID": moduleID,
                   "course.COURSE_ID": courseID
               });
    }
    
    static async createQuiz(data) {
        return await knex('quiz').insert({
            QUIZ_NAME: data["QUIZ_NAME"],
            MODULE_ID: data["MODULE_ID"],
            QUESTION_ORDER: JSON.stringify(data["QUESTION_ORDER"]),
            QUIZ_MAXTRIES: data["QUIZ_MAXTRIES"]
        });
    }
    

    static async updateQuiz(moduleID, quizID, data) {
        return await knex('quiz')
               .update(data)
               .where("QUIZ_ID", "=", quizID)
               .andWhere("MODULE_ID", "=", moduleID);
    }

    static async deleteQuizQuestion(quizID) {
        //delete all related data in quiz_question table prior to deleting the quiz data
        return await knex('quiz_question').where('QUIZ_ID', '=', quizID).del();    
    }

    static async deleteQuiz(quizID) {
        try {
            this.deleteQuizQuestion(quizID);

            //delete the actual quiz data
            const result = await knex('quiz').where("QUIZ_ID", "=", quizID).del();
            if (!result) throw new Error('Failed to delete quiz'); //fail deletion lead to an error
   
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Quiz;

const knexOptions = require('../db/mydb-connection');
const knex = require("knex")(knexOptions);

class Module {
    static getModule(courseID, moduleID) {
        return knex('module').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID);
    }

    static getAllModules(courseID) {
        return knex('module').select("*").where('course_id', '=', courseID);
    }

    static createModule(moduleData) {
        return knex('module').insert(moduleData);
    }

    static updateModule(courseID, moduleID, moduleData) {
        return knex('module')
            .where('COURSE_ID', '=', courseID)
            .andWhere('MODULE_ID', '=', moduleID)
            .update(moduleData);
    }
    
    static async deleteCourse(courseID) {
        //delete all related data in course table prior to deleting the module data
        return await knex('course').where('COURSE_ID', '=', courseID).del();    
    }

    static async deleteLecture(moduleID) {
        //delete all related data in lecture table prior to deleting the module data
        return await knex('lecture').where('MODULE_ID', '=', moduleID).del();    
    }

    static async deleteLectureContent(moduleID) {
        //delete all related data in lecture_content table prior to deleting the module data
        return await knex('lecture_content')
        .whereIn('LECTURE_ID', function() {
            this.select('LECTURE_ID')
            .from('lecture')
            .where('MODULE_ID', "=", moduleID)
        })
        .del(); 
    }

    static async deleteQuiz(moduleID) {
        //delete all related data in quiz table prior to deleting the module data
        return await knex('quiz').where('MODULE_ID', '=', moduleID).del();    
    }

    static async deleteQuizQuestion(moduleID) {
        //delete all related data in quiz_question table prior to deleting the module data
        return await knex('quiz_question')
        .whereIn('QUIZ_ID', function() {
            this.select('QUIZ_ID')
            .from('quiz')
            .where('MODULE_ID', "=", moduleID)
        })
        .del(); 
    }

    static async deleteModule(courseID, moduleID) {
        try {
            this.deleteLectureContent(moduleID);
            this.deleteLecture(moduleID);
            this.deleteQuizQuestion(moduleID);
            this.deleteQuiz(moduleID);

            //delete the actual module data
            const result = await knex('module').where('COURSE_ID', '=', courseID).andWhere('MODULE_ID', '=', moduleID).del();
            if (!result) throw new Error('Failed to delete module'); //fail deletion lead to an error

            this.deleteCourse(courseID);
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Module;
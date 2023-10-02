const knexOptions = require('../db/mydb-connection');
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class Module {
    static getModule(courseID, moduleID) {
        return knex('module').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID);
    }

    static getAllModules(courseID) {
        return knex('module').select("*").where('course_id', '=', courseID);
    }

    static createModule(courseID, moduleData) {
        return knex('module').where('course_id', '=', courseID).insert(moduleData);
    }

    static updateModule(courseID, moduleID, moduleData) {
        return knex('module').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).update(moduleData);
    }

    static deleteModule(courseID, moduleID) {
        return knex('module').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).del();
    }
}

module.exports = Module;
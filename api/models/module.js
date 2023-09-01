// Initialize knex with the config file.
const knexOptions = require('../db/knexfile');
const knex = require("knex")(knexOptions);
class Module {
    static getModule(courseID, moduleID) {
        return knex('modules').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID);
    }
    
    static getAllModules(courseID) {
        return knex('modules').select("*").where('course_id', '=', courseID);
    }

    static createModule(courseID, moduleData) {
        return knex('modules').where('course_id', '=', courseID).insert(moduleData);
    }

    static updateModule(courseID, moduleID, moduleData) {
        return knex('modules').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).update(moduleData);
    }

    static deleteModule(courseID, moduleID) {
        return knex('modules').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).del();
    }
}

module.exports = Module;
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
    

    static deleteModule(courseID, moduleID) {
        return knex('module').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).del();
    }
}

module.exports = Module;
const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Material{
    static getALLMaterial(courseID, moduleID, lectureID) {
        return knex('lecture_content_media').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('lecture_id', '=', lectureID);
    }

    static getMaterial(courseID, moduleID, lectureID, materialID) {
        return knex('lecture_content_media').select("*").where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('lecture_id', '=', lectureID).andWhere('material_id', '=', materialID);
    }

    static createMaterial(courseID, moduleID, lectureID, materialData) {
        return knex('lecture_content_media').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('lecture_id', '=', lectureID).insert(materialData);
    }

    static updateMaterial(courseID, moduleID, lectureID, materialID, materialData) {
        return knex('lecture_content_media').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('lecture_id', '=', lectureID).andWhere('material_id', '=', materialID).update(materialData);
    }

    static deleteMaterial(courseID, moduleID, lectureID, materialID) {
        return knex('lecture_content_media').where('course_id', '=', courseID).andWhere('module_id', '=', moduleID).andWhere('lecture_id', '=', lectureID).andWhere('material_id', '=', materialID).del();
    }
}

module.exports = Material;
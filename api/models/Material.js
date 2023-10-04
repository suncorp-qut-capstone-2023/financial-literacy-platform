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

    static async deleteLectureContent(materialID) {
        //delete all related data in lecture_content table prior to deleting the material data
        return await knex('lecture_content').where("MATERIAL_ID", "=", materialID).del();
    }

    static async deleteMaterial(materialID) {
        try {
            //delete the actual material data
            const result = await knex('material').where("MATERIAL_ID", "=", materialID).del();
            if (!result) throw new Error('Failed to delete material'); //fail deletion lead to an error

            this.deleteLectureContent(materialID);
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Material;
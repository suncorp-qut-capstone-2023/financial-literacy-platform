const knexOptions = require('../db/mydb-connection.js');
const LectureContent = require("./LectureContent");
const knex = require("knex")(knexOptions);

class Material{
    static getALLMaterial() {
        return knex('material').select();
    }

    static getMaterial(materialID) {
        return knex('material').select("*").where('MATERIAL_ID', '=', materialID);
    }

    static createMaterial(materialData) {
        return knex('material').insert(materialData);
    }

    static async updateMaterial(materialID, materialData) {
        try {
            //delete the actual material data
            const result = await knex('material').where('MATERIAL_ID', '=', materialID).update(materialData);
            if (!result) throw new Error('Failed to update material'); //fail deletion lead to an error
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }

    static async deleteLectureContent(materialID) {
        //delete all related data in lecture_content table prior to deleting the material data
        return await knex('lecture_content').where("MATERIAL_ID", "=", materialID).del();
    }

    static async deleteMaterial(courseID, moduleID, lectureID, contentID, materialID) {
        try {
            //delete the actual material data
            const result = await knex('material').where("MATERIAL_ID", "=", materialID).del();
            if (!result) throw new Error('Failed to delete material'); //fail deletion lead to an error

            //find lecture content data
            if (LectureContent.getLectureContent(courseID, moduleID, lectureID, contentID) !== 0) {
                this.deleteLectureContent(materialID);
            }
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Material;
const knexOptions = require('../db/mydb-connection.js');
const knex = require("knex")(knexOptions);

class Material{
    static async getALLMaterial() {
        return await knex('material').select("*");
    }

    static async getMaterial(materialID) {
        return await knex('material').select("*").where('MATERIAL_ID', '=', materialID);
    }

    static async createMaterial(materialData) {
        try {
            const result = await knex('material').insert(materialData);
            if (!result) throw new Error('Failed to create material'); //fail deletion lead to an error
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
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

    static async deleteMaterial(materialID) {
        try {
            //find lecture content data
            this.deleteLectureContent(materialID);

            //delete the actual material data
            const result = await knex('material').where("MATERIAL_ID", "=", materialID).del();
            if (!result) throw new Error('Failed to delete material'); //fail deletion lead to an error
            
            return true;
        } catch (err) {
            console.error(err);
            return false;
        }
    }
}

module.exports = Material;
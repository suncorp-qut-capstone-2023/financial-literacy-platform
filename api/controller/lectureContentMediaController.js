const Material = require("../models/Material");
const Course = require("../old-models/course");
const { isValidInt } = require("../utils/validation");

const getMaterial = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const material = await Course.getMaterial(ID);

        // return course
        return res.status(200).json(material);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createMaterial = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { material_name, material_url } = req.body;
    data = {};

    if (!material_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
        });
    } else {
        data["MATERIAL_NAME"] = material_name;
    }

    if (material_url) {
        data["MATERIAL_URL"] = material_url;
    }

    try {
        // create course in database
        await Course.insertData(data, "material");

        // return course
        return res.status(200).json({
            message: "new material data has been successfully added!"
        });
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }

        if (err.errno === 1406) {

            const data = err.sqlMessage.match(/'([^']+)'/);

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        }

        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const updateMaterial = async (req, res) => {
    //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
        });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await Course.updateMaterial(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'material' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const deleteMaterial = async (req, res) => {
    // get course id from params
    const materialID = isValidInt(req.query.materialID);

    if (!materialID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the materialID."
        });
    }

    try {

        const result = await Material.deleteMaterial(materialID);

        // return course
        if (result === true) {
            return res.status(200).json({"message": `data with the condition ID = ${materialID} on table 'material' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition ID = ${materialID} has not been found`
            });
        }

    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });
        }

        if (err.errno === 1451) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. The foreign key used with the related primary key has not been found."
            });
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
            });
        }

        if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        }

        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

module.exports = {
    getMaterial,
    createMaterial,
    updateMaterial,
    deleteMaterial
}
const Module = require("../models/Module");
const Course = require("../old-models/course");
const { isValidInt } = require("../utils/validation");

const getModule = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const module = await Course.getModule(ID);

        // return course
        return res.status(200).json(module);
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

const createModule = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { course_id, module_name, module_order } = req.body;
    data = {};

    if (!course_id || !module_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the module name and course ID."
        });
    } else {
        data["COURSE_ID"] = course_id;
        data["MODULE_NAME"] = module_name;
    }

    if (module_order) {
        data["MODULE_ORDER"] = module_order;
    }

    try {
        // create course in database
        await Course.insertData(data, "module");

        // return course
        return res.status(200).json({
            message: "new module data has been successfully added!"
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

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        }

        if (err.errno === 1406) {
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

const updateModule = async (req, res) => {
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

        const result = await Course.updateModule(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'module' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'module' table with condition COURSE_ID = ${value[1]} has not been found`
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

const deleteModule = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);

    try {

        const result = await Course.deleteModule(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'module' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'module' table with condition ID = ${newID} has not been found`
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
    getModule,
    createModule,
    updateModule,
    deleteModule
}
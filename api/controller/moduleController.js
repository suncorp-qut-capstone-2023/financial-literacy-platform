const Module = require("../models/Module");
// const Course = require("../models/course");
const { isValidInt } = require("../utils/validation");

const getModule = async (req, res) => {
    // get course id from params
    const ID = req.query.moduleID;
    const course = req.query.courseID

    try {
        // get course from database
        const module = await Module.getModule(course, ID);

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
            message: err.message
        });
    }
}

const createModule = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { course_id, module_name, module_order } = req.body;

    if (!course_id || !module_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the module name and course ID."
        });
    }

    // Construct the data based off input
    const data = {
        COURSE_ID: course_id,
        MODULE_NAME: module_name
    };

    if (module_order) {
        data["MODULE_ORDER"] = module_order;
    }

    try {
        await Module.createModule(data);

        return res.status(200).json({
            message: "New module data has been successfully added!"
        });
    } catch (err) {
        let errorMessage = "Internal server error";

        if (err.sqlMessage) {
            const matchedData = err.sqlMessage.match(/'([^']+)'/);

            switch (err.errno) {
                case 1452:
                    errorMessage = "foreign key constraint fails";
                    break;
                case 1264:
                    errorMessage = `${matchedData[0]} integer value is too large`;
                    break;
                case 1406:
                    errorMessage = `data too long for ${matchedData[0]}`;
                    break;
            }
        }
        
        return res.status(500).json({
            error: true,
            message: errorMessage
        });
    }
}


const updateModule = async (req, res) => {
    const moduleID = req.query.moduleID;
    const { course_id, module_name, module_order } = req.body;

    if (!moduleID || !course_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    const updateData = {};
    if (module_name) updateData["MODULE_NAME"] = module_name;
    if (module_order) updateData["MODULE_ORDER"] = module_order;

    try {
        const result = await Module.updateModule(course_id, moduleID, updateData);
        if (result > 0) {
            return res.status(200).json({ "message": `Module has been updated` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Module with MODULE_ID = ${moduleID} not found`
            });
        }
    } catch (err) {

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
            message: err.message
        });
    }
}

const deleteModule = async (req, res) => {
    const courseID = isValidInt(req.query.courseID);
    const moduleID = isValidInt(req.query.moduleID);

    if (!courseID || !moduleID) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify both courseID and moduleID in the query parameters."
        });
    }

    try {
        const result = await Module.deleteModule(courseID, moduleID);
        if (result > 0) {
            return res.status(200).json({ "message": `Module with ID = ${moduleID} in course with ID = ${courseID} has been deleted` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Module with ID = ${moduleID} in course with ID = ${courseID} not found`
            });
        }
    } catch (err) {
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
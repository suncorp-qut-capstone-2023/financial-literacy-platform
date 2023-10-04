const Lecture = require("../models/Lecture");
const Course = require("../old-models/course");
const { isValidInt } = require("../utils/validation");

const getLecture = async (req, res) => {
    const courseID = req.query.courseID;
    const moduleID = req.query.moduleID;
    const lectureID = req.query.lectureID;

    try {
        const lecture = await Lecture.getLecture(courseID, moduleID, lectureID);
        
        if (lecture && lecture.length > 0) {
            return res.status(200).json(lecture);
        } else {
            return res.status(404).json({ error: true, message: "Lecture not found." });
        }
    }
    catch (err) {
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}


const createLecture = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { lecture_name, module_id, material_order, lecture_order } = req.body;
    let data = {};

    if (!lecture_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
        });
    } else {
        data["LECTURE_NAME"] = lecture_name;
    }

    if (module_id) {
        data["MODULE_ID"] = module_id;
    }

    if (material_order) {
        data["MATERIAL_ORDER"] = material_order;
    }

    if (lecture_order) {
        data["LECTURE_ORDER"] = lecture_order;
    }

    try {
        // create course in database
        await Lecture.createLecture(data, "lecture");

        // return course
        return res.status(200).json({
            "message": "new lecture data has been successfully added!"
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
            message: err.message
        });
    }
}

const updateLecture = async (req, res) => {
    //update course table
    // get course id from url
    // get course id from params
    const lectureID = req.query.lectureID;
    const { lecture_name, module_id, lecture_order } = req.body;

    if (!lectureID || !module_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    const updateData = {};
    if (lecture_name) updateData["LECTURE_NAME"] = lecture_name;
    if (lecture_order) updateData["LECTURE_ORDER"] = lecture_order;

    try {
        const result = await Lecture.updateLecture(module_id, lectureID, updateData);
        if (result > 0) {
            return res.status(200).json({ "message": `Lecture has been updated` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Lecture with LECTURE_ID = ${lectureID} not found`
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

const deleteLecture = async (req, res) => {
    // get course id from params
    const ID = req.query.lectureID;

    //receive ID in integer type
    const newID = isValidInt(ID);

    try {

        const result = await Lecture.deleteLecture(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'lecture' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture' table with condition ID = ${newID} has not been found`
            });
        }

    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        let data = []
        if (err.sqlMessage)
        {
            data = err.sqlMessage.match(/'([^']+)'/);
        }
        

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
            message: err.message
        });
    }
}

module.exports = {
    getLecture,
    createLecture,
    updateLecture,
    deleteLecture
}
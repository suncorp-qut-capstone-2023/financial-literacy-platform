const Lecture = require("../models/Lecture");
// const Course = require("../old-models/course");
const { isValidInt } = require("../utils/validation");

const getLecture = async (req, res) => {
    let courseID;
    try {
        courseID = isValidInt(req.query.courseID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of courseID"
        });
    }

    let moduleID;
    try {
        moduleID = isValidInt(req.query.moduleID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of moduleID"
        });
    }
    
    let lectureID;
    try {
        lectureID = isValidInt(req.query.lectureID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of lectureID"
        });
    }

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
        } else {
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}


const createLecture = async (req, res) => {
    let moduleID;
    try {
        moduleID = isValidInt(req.query.moduleID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of moduleID"
        });
    }

    const { lecture_name, lecture_order } = req.body;
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

    if (moduleID) {
        data["MODULE_ID"] = moduleID;
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
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        } else if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        } else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const updateLecture = async (req, res) => {
    let lectureID;
    try {
        lectureID = isValidInt(req.query.lectureID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of lectureID"
        });
    }

    let moduleID;
    try {
        moduleID = isValidInt(req.query.moduleID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of moduleID"
        });
    }

    const { lecture_name, lecture_order } = req.body;

    if (!lectureID || !moduleID) {
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
        const result = await Lecture.updateLecture(moduleID, lectureID, updateData);
        if (result > 0) {
            return res.status(200).json({ "message": `Lecture has been updated` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Lecture with lectureID = ${lectureID} or moduleID not found`
            });
        }
    } catch (err) {
        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });
        } else if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });
        } else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const deleteLecture = async (req, res) => {
    // get course id from params
    let lectureID;
    try {
        lectureID = isValidInt(req.query.lectureID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of lectureID"
        });
    }

    if (!lectureID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the lectureID, courseID, and moduleID."
        });
    }

    try {

        const result = await Lecture.deleteLecture(lectureID);

        // return course
        if (result === true) {
            return res.status(200).json({"message": `data with the condition ID = ${lectureID} on table 'lecture' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture' table with condition ID = ${lectureID} has not been found`
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
        } else if (err.errno === 1451) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. The foreign key used with the related primary key has not been found."
            });
        } else if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        } else if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
            });
        } else if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

module.exports = {
    getLecture,
    createLecture,
    updateLecture,
    deleteLecture
}
const LectureContent = require('../models/LectureContent');
const { isValidInt } = require("../utils/validation");

const getLectureContent = async (req, res) => {
    // get course id from params
    const courseID = req.query.courseID;
    const moduleID = req.query.moduleID;
    const lectureID = req.query.lectureID;
    const lectureContentID = req.query.lectureContentID;

    try {
        // get course from database
        const lectureContent = await LectureContent.getLectureContent(courseID, moduleID, lectureID, lectureContentID);

        if (lectureContent && lectureContent.length > 0) {
            return res.status(200).json(lectureContent);
        } else {
            return res.status(404).json({ error: true, message: "Lecture Content not found." });
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

const createLectureContent = async (req, res) => {
    // Get lecture content information from request body
    // const { lecture_id, material_id, material_order } = req.body;

    const lecture_id = req.body.lecture_id;
    const material_id = req.body.material_id;
    const material_order = req.body.material_order;

    console.log(lecture_id, material_id, material_order);

    let data = {};
    
    if (!lecture_id || !material_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the lecture ID and material ID."
        });
    } else {
        data["LECTURE_ID"] = lecture_id;
        data["MATERIAL_ID"] = material_id;
    }

    if (material_order) {
        data["MATERIAL_ORDER"] = material_order;
    }

    try {
        // Create row in db
        await LectureContent.createLectureContent(data);
        return res.status(200).json({"message": "New lecture content data has been successfully added!"});
    }
    catch (err) {
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "Foreign key constraint fails. Ensure the referenced lecture or material exists."
            });
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large.`
            });
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `Data too long for ${data[0]}.`
            });
        }

        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}


const updateLectureContent = async (req, res) => {
    //update lecture content table
    const lectureContentID = req.query.contentID;
    const { lecture_id, material_id, material_order } = req.body;

    if (!lectureContentID || !lecture_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    const updateData = {};
    if (lecture_id) updateData["LECTURE_ID"] = lecture_id;
    if (material_id) updateData["MATERIAL_ID"] = material_id;
    if (material_order) updateData["MATERIAL_ORDER"] = material_order;

    try {
        const result = await LectureContent.updateLectureContent(lectureContentID, updateData);
        if (result > 0) {
            return res.status(200).json({ "message": `Lecture Content has been updated` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Lecture Content = ${lectureContentID} not found`
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

const deleteLectureContent = async (req, res) => {
    // get course id from params
    const ID = req.query.contentID;

    //receive ID in integer type
    const newID = isValidInt(ID);

    try {

        const result = await LectureContent.deleteLectureContent(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'lecture_content' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture_content' table with condition ID = ${newID} has not been found`
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
    getLectureContent,
    createLectureContent,
    updateLectureContent,
    deleteLectureContent
}
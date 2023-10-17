const Lecture = require('../models/Lecture');

const getAllLectures = async (req, res) => {
    const moduleID = req.query.moduleID;

    // Validate courseID and moduleID before making the database call.
    if (!Number.isInteger(Number(moduleID))) {
        return res.status(400).json({
            error: true,
            message: "Invalid courseID or moduleID."
        });
    }

    try {
        // get lectures from database
        const allLectures = await Lecture.getAllLectures(moduleID);

        // return lectures
        return res.status(200).json(allLectures);
    } catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
};

module.exports = {
    getAllLectures
}
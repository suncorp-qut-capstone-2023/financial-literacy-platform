const LectureContent = require('../models/LectureContent');

const getAllLectureContents = async (req, res) => {
    const courseID = req.query['courseID'];
    const moduleID = req.query['moduleID'];
    const lectureID = req.query['lectureID'];

    try {
        // get courses from database
        const all_lecture_contents = await LectureContent.getAllLectureContents(courseID, moduleID, lectureID);

        // return courses
        return res.status(200).json(all_lecture_contents);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

module.exports = {
    getAllLectureContents
}

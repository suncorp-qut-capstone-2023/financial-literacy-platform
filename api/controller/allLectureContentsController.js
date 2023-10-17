const LectureContent = require('../models/LectureContent');

const getAllLectureContents = async (req, res) => {
    const lectureID = req.query['lectureID'];

    console.log(lectureID);

    try {
        // get courses from database
        const all_lecture_contents = await LectureContent.getAllLectureContents(lectureID);
        // return courses
        return res.status(200).json(all_lecture_contents);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}

module.exports = {
    getAllLectureContents
}

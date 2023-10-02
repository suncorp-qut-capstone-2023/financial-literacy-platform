const Quiz = require('../models/Quiz');

const getAllQuizzes = async (req, res) => {
    const courseID = req.query['courseID'];
    const moduleID = req.query['moduleID'];

    try {
        // get courses from database
        const all_quizzes = await Quiz.getAllQuizzes(courseID, moduleID);

        // return courses
        return res.status(200).json(all_quizzes);
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
    getAllQuizzes
}
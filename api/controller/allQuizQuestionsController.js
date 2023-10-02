const QuizQuestion = require('../models/QuizQuestion');

const getAllQuizQuestions = async (req, res) => {
    const quizID = req.query['quizID'];

    try {
        // get courses from database
        const all_quiz_questions = await QuizQuestion.getAllQuizQuestions(quizID);

        // return courses
        return res.status(200).json(all_quiz_questions);
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
    getAllQuizQuestions
}
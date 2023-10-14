const QuizQuestion = require('../models/QuizQuestion');
const { isValidInt } = require("../utils/validation");

const getQuizQuestion = async (req, res) => {
    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

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

    let questionID;
    try {
        questionID = isValidInt(req.query.questionID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of questionID"
        });
    }

    try {
        const quizQuestions = await QuizQuestion.getQuizQuestion(courseID, moduleID, quizID, questionID);

        if (quizQuestions && quizQuestions.length > 0) {
            return res.status(200).json(quizQuestions);
        } else {
            return res.status(404).json({ error: true, message: "Quiz Question not found." });
        }
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}


const createQuizQuestion = async (req, res) => {
    //TODO: update quiz ID as a query and not body on swagger!
    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

    const { question_text, question_option, question_answer, question_order } = req.body;

    if (!question_text || !question_option) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    let data = {
        QUESTION_TEXT: question_text,
        QUESTION_OPTION: JSON.stringify(question_option),
        QUESTION_ANSWER: question_answer,
        QUIZ_ID: quizID,
        QUESTION_ORDER: question_order
    };

    try {
        await QuizQuestion.createQuizQuestion(data);
        return res.status(200).json({"message": "New quiz question data has been successfully added!"});
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}

const updateQuizQuestion = async (req, res) => {
    let quizQuestionID;
    try {
        quizQuestionID = isValidInt(req.query.questionID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of questionID"
        });
    }

    //TODO: update quiz ID as a query and not body on swagger!
    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

    const { question_text, question_option, question_answer, question_order } = req.body;

    if (!quizQuestionID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    let updateData = {};
    if (question_text) updateData["QUESTION_TEXT"] = question_text;
    if (question_option) updateData["QUESTION_OPTION"] = JSON.stringify(question_option);
    if (question_answer) updateData["QUESTION_ANSWER"] = question_answer;
    if (quizID) updateData["QUIZ_ID"] = quizID;
    if (question_order) updateData["QUESTION_ORDER"] = question_order;

    try {
        const result = await QuizQuestion.updateQuizQuestion(quizQuestionID, updateData);
        if (result > 0) {
            return res.status(200).json({"message": `Quiz Question has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message: `Quiz Question = ${quizQuestionID} not found`
            });
        }
    }
    catch (err) {
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}

const deleteQuizQuestion = async (req, res) => {
    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

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

    let quizQuestionID;
    try {
        quizQuestionID = isValidInt(req.query.quizQuestionID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizQuestionID"
        });
    }
 
    if (!quizID || !courseID || ! moduleID || !quizQuestionID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the quizID, courseID, moduleID, and quizQuestionID."
        });
    }

    try {
        const result = await QuizQuestion.deleteQuizQuestion(courseID, moduleID, quizID, quizQuestionID);
        if (result > 0) {
            return res.status(200).json({"message": `Quiz Question with ID = ${quizQuestionID} has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message: `Quiz Question = ${quizQuestionID} not found`
            });
        }
    }
    catch (err) {

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
        } else {
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

module.exports = {
    getQuizQuestion,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion
}

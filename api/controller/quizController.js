const Quiz = require("../models/Quiz");
const { isValidInt } = require("../utils/validation");

const getQuiz = async (req, res) => {
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

    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

    try {
        const quiz = await Quiz.getQuiz(courseID, moduleID, quizID);

        if (quiz && quiz.length > 0) {
            return res.status(200).json(quiz);
        } else {
            return res.status(404).json({ error: true, message: "Quiz not found." });
        }
    } catch (err) {
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

const createQuiz = async (req, res) => {
    const { quiz_name, module_id, question_order, quiz_maxtries } = req.body;
    let data = {};

    if (!quiz_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the quiz name."
        });
    } else {
        data["QUIZ_NAME"] = quiz_name;
    }

    if (module_id) {
        data["MODULE_ID"] = module_id;
    }

    if (question_order) {
        data["QUESTION_ORDER"] = question_order;
    }

    if (quiz_maxtries) {
        data["QUIZ_MAXTRIES"] = quiz_maxtries;
    }

    try {
        await Quiz.createQuiz(data);
        return res.status(200).json({
            "message": "New quiz data has been successfully added!"
        });
    } catch (err) {
        const data = err.sqlMessage.match(/'([^']+)'/);

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
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const updateQuiz = async (req, res) => {
    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

    //TODO: update module ID as a query and not body on swagger!
    let moduleID;
    try {
        moduleID = isValidInt(req.query.moduleID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of moduleID"
        });
    }

    const { quiz_name, question_order, quiz_maxtries } = req.body;

    if (!quizID || !moduleID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the required parameters."
        });
    }

    const updateData = {};
    if (quiz_name) updateData["QUIZ_NAME"] = quiz_name;
    if (question_order) updateData["QUESTION_ORDER"] = JSON.stringify(question_order);
    if (quiz_maxtries) updateData["QUIZ_MAXTRIES"] = quiz_maxtries;

    try {
        const result = await Quiz.updateQuiz(moduleID, quizID, updateData);
        if (result > 0) {
            return res.status(200).json({ "message": `Quiz has been updated` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Quiz with QUIZ_ID = ${quizID} not found`
            });
        }
    } catch (err) {
        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column ${data[0]}`
            });
        } else {
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const deleteQuiz = async (req, res) => {
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

    let quizID;
    try {
        quizID = isValidInt(req.query.quizID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of quizID"
        });
    }

    if (!quizID || !courseID || ! moduleID) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the quizID, courseID, and moduleID."
        });
    }

    try {
        const result = await Quiz.deleteQuiz(courseID, moduleID, quizID);
        if (result === true) {
            return res.status(200).json({ "message": `Quiz with QUIZ_ID = ${quizID} has been deleted` });
        } else {
            return res.status(400).json({
                error: true,
                message: `Quiz with QUIZ_ID = ${quizID} not found`
            });
        }
    } catch (err) {

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
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
}

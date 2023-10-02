const QuizQuestion = require('../models/QuizQuestion');
const Course = require("../old-models/course");
const { isValidInt } = require("../utils/validation");

const getQuizQuestion = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const quizQuestions = await Course.getQuizQuestion(ID);

        // return course
        return res.status(200).json(quizQuestions);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createQuizQuestion = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { question_text, question_option, question_answer, quiz_id, question_order } = req.body;
    let data = {};

    if (question_text) {
        data["QUESTION_TEXT"] = question_text;
    }

    if (question_option) {
        //newValue.push('"A": ' + question_option.A + ', "B": ' + question_option.B + ', "C": ' + question_option.C + ', "D": ' + question_option.D);
        //newValue.push('{"A": "aku mao", "B": "aku tidak mao", "C": "aku suka", "D": "aku panik"}');
        if ((question_option.A === undefined && question_option.B === undefined && question_option.C === undefined && question_option.D === undefined) ||
            (question_option.A === undefined && question_option.B === undefined && question_option.C === undefined) ||
            (question_option.A === undefined && question_option.B === undefined && question_option.D === undefined) ||
            (question_option.A === undefined && question_option.C === undefined && question_option.D === undefined) ||
            (question_option.B === undefined && question_option.C === undefined && question_option.D === undefined)) {
            return res.status(500).json({
                error: true,
                message: "There must be at least 2 question answer options"
            });
        } else {
            // let available_options = `{`;
            // if (question_option.A !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"A": "${question_option.A}"`
            // } else if (question_option.B !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"B": "${question_option.B}"`
            // } else if (question_option.C !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"C": "${question_option.C}"`
            // } else if (question_option.D !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"D": "${question_option.D}"`
            // }

            //==========================================================

            // if (question_option.C === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}}`;
            // } else if (question_option.B === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "C": "${question_option.C}}`;
            // }  else if (question_option.B === undefined && question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "D": "${question_option.D}}`;
            // }  else if (question_option.A === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "C": "${question_option.C}}`;
            // }  else if (question_option.A === undefined && question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "D": "${question_option.D}}`;
            // }  else if (question_option.A === undefined && question_option.B === undefined) {
            //     data["QUESTION_OPTION"] = `{"C": "${question_option.C}", "D": "${question_option.D}}`;
            // } else if (question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}, "C": "${question_option.C}}`;
            // } else if (question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}, "D": "${question_option.D}}`;
            // } else if (question_option.B === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "C": "${question_option.C}, "D": "${question_option.D}}`;
            // } else if (question_option.A === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "C": "${question_option.C}, "D": "${question_option.D}}`;
            // } else {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`;
            // }
            //==========================================================

            const question_options = `{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`;

            data["QUESTION_OPTION"] = question_options;
        }

    }

    if (question_answer) {
        data["QUESTION_ANSWER"] = question_answer;
    }

    if (quiz_id) {
        data["QUIZ_ID"] = quiz_id;
    }

    if (question_order) {
        data["QUESTION_ORDER"] = question_order;
    }

    try {
        // create course in database
        await Course.insertData(data, "quiz_question");

        // return course
        return res.status(200).json({
            message: "new quiz question data has been successfully added!"
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

        return res.status(500).json({
            error: true,
            message: err
        });

    }
}

const updateQuizQuestion = async (req, res) => {
    //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
        });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await Course.updateQuizQuestion(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'quiz_question' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz_question' table with condition COURSE_ID = ${value[1]} has not been found`
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

const deleteQuizQuestion = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);

    try {

        const result = await Course.deleteQuizQuestion(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'quiz_question' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz_question' table with condition ID = ${newID} has not been found`
            });
        }

    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

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
            message: err
        });
    }
}

module.exports = {
    getQuizQuestion,
    createQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion
}
const Quiz = require("../models/Quiz");
const Course = require("../old-models/Course");
const { isValidInt } = require("../utils/validation");

const getQuiz = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const quiz = await Course.getQuiz(ID);

        // return course
        return res.status(200).json(quiz);
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

const createQuiz = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { quiz_name, quiz_blob_url, module_id, question_order, quiz_maxtries } = req.body;
    let data = {};

    if (!quiz_name || !quiz_blob_url) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the quiz name and quiz blob URL."
        });
    } else {
        data["QUIZ_NAME"] = quiz_name;
        data["QUIZ_BLOB_URL"] = quiz_blob_url;
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
        // create course in database
        await Course.insertData(data, "quiz");

        // return course
        return res.status(200).json({
            message: "new quiz data has been successfully added!"
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

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateQuiz = async (req, res) => {
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

        const result = await Course.updateQuiz(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'quiz' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz' table with condition COURSE_ID = ${value[1]} has not been found`
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

const deleteQuiz = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);

    try {

        const result = await Course.deleteQuiz(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'quiz' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz' table with condition ID = ${newID} has not been found`
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
    getQuiz,
    createQuiz,
    updateQuiz,
    deleteQuiz
}
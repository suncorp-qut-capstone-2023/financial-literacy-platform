const Course = require("../models/Course");
const { isValidInt } = require("../utils/validation");

const getCourse = async (req, res) => {
    // get course id from params
    let courseID;
    try {
        courseID = isValidInt(req.query.courseID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of courseID"
        });
    }

    try {
        // get course from database
        const course = await Course.getCourse(courseID);

        // return course
        return res.status(200).json(course);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const createCourse = async (req, res) => {
    const { course_name, category_type } = req.body;
    let data = {}

    if (!course_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
        });
    } else {
        data["COURSE_NAME"] = course_name;
    }

    // Get the current date and time
    const currentDateTime = new Date();

    // Convert the current date and time to a string
    data["COURSE_LASTUPDATED"] = currentDateTime.getFullYear() +
        '-' +
        String(currentDateTime.getMonth() + 1).padStart(2, '0') +
        '-' +
        String(currentDateTime.getDate()).padStart(2, '0') +
        ' ' +
        String(currentDateTime.getHours()).padStart(2, '0') +
        ':' +
        String(currentDateTime.getMinutes()).padStart(2, '0') +
        ':' +
        String(currentDateTime.getSeconds()).padStart(2, '0');

    //if category_type is provided
    if (category_type) {
        data["CATEGORY_TYPE"] = category_type;
    }

    try {
        // create course in database
        await Course.createCourse(data, "course");

        // return course
        return res.status(200).json({"message": "new course data has been successfully added!"});
    }
    catch (err) {
        let data;
    
        if (err.sqlMessage) {
            data = err.sqlMessage.match(/'([^']+)'/);
        }

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });
        } else if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `Incorrect datetime value: ${data[0]}`
            });
        } else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const updateCourse = async (req, res) => {
    //update course table
    // get course id from url
    // get course id from params
    let courseID;
    try {
        courseID = isValidInt(req.query.courseID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of courseID"
        });
    }
    
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type
        || !setValue || !courseID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
        });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(courseID);

    const value = [ setValue, courseID ];

    try {

        const result = await Course.updateCourse(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'course' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'course' table with condition COURSE_ID = ${value[1]} has not been found`
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
        } else if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });
        } else if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });
        } else {
            // return error
            return res.status(500).json({
                error: true,
                message: err.message
            });            
        }
    }
}

const deleteCourse = async (req, res) => {
    // get course id from params
    let courseID;
    try {
        courseID = isValidInt(req.query.courseID);
    } catch (err) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the correct data type of courseID"
        });
    }
    

    if ( !courseID ) {
        return res.status(400).json({
            error: true,
            message: "Bad request. Please specify the courseID"
        });
    }

    try {

        const result = await Course.deleteCourse(courseID);

        // return course
        if (result === true) {
            return res.status(200).json({"message": `data with the condition ID = ${courseID} on table 'course' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'course' table with condition ID = ${courseID} has not been found`
            });
        }

    }
    catch (err) {
        console.log(err);
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

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
        } else if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });
        } else if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
            });
        } else if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });
        } else {
            return res.status(500).json({
                error: true,
                message: err
            });            
        }
    }
}

module.exports = {
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
}
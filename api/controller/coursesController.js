// The controller of the course routes
const courses = require('../models/course');
const modules = require('../models/module');
const quizzes = require('../models/quiz');
const constants  = require("../utils/constants");

// TODO: Not each function is working yet, need to fix the database first
/**
 * Gets all the courses from a Database table
 * 
 * @param {*} req request
 * @param {*} res response
 * @returns a JSON object
 */
const getAllCourses = async (req, res) => {
    try {
        // get courses from database
        const all_courses = await courses.getAllCourses();

        // return courses
        return res.status(200).json(all_courses);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}


/**
 * Gets a specific course from a Database table
 * 
 * @param {*} req request
 * @param {*} res response
 * @returns A JSON object
 */
const getCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    try {
        // get course from database
        const course = await courses.getCourse(courseID);

        // return course
        return res.status(200).json(course);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

/**
 * Create a course in Database
 * 
 * @param {*} req request
 * @param {*} res response
 * @returns JSON object
 */
const createCourse = async (req, res) => {
    // get course information from request body
    const course = req.body;

    try {
        // create course in database
        const createdCourse = await courses.createCourse(course);

        // return course
        return res.status(200).json(createdCourse);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

/**
 * Permanently deletes a course in Database
 * 
 * @param {*} req request
 * @param {*} res response
 * @returns a JSON object
 */

const deleteCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    try {
        // delete course from database
        const deletedCourse = await courses.deleteCourse(courseID);

        // return course
        return res.status(200).json(deletedCourse);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

/**
 * Updates a course in the Database, requires to insert info in body
 * 
 * @param {*} req request
 * @param {*} res response
 * @returns A JSON object
 */

const updateCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get course information from request body
    const course = req.body;

    // TODO(Geoffrey): Test
    if (!course) {
        return res.json({
            error:true,
            message:constants.errorMessages.missingInformation
        })
    }

    try {
        // update course in database
        const updatedCourse = await courses.updateCourse(courseID, course);

        // return course
        return res.status(200).json(updatedCourse);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

const getModule = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get module id from url
    const moduleID = req.params['moduleID'];

    try {
        // get module from database
        const module = await courses.getModule(courseID, moduleID);

        // return module
        return res.status(200).json(module);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

const getQuiz = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get module id from url
    const moduleID = req.params['moduleID'];

    // get quiz id from url
    const quizID = req.params['quizID'];

    // TODO(Geoffrey): Decide if we want to pass into body instead. Here is a template
    if (!courseID || moduleID || quizID) {
        return res.status(400).json({
            error:true,
            message: constants.errorMessages.missingInformation
        })
    }

    try {
        // get quiz from database
        const quiz = await courses.getQuiz(courseID, moduleID, quizID);

        // return quiz
        return res.status(200).json(quiz);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: constants.errorMessages.serverError
        });
    }
}

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    deleteCourse,
    updateCourse,
    getModule,
    getQuiz
}
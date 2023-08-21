const courses = require('../models/course');
const modules = require('../models/module');
const quizzes = require('../models/quiz');


// TODO: Not each function is working yet, need to fix the database first

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
            message: "Internal server error"
        });
    }
}

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
            message: "Internal server error"
        });
    }
}

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
            message: "Internal server error"
        });
    }
}

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
            message: "Internal server error"
        });
    }
}

const updateCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get course information from request body
    const course = req.body;

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
            message: "Internal server error"
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
            message: "Internal server error"
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
            message: "Internal server error"
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
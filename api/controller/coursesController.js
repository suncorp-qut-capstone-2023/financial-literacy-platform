const courses = require('../models/courses');

const getAllCourses = async (req, res) => {
    try {
        // get courses from database
        const courses = await courses.getAllCourses();

        // return courses
        return res.status(200).json(courses);
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
    getModule,
    getQuiz
}
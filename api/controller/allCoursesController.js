const Course = require('../models/Course');

const getAllCourses = async (req, res) => {
    try {
        // get Course from database
        const all_courses = await Course.getAllCourses();

        // return Course
        return res.status(200).json(all_courses);
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
    getAllCourses
}
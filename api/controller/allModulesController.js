const Module = require('../models/Module.js');

const getAllModules = async (req, res) => {
    const courseID = req.query.courseID;

    try {
        // get courses from database
        const all_courses = await Module.getAllModules(courseID);

        // return courses
        return res.status(200).json(all_courses);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: err.message
        });
    }
}

module.exports = {
    getAllModules
}
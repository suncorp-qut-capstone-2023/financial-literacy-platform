// Initialize knex with the config file.
const knexOptions = require('../db/knexfile');
const knex = require("knex")(knexOptions);

// Change this to db connection for cloud
const courses = require('../course-information.json');

// Expand this class to include all the functions that you need.
class Course {
    static getCourse(courseID) {
        return knex('modules').select("*").where('course_id', '=', courseID);
    }

    static getAllCourses() {
        // return knex('modules').select("*");
        return courses.available_courses;
    }

    static createCourse(courseData) {
        return knex('modules').insert(courseData);
    }

    static updateCourse(courseID, courseData) {
        return knex('modules').where('course_id', '=', courseID).update(courseData);
    }

    static deleteCourse(courseID) {
        return knex('modules').where('course_id', '=', courseID).del();
    }
}

module.exports = Course;
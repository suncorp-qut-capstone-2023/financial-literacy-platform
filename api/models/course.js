const knexOptions = require('../db/knexfile');
const knex = require("knex")(knexOptions);
const courses = require('../course-information.json');

class Courses {

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

    static getCourse(courseID) {
        return knex('modules').select("*").where('course_id', '=', courseID);
    }
}

module.exports = Courses;
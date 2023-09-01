// Initialize knex with the config file.
const knexOptions = require("../db/knexfile");
const knex = require("knex")(knexOptions);

// TODO: Change this to db connection for cloud

class Course {
  static getCourse(courseID) {
    return knex("modules").select("*").where("course_id", "=", courseID);
  }

  static getAllCourses() {
    return course.available_courses;
  }

  static createCourse(courseData) {
    return knex("modules").insert(courseData);
  }

  static updateCourse(courseID, courseData) {
    return knex("modules").where("course_id", "=", courseID).update(courseData);
  }

  static deleteCourse(courseID) {
    return knex("modules").where("course_id", "=", courseID).del();
  }
}

module.exports = Course;

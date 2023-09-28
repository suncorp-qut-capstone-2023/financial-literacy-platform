// Initialize knex with the config file.
const knexOptions = require("../db/knexfile");
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class Enrolment {
  static enrol(enrolmentData) {
    return knex("course_registration").insert(enrolmentData);
  }

  static checkenrol(userId, courseId) {
    return knex("course_registration")
      .where({
        user_id: userId,
        course_id: courseId,
      })
      .select("registration_id")
      .then((rows) => {
        if (rows.length > 0) {
          return true;
        } else {
          return false;
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  }


  static addQuizAttempt(attemptData) {
    return knex("quizzes_attempted").insert(attemptData);
  }

  
}

module.exports = Enrolment;

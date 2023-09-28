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

  static async findRegistration(userId, courseId) {
    return knex('course_registration')
      .where({
        user_id: userId,
        course_id: courseId
      })
      .first();
  }

  static async countTotalQuizzes(courseId) {
    return knex('quiz')
      .join('module', 'quiz.MODULE_ID', 'module.MODULE_ID')
      .where('module.COURSE_ID', courseId)
      .countDistinct('quiz.QUIZ_ID as total');
  }

  static async countAttemptedQuizzes(registrationId) {
    return knex('quizzes_attempted')
      .where('registration_id', registrationId)
      .countDistinct('quiz_id as total');
  }

  static async markCourseCompleted(registrationId) {
    return knex('course_registration')
      .where('registration_id', registrationId)
      .update({
        completed: true,
        completion_date: new Date().toISOString()
      });
  }

  static async markCourseCompleted(registrationId) {
    const currentDate = new Date();
    const expirationDate = new Date(currentDate);
    expirationDate.setFullYear(expirationDate.getFullYear() + 1);  // Set the date to one year in the future
  
    return knex('course_registration')
      .where('registration_id', registrationId)
      .update({
        completed: true,
        completion_date: currentDate.toISOString(),
        expiration_date: expirationDate.toISOString()
      });
  }


}

module.exports = Enrolment;

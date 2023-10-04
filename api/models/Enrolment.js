// Initialize knex with the config file.
const knexOptions = require('../db/mydb-connection');
const knex = require("knex")(knexOptions);

class Enrolment {

    static registerCourse(enrolmentData) {
        return knex('course_registration').insert(enrolmentData).then(ids => {
            return ids[0]
        }).catch(error => {
            console.error("Error inserting into Enrolment:", error);
            throw error;
        });
    }

    static checkEnrolment(userId, courseId) {
        return knex('course_registration').where({ user_id: userId, course_id: courseId }).first();
    }

}

module.exports = Enrolment;
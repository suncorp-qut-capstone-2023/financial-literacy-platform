// Initialize knex with the config file.
const knexOptions = require('../db/userdb-connection');
const knex = require("knex")(knexOptions);

// Expand this class to include all the functions that you need.
class User {
    static create(userData){
        return knex('users')
            .insert(userData);
    }

    static update(id, userData){
        return knex('users')
            .where('id', '=', id).update(userData);
    }

    static delete(id){
        return knex('users')
            .where('id', '=', id)
            .del();
    }

    static getById(id){
        return knex('users')
            .select("*")
            .where('id', '=', id);
    }

    static getByEmail(email){
        return knex('users')
            .select("*")
            .where('email', '=', email);
    }

    static getInterestsFromDB(userId) {
        const interests = [];
        return knex('users')
            .select('interests')
            .where('id', '=', userId)
            .first()
            .then(result => {
                return result ? result.interests : null;
            });
    }

    static updateInterestsInDB(userId, serializedInterests) {
        return knex('users')
            .where('id', '=', userId)
            .update({ interests: serializedInterests });
    }

}

module.exports = User;
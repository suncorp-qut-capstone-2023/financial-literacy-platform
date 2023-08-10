const knexOptions = require('../db/knexfile');
const knex = require("knex")(knexOptions);

class User {
    static create(userData){
        return knex('users').insert(userData);
    }

    static update(id, userData){
        return knex('users').where('id', '=', id).update(userData);
    }

    static delete(id){
        return knex('users').where('id', '=', id).del();
    }

    static getById(id){
        return knex('users').select("*").where('id', '=', id);
    }

    static getByEmail(email){
        return knex('users').select("*").where('email', '=', email);
    }

}

module.exports = User;
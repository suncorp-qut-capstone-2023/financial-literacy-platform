/**
 * This file is for setting up connection to database
 *
 * It uses Knex which is a secure SQL query builder. It has built in functions to
 * avoid sql injections.
 */

// TODO(): Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'mysql2',
    connection : {
        host:'localhost',
        port: 3306,
        database: 'jcmg',
        user:'root',
        password: 'your-sql-password-here',
        dateStrings: true
    }
};

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
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT,
        database: process.env.SQL_DATABASE,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        dateStrings: true
    }
};
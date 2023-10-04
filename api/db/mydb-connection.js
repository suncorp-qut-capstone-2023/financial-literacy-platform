/**
 * This file is for setting up connection to Course database
 *
 * It uses Knex which is a secure SQL query builder. It has built in functions to
 * avoid sql injections.
 */

const fs = require('fs');
const cert = fs.readFileSync("./certs/DigiCertGlobalRootCA.crt.pem");

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
    client: 'mysql2',
    connection : {
        host: process.env.SQL_HOST,
        port: process.env.SQL_PORT,
        database: process.env.SQL_DATABASE_COURSE,
        user: process.env.SQL_USER,
        password: process.env.SQL_PASSWORD,
        dateStrings: true,
        ssl: {
            ca: cert
        }
    }
};
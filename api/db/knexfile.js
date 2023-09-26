/**
 * This file is for setting up connection to database
 *
 * It uses Knex which is a secure SQL query builder. It has built in functions to
 * avoid sql injections.
 */

// TODO(): Update with your config settings.
const fs = require('fs');

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
        dateStrings: true,
        ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
    }
};

// module.exports = {
//     development: {
//         client: 'mssql',
//         connection: {
//             host: 'your_azure_sql_server_name.database.windows.net',
//             user: 'your_username',
//             password: 'your_password',
//             database: 'your_database_name',
//             options: {
//                 encrypt: true
//             }
//         },
//         pool: {
//             min: 2,
//             max: 10
//         },
//         migrations: {
//             tableName: 'knex_migrations'
//         }
//     }
// };

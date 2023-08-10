module.exports = {
    database: process.env.SQL_DATABASE,
    username: process.env.SQL_USER,
    password: process.env.SQL_PASSWORD,
    host: process.env.SQL_HOST,
    port: process.env.SQL_PORT,
    dialect: 'mysql', //'mssql',
    dialectOptions: {
        options: {
            encrypt: true
        }
    }
};


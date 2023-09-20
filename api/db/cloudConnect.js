const mysql = require('mysql2');
const fs = require('fs');

//db connection for cloud
var config =
{
    host: 'jcmg-api.mysql.database.azure.com',
    user: 'jcmg',
    password: 'T%%v6AYO890UYyqWgM2#',
    database: 'mydb',
    port: 3306,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
};

const conn = new mysql.createConnection(config);

conn.connect(
    function (err) { 
        if (err) { 
            console.log("!!! Cannot connect !!! Error:");
            throw err;
        }
        else {
            console.log("Connection established.");
        }
    }
);

module.exports = conn;
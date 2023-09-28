// const mysql = require('mysql2');
// const fs = require('fs');

// //db connection for cloud
// var config =
// {
//     host: 'jcmg-api.mysql.database.azure.com',
//     user: 'jcmg',
//     password: 'MNe7W^!oS3^82UGz2pTB*km6E',
//     database: 'mydb',
//     port: 3306,
//     ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
// };

// const conn = new mysql.createConnection(config);

// conn.connect(
//     function (err) { 
//         if (err) { 
//             console.log("!!! Cannot connect !!! Error:");
//             throw err;
//         }
//         else {
//             console.log("Connection established.");
//         }
//     }
// );

// module.exports = conn;
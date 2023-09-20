// Initialize knex with the config file.
const knexOptions = require('../db/knexfile');
const conn = require('../db/cloudConnect');
const knex = require("knex")(knexOptions);
const fs = require('fs');

// Change this to db connection for cloud
const courses = require('../course-information.json');

function queryData(sql) {
    return new Promise((resolve, reject) => {
        conn.query(sql, (err, results, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
          });
        });
}

function insertQueryData(sql, value) {
    return new Promise((resolve, reject) => {
        conn.query(sql, value, (err, results, fields) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(results);
            }
          });
        });
}

function readData() {

    return new Promise(async (resolve, reject) => {
        try {
            let allData = {
                course : [],
                lecture: [],
                material: [],
                module: [],
                quiz: [],
                quiz_question: []
            }

            allData.course = await queryData('SELECT * FROM course');
            allData.material = await queryData('SELECT * FROM material');
            allData.module = await queryData('SELECT * FROM module');
            allData.quiz = await queryData('SELECT * FROM quiz');
            allData.quiz_question = await queryData('SELECT * FROM quiz_question');

            resolve(allData);
        } catch (err) {
            reject(err);
        }
    })
        
    // conn.end(
    //     function (err) { 
    //         if (err) throw err;
    //         else  console.log('Closing connection.') 
    // });
};

function insertQueryStatement(queryData, value, table) {

    console.log("query data: ");
    console.log(queryData);

    if (queryData.length == 1 && value.length == 1) {

        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}) VALUES (?);`, value);
                // const mess1 = {result: mess}
                // console.log("mess1:\n");
                // console.log("FUIYOOOO:\n");
    
                // console.log(mess1);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 2 && value.length === 2) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}) VALUES (?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 3 && value.length === 3) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}) VALUES (?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 4 && value.length === 4) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}, ${queryData[3]}) VALUES (?, ?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 5 && value.length === 5) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}, ${queryData[3]}, ${queryData[4]}) VALUES (?, ?, ?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 6 && value.length === 6) {
        console.log("query 7 data? check");

        return new Promise(async (resolve, reject) => {
            try {
                console.log("query 7 data? check2");
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}, ${queryData[3]}, ${queryData[4]}, ${queryData[5]}) VALUES (?, ?, ?, ?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 7 && value.length === 7) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}, ${queryData[3]}, ${queryData[4]}, ${queryData[5]}, ${queryData[6]}) VALUES (?, ?, ?, ?, ?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    } else if (queryData.length === 8 && value.length === 8) {
        return new Promise(async (resolve, reject) => {
            try {
    
                const mess = await insertQueryData(`INSERT INTO ${table} (${queryData[0]}, ${queryData[1]}, ${queryData[2]}, ${queryData[3]}, ${queryData[4]}, ${queryData[5]}, ${queryData[6]}, ${queryData[7]}) VALUES (?, ?, ?, ?, ?, ?, ?, ?);`, value);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    }
}

function deleteQueryStatement(dataType, value, condition, table) {
    return new Promise(async (resolve, reject) => {
        try {

            const mess = await insertQueryData(`DELETE FROM ${table} WHERE ${dataType} ${condition} ?`, value);
            // const mess1 = {result: mess}
            // console.log("mess1:\n");
            // console.log("FUIYOOOO:\n");

            // console.log(mess1);
            resolve(mess);
        } catch (err) {
            reject(err);
        }
    })
}

var config =
{
    host: 'jcmg-api.mysql.database.azure.com',
    user: 'jcmg',
    password: 'T%%v6AYO890UYyqWgM2#',
    database: 'mydb',
    port: 3306,
    ssl: {ca: fs.readFileSync("./DigiCertGlobalRootCA.crt.pem")}
};

const knexInstance = knex(config);

// Expand this class to include all the functions that you need.
class Course {

    constructor() {
        // Initialize the class with the database connection
        this.db = knexInstance;
    }

    static getCourse(courseID) {
        return this.db('modules').select("*").where('course_id', '=', courseID);
    }

    static async getAllCourses() {
        // return knex('modules').select("*");
        //return courses.available_courses;

        //return all data from cloud
        try {

            const allData = await readData();

            return allData;
        } catch (err) {
            throw err;
        }
    }

    static createData(courseData, courseValue, table) {
        //return this.db('modules').insert(courseData);

        return new Promise(async (resolve, reject) => {
            try {

                console.log("in?");
    
                const mess = await insertQueryStatement(courseData, courseValue, table);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    }

    static updateCourse(courseID, courseData) {
        return this.db('modules').where('course_id', '=', courseID).update(courseData);
    }

    static deleteCourse(dataType, dataValue, condition, table) {
        //return this.db('modules').where('course_id', '=', courseID).del();
        console.log("test?")

        return new Promise(async (resolve, reject) => {
            try {

                console.log("in?");
    
                const mess = await deleteQueryStatement(dataType , dataValue, condition, table);
                console.log("mess:\n");
    
                console.log(mess);
                resolve(mess);
            } catch (err) {
                reject(err);
            }
        })
    }
}

module.exports = Course;
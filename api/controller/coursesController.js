const courses = require('../models/course');
const modules = require('../models/module');
const quizzes = require('../models/quiz');


// TODO: Not each function is working yet, need to fix the database first

const getAllCourses = async (req, res) => {
    try {
        // get courses from database
        const all_courses = await courses.getAllCourses();

        // return courses
        return res.status(200).json(all_courses);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const getCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    try {
        // get course from database
        const course = await courses.getCourse(courseID);

        // return course
        return res.status(200).json(course);
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createCourse = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { course_name, course_lastUpdated, category_type } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (!course_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("COURSE_NAME");
        newValue.push(course_name);
    }

    // if (course_video) {
    //     // count++;
    //     newData.push("COURSE_VIDEO");
    //     newValue.push(course_video);
    // }

    // if (lecture) {
    //     // count++;
    //     newData.push("LECTURE");
    //     newValue.push({lectures: lecture});
    // }

    // if (content_order) {
    //     // count++;
    //     newData.push("CONTENT_ORDER");
    //     newValue.push({content_order: content_order});
    // }

    if (course_lastUpdated) {
        // count++;
        newData.push("COURSE_LASTUPDATED");
        newValue.push(course_lastUpdated);
    }

    // if (course_tag) {
    //     // count++;
    //     newData.push("COURSE_TAG");
    //     newValue.push(course_tag);
    // }

    if (category_type) {
        // count++;
        newData.push("CATEGORY_TYPE");
        newValue.push(category_type);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        const createdCourse = await courses.createData(newData, newValue, "course");

        // return course
        return res.status(200).json(createdCourse);
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        if (err.errno === 1406) {

            const data = err.sqlMessage.match(/'([^']+)'/);

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createLecture = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { lecture_name, module_id, lecture_order } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (!lecture_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("LECTURE_NAME");
        newValue.push(lecture_name);
    }

    if (module_id) {
        // count++;
        newData.push("MODULE_ID");
        newValue.push(module_id);
    }

    if (lecture_order) {

        // if (lecture_order > 2147483647) {
        //     return res.status(500).json({
        //         error: true,
        //         message: "lecture order value is too large"
        //     });  
        // }

        // count++;
        newData.push("LECTURE_ORDER");
        newValue.push(lecture_order);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        const createdCourse = await courses.createData(newData, newValue, "lecture");

        // return course
        return res.status(200).json({
            
        });
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createLectureContent = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { lecture_id, material_id, material_order } = req.body;
    let newData = [];
    let newValue = [];

    if (!lecture_id || !material_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("LECTURE_ID");
        newValue.push(lecture_id);

        newData.push("MATERIAL_ID");
        newValue.push(material_id);
    }

    if (material_order) {
        // count++;
        newData.push("MATERIAL_ORDER");
        newValue.push(material_order);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        const createdCourse = await courses.createData(newData, newValue, "lecture_content");

        // return course
        return res.status(200).json({"message": "new lecture content data has been successfully added!"});
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createMaterial = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { material_name, material_url } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (!material_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("MATERIAL_NAME");
        newValue.push(material_name);
    }

    if (material_url) {
        // count++;
        newData.push("MATERIAL_URL");
        newValue.push(material_url);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        await courses.createData(newData, newValue, "material");

        // return course
        return res.status(200).json({
            message: "new material data has been successfully added!"
        });
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        if (err.errno === 1406) {

            const data = err.sqlMessage.match(/'([^']+)'/);

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const createModule = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { course_id, module_name, module_order } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (!course_id || !module_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("COURSE_ID");
        newValue.push(course_id);

        newData.push("MODULE_NAME");
        newValue.push(module_name);
    }

    if (module_order) {
        // count++;
        newData.push("MODULE_ORDER");
        newValue.push(module_order);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        await courses.createData(newData, newValue, "module");

        // return course
        return res.status(200).json({
            message: "new material data has been successfully added!"
        });
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const createQuiz = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { quiz_name, quiz_blob_url, module_id, question_order, quiz_maxtries } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (!quiz_name || !quiz_blob_url) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        newData.push("QUIZ_NAME");
        newValue.push(quiz_name);

        newData.push("QUIZ_BLOB_URL");
        newValue.push(quiz_blob_url);
    }

    if (module_id) {
        // count++;
        newData.push("MODULE_ID");
        newValue.push(module_id);
    }

    if (question_order) {
        // count++;
        newData.push("QUESTION_ORDER");
        newValue.push(question_order);
    }

    if (quiz_maxtries) {
        // count++;
        newData.push("QUIZ_MAXTRIES");
        newValue.push(quiz_maxtries);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        await courses.createData(newData, newValue, "quiz");

        // return course
        return res.status(200).json({
            message: "new material data has been successfully added!"
        });
    }
    catch (err) {

        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const createQuizQuestions = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { question_text, question_option, question_answer, quiz_id, question_order } = req.body;
    let newData = [];
    let newValue = [];
    // let count = 1;

    if (question_text) {
        // count++;
        newData.push("QUESTION_TEXT");
        newValue.push(question_text);
    }

    console.log("question options:" + question_option.A);
    for (let i = 0; i < question_option.length; i++) {
        console.log(question_option[i])
    }

    if (question_option) {
        // count++;
        newData.push("QUESTION_OPTION");
        //newValue.push('"A": ' + question_option.A + ', "B": ' + question_option.B + ', "C": ' + question_option.C + ', "D": ' + question_option.D);
        //newValue.push('{"A": "aku mao", "B": "aku tidak mao", "C": "aku suka", "D": "aku panik"}');
        if ((question_option.A === undefined && question_option.B === undefined && question_option.C === undefined && question_option.D === undefined) ||
            (question_option.A === undefined && question_option.B === undefined && question_option.C === undefined) ||
            (question_option.A === undefined && question_option.B === undefined && question_option.D === undefined) ||
            (question_option.A === undefined && question_option.C === undefined && question_option.D === undefined) ||
            (question_option.B === undefined && question_option.C === undefined && question_option.D === undefined)) {
            return res.status(500).json({
                error: true,
                message: "There must be at least 2 question answer options"
            });     
        } else {
            // let available_options = `{`;
            // if (question_option.A !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"A": "${question_option.A}"`
            // } else if (question_option.B !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"B": "${question_option.B}"`
            // } else if (question_option.C !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"C": "${question_option.C}"`
            // } else if (question_option.D !== undefined) {
            //     if (available_options !== `{`) {
            //         available_options += `, `
            //     }
            //     available_options += `"D": "${question_option.D}"`
            // }

            //==========================================================

            // newValue.push(available_options);
            // if (question_option.C === undefined && question_option.D === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "B": "${question_option.B}}`);
            // } else if (question_option.B === undefined && question_option.D === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "C": "${question_option.C}}`);
            // }  else if (question_option.B === undefined && question_option.C === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "D": "${question_option.D}}`);
            // }  else if (question_option.A === undefined && question_option.D === undefined) {
            //     newValue.push(`{"B": "${question_option.B}", "C": "${question_option.C}}`);
            // }  else if (question_option.A === undefined && question_option.C === undefined) {
            //     newValue.push(`{"B": "${question_option.B}", "D": "${question_option.D}}`);
            // }  else if (question_option.A === undefined && question_option.B === undefined) {
            //     newValue.push(`{"C": "${question_option.C}", "D": "${question_option.D}}`);
            // } else if (question_option.D === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "B": "${question_option.B}, "C": "${question_option.C}}`);
            // } else if (question_option.C === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "B": "${question_option.B}, "D": "${question_option.D}}`);
            // } else if (question_option.B === undefined) {
            //     newValue.push(`{"A": "${question_option.A}", "C": "${question_option.C}, "D": "${question_option.D}}`);
            // } else if (question_option.A === undefined) {
            //     newValue.push(`{"B": "${question_option.B}", "C": "${question_option.C}, "D": "${question_option.D}}`);
            // } else {
            //     newValue.push(`{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`);
            // }
            //==========================================================

            newValue.push(`{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`);
        }
        
    }

    if (question_answer) {
        // count++;
        newData.push("QUESTION_ANSWER");
        newValue.push(question_answer);
    }
    
    if (quiz_id) {
        // count++;
        newData.push("QUIZ_ID");
        newValue.push(quiz_id);
    }

    if (question_order) {
        // count++;
        newData.push("QUESTION_ORDER");
        newValue.push(question_order);
    }

    console.log("newvalue : ");
    console.log(newValue);
    
    try {
        // create course in database
        await courses.createData(newData, newValue, "quiz_question");

        // return course
        return res.status(200).json({
            message: "new quiz question data has been successfully added!"
        });
    }
    catch (err) {
        // return error
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1406) {

            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        return res.status(500).json({
            error: true,
            message: err
        });

    }
}

const deleteData = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { data_type, condition, table } = req.body; //value is a list
    let { value } = req.body; //value is a list
    // let count = 1;

    if (!data_type || !condition || !value || !table ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the data type, condition, and value"
          });
    }

    // Attempt to convert the string to an integer
    let integerValue = parseInt(value, 10);

    // Check if it's a valid integer
    if (!isNaN(integerValue)) {
        value = integerValue;
    }
    
    try {
        console.log("in?")
        // create course in database
        await courses.deleteCourse(data_type, value, condition, table);

        // return course
        return res.status(200).json({"message": `data on ${table} table with condition ${data_type} ${condition} ${value[0]} has been deleted`});
    }
    catch (err) {

        if (err.errno === 1451) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

// const deleteCourse = async (req, res) => {
//     // get course id from url
//     const courseID = req.params['courseID'];

//     try {
//         // delete course from database
//         const deletedCourse = await courses.deleteCourse(courseID);

//         // return course
//         return res.status(200).json(deletedCourse);
//     }
//     catch (err) {
//         // return error
//         return res.status(500).json({
//             error: true,
//             message: "Internal server error"
//         });
//     }
// }

const updateCourse = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get course information from request body
    const course = req.body;

    try {
        // update course in database
        const updatedCourse = await courses.updateCourse(courseID, course);

        // return course
        return res.status(200).json(updatedCourse);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const getModule = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get module id from url
    const moduleID = req.params['moduleID'];

    try {
        // get module from database
        const module = await courses.getModule(courseID, moduleID);

        // return module
        return res.status(200).json(module);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

const getQuiz = async (req, res) => {
    // get course id from url
    const courseID = req.params['courseID'];

    // get module id from url
    const moduleID = req.params['moduleID'];

    // get quiz id from url
    const quizID = req.params['quizID'];

    try {
        // get quiz from database
        const quiz = await courses.getQuiz(courseID, moduleID, quizID);

        // return quiz
        return res.status(200).json(quiz);
    }
    catch (err) {
        // return error
        return res.status(500).json({
            error: true,
            message: "Internal server error"
        });
    }
}

module.exports = {
    getAllCourses,
    getCourse,
    createCourse,
    createLecture,
    createLectureContent,
    createMaterial,
    createModule,
    createQuiz,
    createQuizQuestions,
    deleteData,
    updateCourse,
    getModule,
    getQuiz
}
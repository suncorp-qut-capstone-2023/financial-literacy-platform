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
            message: err
        });
    }
}

const getCourse = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const course = await courses.getCourse(ID);

        // return course
        return res.status(200).json(course);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getLecture = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const lecture = await courses.getLecture(ID);

        // return course
        return res.status(200).json(lecture);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getLectureContent = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const lectureContent = await courses.getLectureContent(ID);

        // return course
        return res.status(200).json(lectureContent);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getMaterial = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const material = await courses.getMaterial(ID);

        // return course
        return res.status(200).json(material);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getModule = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const module = await courses.getModule(ID);

        // return course
        return res.status(200).json(module);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getQuiz = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const quiz = await courses.getQuiz(ID);

        // return course
        return res.status(200).json(quiz);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const getQuizQuestions = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    try {
        // get course from database
        const quizQuestions = await courses.getQuizQuestion(ID);

        // return course
        return res.status(200).json(quizQuestions);
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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

const sortNewestModule = async (req, res) => {
    let dates = [];
    for (let i = 0; i < getAllCourses.course.length; i++) {
      dates.push(getAllCourses.course[i].COURSE_LASTUPDATED);
    }
  
    const indexedDates = dates.map((date, index) => ({ date, index }));
  
    indexedDates.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    const sortedIndices = indexedDates.map(item => item.index);
  
    let sortedNewestModule = []
    for (let i = 0; i < sortedIndices.length; i++) {
      sortedNewestModule.push(getAllCourses.course[sortedIndices[i]]);
    }
    
    return res.status(200).json({
      "sorted": sortedNewestModule
    })
}

const createCourse = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { course_name, category_type } = req.body;
    let data = {}
    // let count = 1;

    if (!course_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        data["COURSE_NAME"] = course_name;
    }

    // Get the current date and time
    const currentDateTime = new Date();

    // Convert the current date and time to a string
    data["COURSE_LASTUPDATED"] = currentDateTime.getFullYear() +
    '-' +
    String(currentDateTime.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(currentDateTime.getDate()).padStart(2, '0') +
    ' ' +
    String(currentDateTime.getHours()).padStart(2, '0') +
    ':' +
    String(currentDateTime.getMinutes()).padStart(2, '0') +
    ':' +
    String(currentDateTime.getSeconds()).padStart(2, '0');

    //if category_type is provided
    if (category_type) {
        data["CATEGORY_TYPE"] = category_type;
    }
    
    try {
        // create course in database
        await courses.insertData(data, "course");

        // return course
        return res.status(200).json({"message": "new course data has been successfully added!"});
    }
    catch (err) {
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails"
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `Incorrect datetime value: ${data[0]}`
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

const createLecture = async (req, res) => {
    // get course information from request body
    //TODO: course_tag haven't been added
    const { lecture_name, module_id, lecture_order } = req.body;
    let data = {};

    if (!lecture_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        data["LECTURE_NAME"] = lecture_name;
    }

    if (module_id) {
        data["MODULE_ID"] = module_id;
    }

    if (lecture_order) {
        data["LECTURE_ORDER"] = lecture_order;
    }
    
    try {
        // create course in database
        await courses.insertData(data, "lecture");

        // return course
        return res.status(200).json({
            "message": "new lecture data has been successfully added!"
        });
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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
    data = {};

    if (!lecture_id || !material_id) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the lecture ID and material ID."
          });
    } else {
        data["LECTURE_ID"] = lecture_id;
        data["MATERIAL_ID"] = material_id;
    }

    if (material_order) {
        data["MATERIAL_ORDER"] = material_order;   
    }
    
    try {
        // create course in database
        await courses.insertData(data, "lecture_content");

        // return course
        return res.status(200).json({"message": "new lecture content data has been successfully added!"});
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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
    data = {};

    if (!material_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the course name and category type."
          });
    } else {
        data["MATERIAL_NAME"] = material_name;
    }

    if (material_url) {
        data["MATERIAL_URL"] = material_url;
    }
    
    try {
        // create course in database
        await courses.insertData(data, "material");

        // return course
        return res.status(200).json({
            message: "new material data has been successfully added!"
        });
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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
    data = {};

    if (!course_id || !module_name) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the module name and course ID."
          });
    } else {
        data["COURSE_ID"] = course_id;
        data["MODULE_NAME"] = module_name;
    }

    if (module_order) {
        data["MODULE_ORDER"] = module_order;
    }

    try {
        // create course in database
        await courses.insertData(data, "module");

        // return course
        return res.status(200).json({
            message: "new module data has been successfully added!"
        });
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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
    let data = {};

    if (!quiz_name || !quiz_blob_url) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify the quiz name and quiz blob URL."
          });
    } else {
        data["QUIZ_NAME"] = quiz_name;
        data["QUIZ_BLOB_URL"] = quiz_blob_url;
    }

    if (module_id) {
        data["MODULE_ID"] = module_id;
    }

    if (question_order) {
        data["QUESTION_ORDER"] = question_order;
    }

    if (quiz_maxtries) {
        data["QUIZ_MAXTRIES"] = quiz_maxtries;
    }
    
    try {
        // create course in database
        await courses.insertData(data, "quiz");

        // return course
        return res.status(200).json({
            message: "new quiz data has been successfully added!"
        });
    }
    catch (err) {

        //error related to foreign key is not properly applied to
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
    let data = {};

    if (question_text) {
        data["QUESTION_TEXT"] = question_text;
    }

    if (question_option) {
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

            // if (question_option.C === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}}`;
            // } else if (question_option.B === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "C": "${question_option.C}}`;
            // }  else if (question_option.B === undefined && question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "D": "${question_option.D}}`;
            // }  else if (question_option.A === undefined && question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "C": "${question_option.C}}`;
            // }  else if (question_option.A === undefined && question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "D": "${question_option.D}}`;
            // }  else if (question_option.A === undefined && question_option.B === undefined) {
            //     data["QUESTION_OPTION"] = `{"C": "${question_option.C}", "D": "${question_option.D}}`;
            // } else if (question_option.D === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}, "C": "${question_option.C}}`;
            // } else if (question_option.C === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}, "D": "${question_option.D}}`;
            // } else if (question_option.B === undefined) {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "C": "${question_option.C}, "D": "${question_option.D}}`;
            // } else if (question_option.A === undefined) {
            //     data["QUESTION_OPTION"] = `{"B": "${question_option.B}", "C": "${question_option.C}, "D": "${question_option.D}}`;
            // } else {
            //     data["QUESTION_OPTION"] = `{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`;
            // }
            //==========================================================

            const question_options = `{"A": "${question_option.A}", "B": "${question_option.B}", "C": "${question_option.C}", "D": "${question_option.D}"}`;

            data["QUESTION_OPTION"] = question_options;
        }
        
    }

    if (question_answer) {
        data["QUESTION_ANSWER"] = question_answer;
    }
    
    if (quiz_id) {
        data["QUIZ_ID"] = quiz_id;
    }

    if (question_order) {
        data["QUESTION_ORDER"] = question_order;
    }

    try {
        // create course in database
        await courses.insertData(data, "quiz_question");

        // return course
        return res.status(200).json({
            message: "new quiz question data has been successfully added!"
        });
    }
    catch (err) {
        
        //error related to foreign key is not properly applied to
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

const deleteCourse = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteCourse(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'course' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'course' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        console.log(err);
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteLecture = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteLecture(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'lecture' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteLectureContent = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteLectureContent(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'lecture_content' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture_content' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteMaterial = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteMaterial(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'material' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteModule = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteModule(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'module' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'module' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteQuiz = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteQuiz(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'quiz' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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

const deleteQuizQuestions = async (req, res) => {
    // get course id from params
    const ID = req.params['ID'];

    //receive ID in integer type
    const newID = isValidInt(ID);
    
    try {

        const result = await courses.deleteQuizQuestion(newID);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `data with the condition ID = ${newID} on table 'quiz_question' has been deleted`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz_question' table with condition ID = ${newID} has not been found`
            });
        }
        
    }
    catch (err) {
        //find data type, such as "COURSE_ID"
        const data = err.sqlMessage.match(/'([^']+)'/);

        //error related to foreign key is not properly applied to
        if (err.errno === 1452) {
            return res.status(500).json({
                error: true,
                message: "foreign key constraint fails. Delete all foreign key used with the related primary key."
            });            
        }

        if (err.errno === 1264) {
            return res.status(500).json({
                error: true,
                message: `${data[0]} integer value is too large`
            });            
        }

        if (err.errno === 1292) {
            return res.status(500).json({
                error: true,
                message: `incorrect double value: ${data[0]}`
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


function isValidInt(value) {

    // Attempt to convert the string to an integer
    let integerValue = parseInt(value, 10);

    // Check if it's a valid integer
    if (!isNaN(integerValue)) {
        value = integerValue;
    }

    return value;
}

const updateCourse = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateCourse(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'course' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'course' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateLecture = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateLecture(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'lecture' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateLectureContent = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateLectureContent(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'lecture_content' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'lecture_content' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateMaterial = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateMaterial(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'material' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'material' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateModule = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateModule(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'module' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'module' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateQuiz = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateQuiz(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'quiz' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

const updateQuizQuestions = async (req, res) => { //update course table
    // get course id from url
    // get course id from params
    let ID = req.params['ID'];
    const { set_data_type } = req.body; //value is a list
    let { setValue } = req.body; //value is a list

    if (!set_data_type 
        || !setValue || !ID ) {
        return res.status(400).json({
            success_addition: false,
            error: true,
            message: "Bad request. Please specify set and where data type, set and where condition, set and where value, and the intended table"
          });
    }

    setValue = isValidInt(setValue);
    ID = isValidInt(ID);

    const value = [ setValue, ID ];

    try {

        const result = await courses.updateQuizQuestion(set_data_type, value);

        // return course
        if (result > 0) {
            return res.status(200).json({"message": `table 'quiz_question' has been updated`});
        } else {
            return res.status(400).json({
                error: true,
                message:  `data on 'quiz_question' table with condition COURSE_ID = ${value[1]} has not been found`
            });
        }
    }
    catch (err) {

        const data = err.sqlMessage.match(/'([^']+)'/);

        if (err.errno === 1054) {
            return res.status(500).json({
                error: true,
                message: `unknown column: ${data[0]}`
            });            
        }

        if (err.errno === 1366) {
            return res.status(500).json({
                error: true,
                message: `Incorrect integer value: ${data[0]}`
            });            
        }

        if (err.errno === 1406) {
            return res.status(500).json({
                error: true,
                message: `data too long for ${data[0]}`
            });            
        }

        if (err.errno === 3140) {
            return res.status(500).json({
                error: true,
                message: `Incorrect JSON text value`
            });            
        }

        // return error
        return res.status(500).json({
            error: true,
            message: err
        });
    }
}

// const getModule = async (req, res) => {
//     // get course id from url
//     const courseID = req.params['courseID'];

//     // get module id from url
//     const moduleID = req.params['moduleID'];

//     try {
//         // get module from database
//         const module = await courses.getModule(courseID, moduleID);

//         // return module
//         return res.status(200).json(module);
//     }
//     catch (err) {
//         // return error
//         return res.status(500).json({
//             error: true,
//             message: "Internal server error"
//         });
//     }
// }

// const getQuiz = async (req, res) => {
//     // get course id from url
//     const courseID = req.params['courseID'];

//     // get module id from url
//     const moduleID = req.params['moduleID'];

//     // get quiz id from url
//     const quizID = req.params['quizID'];

//     try {
//         // get quiz from database
//         const quiz = await courses.getQuiz(courseID, moduleID, quizID);

//         // return quiz
//         return res.status(200).json(quiz);
//     }
//     catch (err) {
//         // return error
//         return res.status(500).json({
//             error: true,
//             message: "Internal server error"
//         });
//     }
// }

module.exports = {
    getAllCourses,
    getCourse,
    getLecture,
    getLectureContent,
    getMaterial,
    getModule,
    getQuiz,
    getQuizQuestions,
    createCourse,
    createLecture,
    createLectureContent,
    createMaterial,
    createModule,
    createQuiz,
    createQuizQuestions,
    deleteCourse,
    deleteLecture,
    deleteLectureContent,
    deleteMaterial,
    deleteModule,
    deleteQuiz,
    deleteQuizQuestions,
    updateCourse,
    updateLecture,
    updateLectureContent,
    updateMaterial,
    updateModule,
    updateQuiz,
    updateQuizQuestions,
    sortNewestModule
}
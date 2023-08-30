const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../middleware/auth.js");
const course_information = require("../course-information.json");
const fs = require("fs");
const path = require("path");
const axios = require("axios");

const {
  searchModule,
  addTag,
  deleteTag,
  searchTag
} = require('../controller/SearchController.js');

// TODO(): Write a handler for Json files so we dont have to for loop through it.
// TODO: Check good practice for variable names. (filewide)
router.get("/:courseID/media", auth, (req, res) => {
  const courseID = req.params.courseID;
  const image = req.query.image;
  const video = req.query.video;

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  if (!courseID) {
    return res.status(400).json({
      error: true,
      message: "Bad request please specify a course ID"
    });
  }

  if (!image && !video || image && video) {
    return res.status(400).json({
      error: true,
      message: "Bad request, please specify an image ID OR video ID",
    })
  }

  const filteredCourse = course_information.available_courses.find((c) => {
    return c.course_id === Number(courseID);
  });

  if (!filteredCourse) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid course ID"
    });
  }

  const fileType = image ? 'image' : 'video'
  const fileId = image ?? video;
  const fileExt = image ? 'jpeg' : 'mp4';

  const filePath = `../api/assets/course${courseID}/${fileType}${fileId}.${fileExt}`;

  if (fs.existsSync(path.resolve(filePath))) {
    return res.sendFile(path.resolve(filePath));
  } else {
    return res.status(404).json({
      error: true,
      message: "Module file not found",
    });
  }
});

//TODO: create one FindController.js to be connected with every find functions
function FindCourseIndex(course_ID) {
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/course/add", auth, (req, res) => {
  // Validate inputs
  const { course_name, category_type, course_last_updated } = req.body;
  if (!course_name || !category_type || !course_last_updated) {
    return res.status(400).json({
      success_addition: false,
      error: true,
      message: "Bad request. Please specify the course name and category type."
    });
  }

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  try {
    // Generate a new course_id (TODO: MAKE IT MORE ROBUST)
    const last_data = course_information.available_courses.length - 1;
    const course_id = course_information.available_courses[last_data].course_id + 1;

    //   /*
    //   =================================NOTE========================================

    //   check if the ISOdate format is already correct or not!
    //   check all the other types too (string and int) if it's inputted correctly!
    //   */
  
    const new_course = {
      course_id,
      course_name,
      category_type,
      course_tag: [],
      course_last_updated: {
        "@type": "ISODate",
        "value": course_last_updated
      },
      material: [],
      lectures: [],
      quiz: []
    }
  
    course_information.available_courses.push(new_course);
  
    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);
  
    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }
  
      return res.status(200).json({
        success_addition: true,
        message: 'A new course with the ID ' + course_id + ' has been added'
      });
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success_addition: false, message: 'Internal server error' });
  }
});

router.post("/course/add/material", auth, (req, res) => {
  const { course_id, material_type, material_media } = req.body;
  if (!material_type || !material_media) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the course ID, material type, and material media"
    });
  }

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  const courseIndex = FindCourseIndex(course_id);

  if (courseIndex < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[courseIndex].material.length;
    let material_ID;

    if (total_data != 0) {
      material_ID = course_information.available_courses[courseIndex].material[total_data - 1].material_id + 1;
    } else {
      material_ID = 1;
    }

    const new_material = {
      "material_id": material_ID,
      "material_type": material_type,
      "material_media": material_media
    }

    course_information.available_courses[courseIndex].material.push(new_material);

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }
  
      return res.status(200).json({
        "success_addition": true,
        "message": `A new course material with the ID ${material_ID} has been added to course ID ${course_id}`
      })
    });
  }
})

router.post("/course/add/lecture", auth, (req, res) => {
  // Validate inputs
  const { course_id, lecture_type } = req.body;
  if (!lecture_type) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the course ID and lecture type"
    });
  }

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[index].lectures.length;
    let lectureId;

    if (total_data != 0) {
      lectureId = course_information.available_courses[index].lectures[total_data - 1].lectures_id + 1;
    } else {
      lectureId = 1;
    }

    const currentDate = new Date();

    const new_lecture = {
      "lectures_id": lectureId,
      "lecture_date_and_time": {
        "@type": "ISODate",
        "value": currentDate.toISOString()
      },
      "lectures_type": lecture_type
    }

    course_information.available_courses[index].lectures.push(new_lecture);

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }
  
      return res.status(200).json({
        "success_addition": true,
        message: `A new course lecture with the ID ${lectureId} has been added to course ID ${course_id}`
      })
    });
  }
})

router.post("/course/add/quiz", auth, (req, res) => {
  const {course_id, description, max_tries} = req.body;
  if (!description || !max_tries) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the quiz description and max tries"
    });
  }

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[index].quiz.length;
    let quizId;

    if (total_data != 0) {
      quizId = course_information.available_courses[index].quiz[total_data - 1].quiz_id + 1;
    } else {
      quizId = 1;
    }

    //by default, at least a quiz can be added without any question
    const new_quiz = {
      "quiz_id": quizId,
      "description": description,
      "max_tries": max_tries,
      "questions": []
    }

    course_information.available_courses[index].quiz.push(new_quiz);

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }
  
      return res.status(200).json({
        "success_addition": true,
        message: `A new course quiz with the ID ${quizId} has been added to course ID ${course_id}`
      })
    });
  }
})

function FindQuizIndex(course_index, quiz_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].quiz.length; i++) {
    if (course_information.available_courses[course_index].quiz[i].quiz_id == quiz_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/course/add/quiz/question", auth, (req, res) => {
  const {course_id, quiz_id, question_text, question_answers, question_answer_options } = req.body;
  const {A, B, C, D} = question_answer_options;

  if (!req.isAuthorized) {
    return res.status(401).json({ error: true, message: "Not authorized!" });
  }

  const index = FindCourseIndex(course_id);

  if (!question_text || !question_answers || !question_answers.length || !question_answer_options || !A || !B || !C || !D ) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the question text, question answers, and the question answer options"
    });
  }

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    const quiz_index = FindQuizIndex(index, quiz_id)

    if (quiz_index < 0) {
      return res.status(404).json({
        "success_addition": false,
        "error": true,
        message: "the provided quiz ID can not be found"
      })
    } else {
      const total_data = course_information.available_courses[index].quiz[quiz_index].questions.length;
      let question_num;

      if (total_data != 0) {
        question_num = course_information.available_courses[index].quiz[quiz_index].questions[total_data - 1].question_number + 1;
      } else {
        question_num = 1;
      }

      const new_quiz = {
        "question_number": question_num,
        "question_text": question_text,
        "question_answer_options": {
          "A": A,
          "B": B,
          "C": C,
          "D": D
        },
        "answers": question_answers  // Store answers array in the question
      }

      course_information.available_courses[index].quiz[quiz_index].questions.push(new_quiz);

      // Convert the course_information object to JSON format
      const updatedData = JSON.stringify(course_information, null, 2);

      // Write the updated JSON data back to the file
      fs.writeFile('./course-information.json', updatedData, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({ success_addition: false, message: 'Internal server error' });
        }
    
        return res.status(200).json({
          "success_addition": true,
          message: `A new course quiz question with the number ${question_num} has been added to quiz ID ${quiz_id} of course ID ${course_id}`
        })
      });
    }

  }
})

router.post("/course/update", auth, (req, res) => {
  const {course_id, course_name, category_type, course_last_updated} = req.body;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_update": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    let success = false;

    if (course_name) {
      course_information.available_courses[index].course_name = course_name;
      success = true;
    }

    if (category_type) {
      course_information.available_courses[index].category_type = category_type;
      success = true;
    }

    if (course_last_updated) {
      course_information.available_courses[index].course_last_updated.value = course_last_updated;
      success = true;
    } 

    if (success == true) {

      // Convert the course_information object to JSON format
      const updatedData = JSON.stringify(course_information, null, 2);

      // Write the updated JSON data back to the file
      fs.writeFile('./course-information.json', updatedData, (err) => {
        if (err) {
          console.error('Error writing to file:', err);
          return res.status(500).json({ success_addition: false, message: 'Internal server error' });
        }
    
        return res.status(200).json({
          "success_update": true,
          message: `A course with the ID ${course_id} has been updated`
        })
      });
    } else {
      return res.status(400).json({
        "success_update": false,
        error: true,
        message: "Bad request please specify the course ID, course name, and category type"
      });
    }
  }
})

function FindMaterialIDIndex(course_index, material_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].material.length; i++) {
    if (course_information.available_courses[course_index].material[i].material_id == material_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/course/update/material", auth, (req, res) => {
  const {course_id, material_id, material_type, material_media} = req.body;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_update": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    const materialIndex = FindMaterialIDIndex(index, material_id);

    if (materialIndex < 0) {
      return res.status(404).json({
        "success_update": false,
        "error": true,
        message: "the provided material ID can not be found"
      })
    } else {

      let success = false;

      if (material_type) {
        course_information.available_courses[index].material[materialIndex].material_type = material_type;
        success = true;
      }

      if (material_media) {
        course_information.available_courses[index].material[materialIndex].material_media = material_media;
        success = true;
      }

      if (success == true) {
        // Convert the course_information object to JSON format
        const updatedData = JSON.stringify(course_information, null, 2);

        // Write the updated JSON data back to the file
        fs.writeFile('./course-information.json', updatedData, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ success_addition: false, message: 'Internal server error' });
          }
      
          return res.status(200).json({
            "success_update": true,
            message: `the material on the material ID ${material_id} from course ID ${course_id} has been updated`
          })
        });

      } else {
        return res.status(400).json({
          "success_update": false,
          error: true,
          message: "Bad request please specify the course ID, material ID, material type, and material media"
        });
      }
    }
  }
})

function FindLectureIDIndex(course_index, lecture_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].lectures.length; i++) {
    if (course_information.available_courses[course_index].lectures[i].lectures_id == lecture_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/course/update/lecture", auth, (req, res) => {
  const {course_id, lecture_id, lecture_type} = req.body;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_update": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const lectureIndex = FindLectureIDIndex(index, lecture_id);

    if (lectureIndex < 0) {
      return res.status(404).json({
        "success_update": false,
        "error": true,
        message: "the provided lecture ID can not be found"
      })
    } else {

      if (lecture_type) {
        course_information.available_courses[index].lectures[lectureIndex].lectures_type = lecture_type;

        // Convert the course_information object to JSON format
        const updatedData = JSON.stringify(course_information, null, 2);

        // Write the updated JSON data back to the file
        fs.writeFile('./course-information.json', updatedData, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ success_addition: false, message: 'Internal server error' });
          }
      
          return res.status(200).json({
            "success_update": true,
            message: `the material on the lecture ID ${lecture_id} from course ID ${course_id} has been updated`
          })
        });

      } else {
        return res.status(400).json({
          "success_update": false,
          error: true,
          message: "Bad request please specify the lecture type"
        });
      }
    }
  }
})

function FindQuizIDIndex(course_index, quiz_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].quiz.length; i++) {
    if (course_information.available_courses[course_index].quiz[i].quiz_id == quiz_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/course/update/quiz", auth, (req, res) => {
  const {course_id, quiz_id, description, max_tries} = req.body;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_update": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const quizIndex = FindQuizIDIndex(index, quiz_id);

    if (quizIndex < 0) {
      return res.status(404).json({
        "success_update": false,
        "error": true,
        message: "the provided lecture ID can not be found"
      })
    } else {
      let success = false;

      if (description) {
        course_information.available_courses[index].quiz[quizIndex].description = description;
        success = true;
      }

      if (max_tries) {
        course_information.available_courses[index].quiz[quizIndex].max_tries = max_tries;
        success = true;
      }

      if (success === true) {

        // Convert the course_information object to JSON format
        const updatedData = JSON.stringify(course_information, null, 2);

        // Write the updated JSON data back to the file
        fs.writeFile('./course-information.json', updatedData, (err) => {
          if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ success_addition: false, message: 'Internal server error' });
          }
      
          return res.status(200).json({
            "success_update": true,
            message: `the material on the quiz ID ${quiz_id} from course ID ${course_id} has been updated`
          })
        });

      } else {
        return res.status(400).json({
          "success_update": false,
          error: true,
          message: "Bad request please specify the lecture type"
        });
      }
    }
  }
})

function FindQuestionNumberIndex(course_index, quiz_index, question_number) {
  for (let i = 0; i < course_information.available_courses[course_index].quiz[quiz_index].questions.length; i++) {
    if (course_information.available_courses[course_index].quiz[quiz_index].questions[i].question_number == question_number) {
      return i;
    }
  }

  return -1;
}

router.post("/course/update/quiz/question", auth, (req, res) => {
  const {course_id, quiz_id, question_number, question_text, question_answers, question_answer_options} = req.body;
  const {A, B, C, D} = question_answer_options;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_update": false,
      "error": true,
      message: "the provided course ID can not be found"
    });
  } else {
    const quizIndex = FindQuizIDIndex(index, quiz_id);

    if (quizIndex < 0) {
      return res.status(404).json({
        "success_update": false,
        "error": true,
        message: "the provided quiz ID can not be found"
      });
    } else {
      const quesNumIndex = FindQuestionNumberIndex(index, quizIndex, question_number);

      if (quesNumIndex < 0) {
        return res.status(404).json({
          "success_update": false,
          "error": true,
          message: "the provided question number can not be found"
        });
      } else {
        let success = false;

        // Update the question text if provided
        if (question_text) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].question_text = question_text;
          success = true;
        }

        // Update the answers if provided
        if (question_answers && Array.isArray(question_answers) && question_answers.length) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].answers = question_answers;
          success = true;
        }

        // Update the answer options if provided
        if (A) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].question_answer_options.A = A;
          success = true;
        }
        if (B) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].question_answer_options.B = B;
          success = true;
        }
        if (C) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].question_answer_options.C = C;
          success = true;
        }
        if (D) {
          course_information.available_courses[index].quiz[quizIndex].questions[quesNumIndex].question_answer_options.D = D;
          success = true;
        }

        if (success) {

          // Convert the course_information object to JSON format
          const updatedData = JSON.stringify(course_information, null, 2);

          // Write the updated JSON data back to the file
          fs.writeFile('./course-information.json', updatedData, (err) => {
            if (err) {
              console.error('Error writing to file:', err);
              return res.status(500).json({ success_addition: false, message: 'Internal server error' });
            }
        
            return res.status(200).json({
              "success_update": true,
              message: `the material on the quiz ID ${quiz_id} from course ID ${course_id} has been updated`
            });
          });
        } else {
          return res.status(400).json({
            "success_update": false,
            error: true,
            message: "Bad request. Please provide valid details to update."
          });
        }
      }
    }
  }
});

// delete the whole course
router.delete("/course/delete/:course_id", auth, (req, res) => {
  const course_ID = req.params.course_id;

  let check = false;
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_ID) {
      course_information.available_courses.splice(i, 1);
      check = true;
      break;
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }

      return res.status(200).json({
        "success_deletion": true,
        message: "course ID with the ID " + course_ID + " has been deleted"
      })
    });

  };
});

//delete a particular material
router.delete("/course/delete/:course_id/material/:material_id", auth, (req, res) => {
  const {course_id, material_id} = req.params;

  let check = false;
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_id) {
      for (let j = 0; j < course_information.available_courses[i].material.length; j++) {
        if (course_information.available_courses[i].material[j].material_id == material_id) {
          course_information.available_courses[i].material.splice(j, 1);
          check = true;
          break;
        }
      }
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      "error": true,
      message: "the provided course ID or material ID can not be found"
    })
  } else {

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }

      return res.status(200).json({
        "success_deletion": true,
        message: "material with the ID " + material_id + " on course ID " + course_id + " has been deleted"
      })
    });

  };
});

//delete a particular lecture
router.delete("/course/delete/:course_id/lecture/:lecture_id", auth, (req, res) => {
  const {course_id, lecture_id} = req.params;

  let check = false;
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_id) {
      for (let j = 0; j < course_information.available_courses[i].lectures.length; j++) {
        if (course_information.available_courses[i].lectures[j].lectures_id == lecture_id) {
          course_information.available_courses[i].lectures.splice(j, 1);
          check = true;
          break;
        }
      }
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }

      return res.status(200).json({
        "success_deletion": true,
        message: "lecture with the ID " + lecture_id + " on course ID " + course_id + " has been deleted"
      })
    });

  };
});

//delete a particular quiz
router.delete("/course/delete/:course_id/quiz/:quiz_id", auth, (req, res) => {
  const {course_id, quiz_id} = req.params;

  let check = false;
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_id) {
      for (let j = 0; j < course_information.available_courses[i].quiz.length; j++) {
        if (course_information.available_courses[i].quiz[j].quiz_id == quiz_id) {
          course_information.available_courses[i].quiz.splice(j, 1);
          check = true;
          break;
        }
      }
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }

      return res.status(200).json({
        "success_deletion": true,
        message: "quiz with the ID " + quiz_id + " on course ID " + course_id + " has been deleted"
      })
    });

  };
});

//delete a particular quiz
router.delete("/course/delete/:course_id/quiz/:quiz_id/quiz-question/:question_number", auth, (req, res) => {
  const {course_id, quiz_id, question_number} = req.params;

  let check = false;
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_id) {
      for (let j = 0; j < course_information.available_courses[i].quiz.length; j++) {
        if (course_information.available_courses[i].quiz[j].quiz_id == quiz_id) {
          for (let k = 0; k < course_information.available_courses[i].quiz[j].questions.length; k++) {
            if (course_information.available_courses[i].quiz[j].questions[k].question_number == question_number) {
              console.log(course_information.available_courses[i].quiz[j].questions[k].question_number);
              course_information.available_courses[i].quiz[j].questions.splice(k, 1);
              check = true;
              break;
            }
          }
        }
      }
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    // Convert the course_information object to JSON format
    const updatedData = JSON.stringify(course_information, null, 2);

    // Write the updated JSON data back to the file
    fs.writeFile('./course-information.json', updatedData, (err) => {
      if (err) {
        console.error('Error writing to file:', err);
        return res.status(500).json({ success_addition: false, message: 'Internal server error' });
      }

      return res.status(200).json({
        "success_deletion": true,
        message: "quiz with the ID " + quiz_id + " on course ID " + course_id + " has been deleted"
      })
    });

  };
});

router.get("/sort-newest-module", auth, (req, res) => {

  let dates = [];
  for (let i = 0; i < course_information.available_courses.length; i++) {
    dates.push(course_information.available_courses[i].course_last_updated.value);
  }

  const indexedDates = dates.map((date, index) => ({ date, index }));

  indexedDates.sort((a, b) => new Date(b.date) - new Date(a.date));

  const sortedIndices = indexedDates.map(item => item.index);

  let sortedNewestModule = []
  for (let i = 0; i < sortedIndices.length; i++) {
    sortedNewestModule.push(course_information.available_courses[sortedIndices[i]]);
  }
  
  return res.status(200).json({
    "sorted": sortedNewestModule
  })
});

//TODO(): for presentation, must log in to see quiz answers.
router.get("/:courseID/quiz", auth, (req, res) => {
  // TODO: dummy boolean remove when implemented logging in token
  const loggedIn = true;

  const courseID = req.params['courseID'];
  const id = req.query.id;

  if (!courseID) {
    return res.status(400).json({
      error: true,
      message: "Bad request please specify a course ID"
    });
  }

  if (!id) {
    return res.status(400).json({
      error: true,
      message: "Bad request, please specify a quiz ID",
    })
  }

  const filteredCourseQuizzes = course_information.available_courses.find((c) => {
    return c['course_id'] === Number(courseID);
  });

  if (!filteredCourseQuizzes) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid course ID"
    });
  }

  const filteredQuiz = filteredCourseQuizzes['quiz'].find((q) => {
    return q['quiz_id'] === Number(id);
  });

  if (!filteredQuiz) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid quiz ID"
    });
  }

  if (!loggedIn) {
    delete filteredQuiz["quiz_answers"];
  }

  return res.json({ filteredQuiz });
});

router.post("/search", auth, searchModule);

router.post("/add/tags", auth, addTag);
router.delete("/delete/tags", auth, deleteTag);
router.post("/search/tags", auth, searchTag);

/* View all available learning modules */
router.get("", auth, function (req, res, next) {
  // TODO(): Handle if query params are added
  return res.json({
    "available_courses": course_information.available_courses,
  });
});

router.get("/course", function (req, res, next) {
  const courseId = req.query.id;
  const filteredCourse = course_information.available_courses.find((c) => {
    return c.course_id === Number(courseId);
  });

  if (!filteredCourse) {
    return res.status(400).json({
      error: true,
      message: "Malformed request, please query a valid course ID."
    });
  }

  if (filteredCourse) {
    return res.json({
      id: filteredCourse
    });
  }
  // TODO(): This is not reached.
  return res.status(404).json({
    error: true,
    message: "Course not found"
  })

});

module.exports = router;

const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../authorize.js");
const course_information = require("../course-information.json");
const fs = require("fs");
const path = require("path");

// TODO(): Write a handler for Json files so we dont have to for loop through it.
// TODO: Check good practice for variable names. (filewide)
router.get("/:courseID/media", (req, res) => {
  const courseID = req.params.courseID;
  const image = req.query.image;
  const video = req.query.video;


  if(!courseID) {
    return res.status(400).json({
      error: true,
      message: "Bad request please specify a course ID"
    });
  }

  if(!image && !video || image && video) {
    return res.status(400).json({
      error: true,
      message: "Bad request, please specify an image ID OR video ID",
    })
  }

  const filteredCourse = course_information.available_courses.find((c) => {
    return c.course_id === Number(courseID);
  });

  if(!filteredCourse) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid course ID"
    });
  }

  const fileType = image ? 'image' : 'video'
  const fileId = image ?? video;
  const fileExt = image ? 'jpeg' : 'mp4';
  
  const filePath = `../api/assets/course${courseID}/${fileType}${fileId}.${fileExt}`;

  if(fs.existsSync(path.resolve(filePath))) {
    return res.sendFile(path.resolve(filePath));
  } else {
    return res.status(404).json({
      error: true,
      message: "Module file not found",
    });
  }
});

function FindCourseIndex (course_ID) {
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/add-new-course", (req, res) => {
  const last_data = course_information.available_courses.length - 1;
  const course_id = course_information.available_courses[last_data].course_id + 1;

  const course_name = req.body.course_name;
  const category_type = req.body.category_type;

  if (!course_name || !category_type) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the course name and category type"
    });
  }

  //course_information will be modified to accessing S3 or Azure blob storage soon
  const new_course = {
    "course_id": course_id,
    "course_name": course_name,
    "category_type": category_type,
    "material": [ ],
    "lectures": [ ],
    "quiz": [ ]
  }

  course_information.available_courses.push(new_course);

  return res.status(200).json({
    "success_addition": true,
    message: "A new course with the ID " + course_id + " has been added"
  })

})

router.post("/add-new-course-material", (req, res) => {
  const course_ID = req.body.course_id;
  const material_type = req.body.material_type;
  const material_media = req.body.material_media;

  const index = FindCourseIndex(course_ID);

  if (!material_type || !material_media) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the material ID, material type, and material media"
    });
  }

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[index].material.length;
    let material_ID;

    if (total_data != 0) {
      material_ID = course_information.available_courses[index].material[total_data - 1].material_id + 1;
    } else {
      material_ID = 1;
    }
    

    const new_material = {
      "material_id": material_ID,
      "material_type": material_type,
      "material_media": material_media
    }

    course_information.available_courses[index].material.push(new_material);

    return res.status(200).json({
      "success_addition": true,
      message: "A new course with the ID " + course_ID + " has been added"
    })
  }
})

router.post("/add-new-course-lecture", (req, res) => {
  const course_ID = req.body.course_id;
  const lecture_date_and_time = req.body.date_and_time;
  const lecture_type = req.body.lecture_type;

  const index = FindCourseIndex(course_ID);

  if (!lecture_date_and_time || !lecture_type) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the material ID, material type, and material media"
    });
  }

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[index].lectures.length;
    let lecture_ID;

    if (total_data != 0) {
      lecture_ID = course_information.available_courses[index].lectures[total_data - 1].lectures_id + 1;
    } else {
      lecture_ID = 1;
    }
    

    const new_lecture = {
      "lectures_id": lecture_ID,
      "lecture_date_and_time": {
        "@type": "ISODate",
        "value": lecture_date_and_time
      },
      "lectures_type": lecture_type
    }

    course_information.available_courses[index].lectures.push(new_lecture);

    return res.status(200).json({
      "success_addition": true,
      message: "A new course with the ID " + course_ID + " has been added"
    })
  }
})

router.post("/add-new-course-quiz", (req, res) => {
  const course_ID = req.body.course_id;
  const quiz_description = req.body.description;
  const quiz_max_tries = req.body.max_tries;

  const quiz_question = req.body.questions;
  const question_number = quiz_question.question_number;
  const question_text = quiz_question.question_text;
  const question_answer = quiz_question.answer;

  const question_options = quiz_question.question_answer_options;
  const option_A = question_options.A;
  const option_B = question_options.B;
  const option_C = question_options.C;
  const option_D = question_options.D;

  const index = FindCourseIndex(course_ID);

  if (!quiz_description || !quiz_max_tries || !quiz_question || ! question_number || !question_text || !question_answer || !question_options || !option_A || !option_B || !option_C || !option_D ) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the quiz description and max tries"
    });
  }

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {
    const total_data = course_information.available_courses[index].quiz.length;
    let quiz_ID;

    if (total_data != 0) {
      quiz_ID = course_information.available_courses[index].quiz[total_data - 1].quiz_id + 1;
    } else {
      quiz_ID = 1;
    }
    
    //by default, at least one quiz must have one quiz question
    const new_quiz = {
      "quiz_id": quiz_ID,
      "description": quiz_description,
      "max_tries": quiz_max_tries,
      "questions": [{
        "question_number": question_number,
        "question_text": question_text,
        "question_answer_options": {
            "A": option_A,
            "B": option_B,
            "C": option_C,
            "D": option_D
          },
        "answer": question_answer
      }]
    }

    course_information.available_courses[index].quiz.push(new_quiz);

    return res.status(200).json({
      "success_addition": true,
      message: "A new course with the ID " + course_ID + " has been added"
    })
  }
})

function FindQuizIndex (course_index, quiz_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].quiz.length; i++) {
    if (course_information.available_courses[course_index].quiz[i].quiz_id == quiz_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/add-new-course-quiz-question", (req, res) => {
  const course_ID = req.body.course_id;
  const quiz_ID = req.body.quiz_id;
  const question_text = req.body.question_text;
  const question_answer = req.body.question_answer;

  const question_options = req.body.question_answer_options;
  const option_A = question_options.A;
  const option_B = question_options.B;
  const option_C = question_options.C;
  const option_D = question_options.D;

  const index = FindCourseIndex(course_ID);

  if (!question_text || !question_answer || !question_options || !option_A || !option_B || !option_C || !option_D ) {
    return res.status(400).json({
      "success_addition": false,
      error: true,
      message: "Bad request please specify the --"
    });
  }

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    const quiz_index = FindQuizIndex(index, quiz_ID)
    
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
            "A": option_A,
            "B": option_B,
            "C": option_C,
            "D": option_D
          },
        "answer": question_answer
      }

      course_information.available_courses[index].quiz[quiz_index].questions.push(new_quiz);

      return res.status(200).json({
        "success_addition": true,
        message: "A new course with the ID " + course_ID + " has been added"
      })      
    }

  }
})

router.post("/update-course", (req, res) => {
  const course_id = req.body.course_id;
  const course_name = req.body.course_name;
  const category_type = req.body.category_type;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
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

    if (success == true) {
      return res.status(200).json({
        "success_addition": true,
        message: "A course with the ID " + course_id + " has been updated"
      })    
    } else {
      return res.status(400).json({
        "success_addition": false,
        error: true,
        message: "Bad request please specify the course name and category type"
      });
    }
  }
})

function FindMaterialIDIndex (course_index, material_ID) {
  for (let i = 0; i < course_information.available_courses[course_index].material.length; i++) {
    if (course_information.available_courses[course_index].material[i].material_id == material_ID) {
      return i;
    }
  }

  return -1;
}

router.post("/update-course-material", (req, res) => {
  const course_id = req.body.course_id;
  const material_id = req.body.material_id;
  const material_type = req.body.material_type;
  const material_media = req.body.material_media;

  const index = FindCourseIndex(course_id);

  if (index < 0) {
    return res.status(404).json({
      "success_addition": false,
      "error": true,
      message: "the provided course ID can not be found"
    })
  } else {

    const materialIndex = FindMaterialIDIndex(index, material_id);

    if (materialIndex < 0) {
      return res.status(404).json({
        "success_addition": false,
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
        return res.status(200).json({
          "success_addition": true,
          message: "the material on the material ID " + material_id + "from course ID " + course_id + " has been updated"
        })    
      } else {
        return res.status(400).json({
          "success_addition": false,
          error: true,
          message: "Bad request please specify the material type and material media"
        });
      }      
    }
  }
})

router.get("/delete", (req, res) => {
  const course_ID = req.query.course_id;

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
    return res.status(200).json({
      "success_deletion": true,
      message: "course ID with the ID " + course_ID + " has been deleted"
    })
  };
});

router.put("/update", (req, res) => {
  function FindCourseIdIndex(course_id) {
    for (let i = 0; i < course_information.available_courses.length; i ++) {
      if (course_information.available_courses[i].course_id == course_id) {
        return i;
      }
    }
    return -1;
  }

  const updated_information = {
    course_id: req.body.course_id,
    course_name: req.body.course_name,
    category_type: req.body.category_type,
    material: req.body.material,
    lectures: req.body.lectures,
    quiz: req.body.quiz
  }

  const course_index = FindCourseIdIndex(updated_information.course_id);

  let totalMaterials = 0;
  let totalLectures = 0;
  let totalQuiz = 0;

  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (updated_information.course_id == course_information.available_courses[i].course_id) {
      totalMaterials = course_information.available_courses[i].material.length;
      totalLectures = course_information.available_courses[i].lectures.length;
      totalQuiz = course_information.available_courses[i].quiz.length;
    }

    break;
  }

  if (updated_information.material.length > totalMaterials || updated_information.lectures.length > totalLectures ||
    updated_information.quiz > totalQuiz) {
      return res.status(404).json ({
        error: true,
        message: "the provided array input is more than the actual array"
      })
  }

  for (let i = 0; i < updated_information.material.length; i++) {
    let findMaterialID = false;
    for (let j = 0; j < course_information.available_courses[course_index].material.length; j++) {
      if (updated_information.material[i].material_id ==
        course_information.available_courses[course_index].material[j].material_id) {
          findMaterialID = true;
        }
    }

    if (findMaterialID == false) {
      return res.status(404).json({
        error: true,
        message: "one of the provided material ID is not valid"
      })
    }
  }

  for (let i = 0; i < updated_information.material.length; i++) {
    for (let j = 0; j < updated_information.material.length; j++) {
      if (i != j &&
        updated_information.material[i].material_id == updated_information.material[j].material_id) {
          return res.status(404).json({
            error: true,
            message: "there is more than one material ID provided with the same material ID"
          })
        }
    }
  }
})

//TODO(): for presentation, must log in to see quiz answers.
router.get("/:courseID/quiz", (req, res) => {
  // TODO: dummy boolean remove when implemented logging in token
  const loggedIn = true;

  const courseID = req.params['courseID'];
  const id = req.query.id;

  if(!courseID) {
    return res.status(400).json({
      error: true,
      message: "Bad request please specify a course ID"
    });
  }

  if(!id) {
    return res.status(400).json({
      error: true,
      message: "Bad request, please specify a quiz ID",
    })
  }

  const filteredCourseQuizzes = course_information.available_courses.find((c) => {
    return c['course_id'] === Number(courseID);
  });

  if(!filteredCourseQuizzes) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid course ID"
    });
  }

  const filteredQuiz = filteredCourseQuizzes['quiz'].find((q) => {
    return q['quiz_id'] === Number(id);
  });

  if(!filteredQuiz) {
    return res.status(404).json({
      error: true,
      message: "Bad request please specify a valid quiz ID"
    });
  }

  if(!loggedIn) {
    delete filteredQuiz["quiz_answers"];
  }

  return res.json({ filteredQuiz });
});


/* View all available learning modules */
router.get("", function (req, res, next) {
  // TODO(): Handle if query params are added
  return res.json({
    "available courses": course_information.available_courses,
  });
});

router.get("/course", function (req, res, next) {
  const courseId = req.query.id;
  const filteredCourse = course_information.available_courses.find((c) => {
    return c.course_id === Number(courseId);
  });

  if (!filteredCourse){
    return res.status(400).json({
      error: true,
      message: "Malformed request, please query a valid course ID."
    });
  }

  if (filteredCourse){
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

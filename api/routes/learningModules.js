const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../authorize.js");
const videos = require("../videos.json");
const fs = require("fs");
const path = require("path");

// TODO(): Write a handler for Json files so we dont have to for loop through it.

//[url][port]/[filename]/video
router.get("/:video_ID/video", (req, res) => {
  const video_ID = req.params.video_ID;

  const videoName = "../api/assets/video" + video_ID + ".mp4";

  console.log("result: " + fs.existsSync(path.resolve(videoName)) + "\n\n");

  if (fs.existsSync(path.resolve(videoName))) {
    return res.sendFile(path.resolve(videoName));
  } else {
    return res.status(404).json({
      error: true,
      message: "Module video not found",
    });
  }
});

router.get("/delete", (req, res) => {
  const course_ID = req.query.course_id;

  let check = false;
  for (let i = 0; i < videos.available_courses.length; i++) {
    if (videos.available_courses[i].course_id == course_ID) {
      videos.available_courses.splice(i, 1);
      check = true;
      break;
    }
  }

  if (check == false) {
    return res.status(404).json({
      "success_deletion": false,
      error: true,
      message: "the provided course ID can not be found"
    })
  } else {
    return res.status(200).json({
      "success_deletion": true,
      message: "course ID with the ID " + course_ID + " has been deleted"
    });    
  }
});

router.put('/update', function(req, res, next){

  function FindCourseIdIndex(course_id) {

    for (let i = 0; i < videos.available_courses.length; i++) {
      if (videos.available_courses[i] == course_id) {
        return i;
      }
    }

    return -1;
  }

  const updated_information = {
    course_id: req.body.course_id,
    course_name: req.body.course_name,
    category_type: req.body.category_type,
    material: req.body.material, //[]
    lectures: req.body.lectures, //[]
    quiz_id: req.body.quiz_id,
    quiz_max_tries: req.body.quiz_max_tries,
    quiz_description: req.body.quiz_description,
    quiz_questions: req.body.quiz_questions, //[]
    quiz_answers: req.body.quiz_answers //[]
  }

  const course_index = FindCourseIdIndex(updated_information.course_id);

  let totalMaterials = 0;
  let totalLectures = 0;
  let totalQuizesAnswers = 0;
  let totalQuizesQuestions = 0;

  for (let i = 0; i < videos.available_courses.length; i++) {
    if (updated_information.course_id == videos.available_courses[i].course_id) {
      totalMaterials = videos.available_courses[i].material.length;
      totalLectures = videos.available_courses[i].lectures.length;
      totalQuizesQuestions = videos.available_courses[i].quiz.questions.length;
      totalQuizesAnswers = videos.available_courses[i].quiz.quiz_answers.length;

      break;
    }
  }

  if (updated_information.material.length > totalMaterials || updated_information.lectures.length > totalLectures ||
    updated_information.quiz_questions > totalQuizesQuestions || updated_information.quiz_answers > totalQuizesAnswers) {
      return res.status(404).json({
        error: true,
        message: "the provided array input is more than the actual array"
      })
    }

  for (let i = 0; i < updated_information.material.length; i++) {
    let findMaterialID = false;
    for (let j = 0; j < videos.available_courses[course_index].material.length; j++) {
      if (updated_information.material[i].material_id == 
          videos.available_courses[course_index].material[j].material_id) {
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


// We dont know the course id when looking for the Material id.
// We also dont need a local variable videoURL, it can be returned as a result of the if statement
router.get("/:material_ID/material", (req, res) => { //"/course/?course_ID/material/?material_ID" /course/coure_ID=1/material/
  const material_ID = req.params.material_ID;

  //const material_ID = req.query.material_ID

  // TODO(Geoff): Look for ways to not use a nested.
  // Nested for loops is not best practice.
  // theres nothing stopping this for loop. Imagine what 10000 courses would be like.

  videos.available_courses.forEach(course => {
    course.material.forEach(material => {
      if (material.material_id == material_ID) {
        return res.status(200).json({
          video_url: material.material_video
        });
      }
    });
  });

  return res.status(404).json({
    error: true,
    message: "Module video not found",
  })
});

/* View all available learning modules */
router.get("/viewAll", function (req, res, next) {
  return res.json({
    "available courses": videos.available_courses,
  });
});

/* View content of learning module */
router.get("/:moduleID/viewContent", auth, function (req, res, next) {
  
  const module_ID = req.params.moduleID;

  let found = false;

  foundCourse = videos.available_courses.find(c => c.course_id == module_ID);
  found = !!foundCourse;

  if (found) {
    return res.status(200).json({
      module_information: foundCourse
    });
  }

  if (!found) {
    res.status(404).json({
      error: true,
      message: "Module not found",
    });
  }
});

module.exports = router;

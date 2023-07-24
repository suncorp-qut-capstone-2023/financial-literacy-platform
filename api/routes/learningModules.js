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
      if (course_information.available_courses[i] == course_id) {
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

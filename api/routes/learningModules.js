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

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


// We dont know the course id when looking for the Material id.
// We also dont need a local variable videoURL, it can be returned as a result of the if statement
router.get("/:material_ID/material", (req, res) => {
  const material_ID = req.params.material_ID;

  let videoURL = "";

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
  });


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

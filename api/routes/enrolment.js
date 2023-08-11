const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth.js');


const {
  registerCourse,
  attendedLecture,
  viewedMaterial,
  attemptedQuiz
} = require('../controller/enrolmentController.js')


router.post("/course/register", auth, registerCourse);

router.post("/lectures/attended", auth, attendedLecture);

router.post("/materials/viewed", auth, viewedMaterial);

router.post("/quizzes/attempted", auth, attemptedQuiz);

module.exports = router;

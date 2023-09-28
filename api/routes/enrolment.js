const express = require("express");
const router = express.Router();
const auth = require('../middleware/auth.js');

const {
  registerCourse,
  attendedLecture,
  viewedMaterial,
  attemptedQuiz,
  addInterest,
  removeInterest
} = require('../controller/enrolmentController.js')

router.post("/course/register", auth, registerCourse);

router.post("/quizzes/attempted", auth, attemptedQuiz);

router.post("/interests/add", auth, addInterest);

router.post("/interests/remove", auth, removeInterest);


module.exports = router;

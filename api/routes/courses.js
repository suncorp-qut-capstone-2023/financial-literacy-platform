const express = require("express");
const auth = require("../middleware/auth.js");
const router = express.Router();

const {
  getAllCourses,
  getCourse,
  getModule,
  getQuiz,
  createCourse,
  createModule,
  createQuiz,
  updateCourse,
  updateModule,
  updateQuiz,
  deleteCourse,
  deleteModule,
  deleteQuiz,
} = require("../controller/coursesController.js");

router.get("/", auth, getAllCourses);

router.get("/:courseID", auth, getCourse);
router.get("/:courseID/:moduleID", auth, getModule);
router.get("/:courseID/:moduleID/:quizID", auth, getQuiz);

// TODO: Uncomment these routes when you have implemented the corresponding functions in the controller
// router.post('/:courseID', auth, createCourse);
// router.post('/:courseID/:moduleID', auth, createModule);
// router.post('/:courseID/:moduleID/:quizID', auth, createQuiz);
//
//
// router.put('/:courseID', auth, updateCourse);
// router.put('/:courseID/:moduleID', auth, updateModule);
// router.put('/:courseID/:moduleID/:quizID', auth, updateQuiz);
//
// router.delete('/:courseID', auth, deleteCourse);
// router.delete('/:courseID/:moduleID', auth, deleteModule);
// router.delete('/:courseID/:moduleID/:quizID', auth, deleteQuiz);

module.exports = router;

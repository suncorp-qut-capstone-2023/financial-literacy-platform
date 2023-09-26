const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getAllCourses,
    getCourse,
    getModule,
    getQuiz,
    createCourse,
    createModule,
    createQuiz,
    updateData,
    updateModule,
    updateQuiz,
    deleteData,
    deleteModule,
    deleteQuiz,
    createLecture,
    createLectureContent,
    createMaterial,
    createQuizQuestions,
    sortNewestModule
} = require('../controller/coursesController.js');

router.get('/', auth, getAllCourses);

//router.get('/:courseID', auth, getCourse);
router.get('/:ID', auth, getCourse);
router.get('/:courseID/:moduleID', auth, getModule);
router.get('/:courseID/:moduleID/:quizID', auth, getQuiz);

// TODO: Uncomment these routes when you have implemented the corresponding functions in the controller
router.post('/course', auth, createCourse);
router.post('/lecture', auth, createLecture);
router.post('/lecture/content', auth, createLectureContent);
router.post('/material', auth, createMaterial);
router.post('/module', auth, createModule);
router.post('/quiz', auth, createQuiz);
router.post('/quiz/questions', auth, createQuizQuestions);
// router.post('/:courseID/:moduleID', auth, createModule);
// router.post('/:courseID/:moduleID/:quizID', auth, createQuiz);
//
//
router.put('/update', auth, updateData);
// router.put('/:courseID/:moduleID', auth, updateModule);
// router.put('/:courseID/:moduleID/:quizID', auth, updateQuiz);
//

router.delete('/delete', auth, deleteData);
// router.delete('/:courseID', auth, deleteCourse);
// router.delete('/:courseID/:moduleID', auth, deleteModule);
// router.delete('/:courseID/:moduleID/:quizID', auth, deleteQuiz);

router.get('/course/sort', auth, sortNewestModule);

module.exports = router;
const express = require('express');
const auth = require('../middleware/auth.js');
const router = express.Router();

const {
    getAllCourses,
    getCourse,
    getLecture,
    getLectureContent,
    getMaterial,
    getModule,
    getQuiz,
    getQuizQuestions,
    createCourse,
    createLecture,
    createLectureContent,
    createMaterial,
    createModule,
    createQuiz,
    createQuizQuestions,
    updateCourse,
    updateLecture,
    updateLectureContent,
    updateMaterial,
    updateModule,
    updateQuiz,
    updateQuizQuestions,
    deleteCourse,
    deleteLecture,
    deleteLectureContent,
    deleteMaterial,
    deleteModule,
    deleteQuiz,
    deleteQuizQuestions,
    sortNewestModule
} = require('../controller/coursesController.js');

//get all data (course, lecture, lecture content, material, module, quiz, and quiz question)
router.get('/', auth, getAllCourses);

//get a specific data
router.get('/course/:ID', auth, getCourse);
router.get('/lecture/:ID', auth, getLecture);
router.get('/lecture/content/:ID', auth, getLectureContent);
router.get('/material/:ID', auth, getMaterial);
router.get('/module/:ID', auth, getModule);
router.get('/quiz/:ID', auth, getQuiz);
router.get('/quiz/question/:ID', auth, getQuizQuestions);

// all routes to create new data on the learning modules database
router.post('/create/course', auth, createCourse);
router.post('/create/lecture', auth, createLecture);
router.post('/create/lecture/content', auth, createLectureContent);
router.post('/create/material', auth, createMaterial);
router.post('/create/module', auth, createModule);
router.post('/create/quiz', auth, createQuiz);
router.post('/create/quiz/question', auth, createQuizQuestions);

//all routes to update existing data on the learning modules database
router.put('/update/course/:ID', auth, updateCourse);
router.put('/update/lecture/:ID', auth, updateLecture);
router.put('/update/lecture/content/:ID', auth, updateLectureContent);
router.put('/update/material/:ID', auth, updateMaterial);
router.put('/update/module/:ID', auth, updateModule);
router.put('/update/quiz/:ID', auth, updateQuiz);
router.put('/update/quiz/question/:ID', auth, updateQuizQuestions);

//all routes to delete existing data on the learning modules database
router.delete('/delete/course/:ID', auth, deleteCourse);
router.delete('/delete/lecture/:ID', auth, deleteLecture);
router.delete('/delete/lecture/content/:ID', auth, deleteLectureContent);
router.delete('/delete/material/:ID', auth, deleteMaterial);
router.delete('/delete/module/:ID', auth, deleteModule);
router.delete('/delete/quiz/:ID', auth, deleteQuiz);
router.delete('/delete/quiz/question/:ID', auth, deleteQuizQuestions);

//route to sort course based on the latest date to the oldest
router.get('/course/sort', auth, sortNewestModule);

module.exports = router;
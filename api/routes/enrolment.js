const express = require("express");
const router = express.Router();
const course_information = require("../course-information.json");
const user_registrations = require("../user-course-information.json");
const fs = require("fs");
const path = require("path");

function updateUserCourseInformationFile(res, successMessage) {
  const filePath = path.join(__dirname, '..', 'user-course-information.json');
  fs.writeFile(filePath, JSON.stringify(user_registrations, null, 2), (err) => {
    if (err) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error. Failed to save updates."
      });
    }

    res.status(200).json({
      message: successMessage
    });
  });
}


router.post("/course/register", (req, res) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  // Note: Timezone is always zero UTC offset, as denoted by the suffix " Z " for now
  const currentDate = new Date().toISOString();

  if (!userId || !courseId) {
    return res.status(400).json({
      error: true,
      message: "Both user_id and course_id are required."
    });
  }

  // Check for existing registration
  const existingRegistration = user_registrations.registrations.find(reg => reg.user_id === userId && reg.course_id === courseId);

  if (existingRegistration) {
    return res.status(400).json({
      error: true,
      message: "User is already registered to this course."
    });
  }

  const newRegistration = {
    user_id: userId,
    course_id: courseId,
    materials_viewed: [],
    lectures_attended: [],
    quizzes_attempted: [],
    completed: false,
    completion_date: null,
    expiration_date: null
    // expiration_date: new Date(currentDate.getTime() + (365 * 24 * 60 * 60 * 1000)).toISOString() // Here I'm adding 1 year, but can adjust to null.
  };

  // After adding the new registration to the in-memory representation
  user_registrations.registrations.push(newRegistration);

  // Write the updated registrations back to the JSON file
  //TODO(): Change directory to the correct one
  updateUserCourseInformationFile(res, `User with ID ${userId} has been registered to course ID ${courseId}`);
});

function checkCourseCompletion(userId, courseId) {
  // Find the user's registration for the specified course
  const registration = user_registrations.registrations.find(reg => reg.user_id === userId && reg.course_id === courseId);

  if (!registration) {
    return false; // No registration found
  }

  // Fetch the course information from the available_courses
  const courseInfo = course_information.available_courses.find(course => course.course_id === courseId);

  if (!courseInfo) {
    return false; // No course information found
  }

  // Check if all materials have been viewed
  if (courseInfo.material.length !== registration.materials_viewed.length) {
    return false;
  }

  // Check if all lectures have been attended
  if (courseInfo.lectures.length !== registration.lectures_attended.length) {
    return false;
  }

  // Check if all quizzes have been attempted
  if (courseInfo.quiz.length !== registration.quizzes_attempted.length) {
    return false;
  }

  // If all checks pass, mark the course as completed
  registration.completed = true;
  // Note: Timezone is always zero UTC offset, as denoted by the suffix " Z " for now
  registration.completion_date = new Date().toISOString();
  return true; // Course is marked as completed
}

router.post("/lectures/attended", (req, res) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  const lectureId = req.body.lecture_id;

  if (!userId || !courseId || !lectureId) {
    return res.status(400).json({
      error: true,
      message: "user_id, course_id, and lecture_id are required."
    });
  }

  const registration = user_registrations.registrations.find(reg => reg.user_id === userId && reg.course_id === courseId);

  if (!registration) {
    return res.status(404).json({
      error: true,
      message: "User is not registered for this course."
    });
  }

  if (registration.lectures_attended.includes(lectureId)) {
    return res.status(400).json({
      error: true,
      message: "Lecture already attended by the user for this course."
    });
  }

  registration.lectures_attended.push(lectureId);

  // Check course completion after marking a lecture as attended
  if (checkCourseCompletion(userId, courseId)) {
    updateUserCourseInformationFile(res, `Lecture with ID ${lectureId} has been marked as attended for user ID ${userId} in course ID ${courseId}. The course is now completed.`);
  } else {
    updateUserCourseInformationFile(res, `Lecture with ID ${lectureId} has been marked as attended for user ID ${userId} in course ID ${courseId}`);
  }
});


router.post("/materials/viewed", (req, res) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  const materialId = req.body.material_id;

  if (!userId || !courseId || !materialId) {
    return res.status(400).json({
      error: true,
      message: "user_id, course_id, and material_id are required."
    });
  }

  const registration = user_registrations.registrations.find(reg => reg.user_id === userId && reg.course_id === courseId);

  if (!registration) {
    return res.status(404).json({
      error: true,
      message: "User is not registered for this course."
    });
  }

  if (registration.materials_viewed.includes(materialId)) {
    return res.status(400).json({
      error: true,
      message: "Material already viewed by the user for this course."
    });
  }

  registration.materials_viewed.push(materialId);

  // Check course completion after marking a material as viewed
  if (checkCourseCompletion(userId, courseId)) {
    updateUserCourseInformationFile(res, `Material with ID ${materialId} has been marked as viewed for user ID ${userId} in course ID ${courseId}. The course is now completed.`);
  } else {
    updateUserCourseInformationFile(res, `Material with ID ${materialId} has been marked as viewed for user ID ${userId} in course ID ${courseId}`);
  }
});

router.post("/quizzes/attempted", (req, res) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  const quizId = req.body.quiz_id;

  if (!userId || !courseId || !quizId) {
    return res.status(400).json({
      error: true,
      message: "user_id, course_id, and quiz_id are required."
    });
  }

  const registration = user_registrations.registrations.find(reg => reg.user_id === userId && reg.course_id === courseId);

  if (!registration) {
    return res.status(404).json({
      error: true,
      message: "User is not registered for this course."
    });
  }

  if (registration.quizzes_attempted.includes(quizId)) {
    return res.status(400).json({
      error: true,
      message: "Quiz already attempted by the user for this course."
    });
  }

  registration.quizzes_attempted.push(quizId);

  // Check course completion after marking a quiz as attempted
  if (checkCourseCompletion(userId, courseId)) {
    updateUserCourseInformationFile(res, `Quiz with ID ${quizId} has been marked as attempted for user ID ${userId} in course ID ${courseId}. The course is now completed.`);
  } else {
    updateUserCourseInformationFile(res, `Quiz with ID ${quizId} has been marked as attempted for user ID ${userId} in course ID ${courseId}`);
  }
});

module.exports = router;

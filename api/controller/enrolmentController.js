const course_information = require("../course-information.json");
const User = require("../models/user.js");
const Enrolment = require("../models/enrolment");

const addInterest = async (req, res) => {
  const userId = req.body.user_id;
  const interest = req.body.interest;

  try {
    let serializedInterests = await User.getInterestsFromDB(userId);

    let interests = serializedInterests ? JSON.parse(serializedInterests) : [];

    // Check if the interest already exists
    if (!interests.includes(interest)) {
      interests.push(interest);

      let updatedSerializedInterests = JSON.stringify(interests);
      await User.updateInterestsInDB(userId, updatedSerializedInterests);

      res.status(200).json({
        message: `Interest ${interest} added for user ID ${userId}.`,
      });
    } else {
      res.status(400).json({
        error: true,
        message: `Interest ${interest} already exists for user ID ${userId}.`,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
};

const removeInterest = async (req, res) => {
  const userId = req.body.user_id;
  const interest = req.body.interest;

  try {
    let serializedInterests = await User.getInterestsFromDB(userId);

    let interests = serializedInterests ? JSON.parse(serializedInterests) : [];

    if (interests.includes(interest)) {
      // Remove the interest
      interests = interests.filter((int) => int !== interest);

      let updatedSerializedInterests = JSON.stringify(interests);
      await User.updateInterestsInDB(userId, updatedSerializedInterests);

      res.status(200).json({
        message: `Interest ${interest} removed for user ID ${userId}.`,
      });
    } else {
      res.status(400).json({
        error: true,
        message: `Interest ${interest} doesn't exist for user ID ${userId}.`,
      });
    }
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "Internal Server Error.",
    });
  }
};

// TODO: redundant. migrate or remove
// function checkCourseCompletion(userId, courseId) {
//   // Find the user's registration for the specified course
//   const registration = user_registrations.registrations.find(
//     (reg) => reg.user_id === userId && reg.course_id === courseId
//   );

//   if (!registration) {
//     return false; // No registration found
//   }

//   // Fetch the course information from the available_courses
//   const courseInfo = course_information.available_courses.find(
//     (course) => course.course_id === courseId
//   );

//   if (!courseInfo) {
//     return false; // No course information found
//   }

//   // Check if all materials have been viewed
//   if (courseInfo.material.length !== registration.materials_viewed.length) {
//     return false;
//   }

//   // Check if all lectures have been attended
//   if (courseInfo.lectures.length !== registration.lectures_attended.length) {
//     return false;
//   }

//   // Check if all quizzes have been attempted
//   if (courseInfo.quiz.length !== registration.quizzes_attempted.length) {
//     return false;
//   }

//   // If all checks pass, mark the course as completed
//   registration.completed = true;
//   // Note: Timezone is always zero UTC offset, as denoted by the suffix " Z " for now
//   registration.completion_date = new Date().toISOString();
//   return true; // Course is marked as completed
// }

const registerCourse = async (req, res, next) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  // Note: Timezone is always zero UTC offset, as denoted by the suffix " Z " for now
  const currentDate = new Date().toISOString();

  if (!userId || !courseId) {
    return res.status(400).json({
      error: true,
      message: "Both user_id and course_id are required.",
    });
  }
  try {
    // Check for existing registration
    const existingRegistration = await Enrolment.checkenrol(userId, courseId);

    if (existingRegistration) {
      return res.status(400).json({
        error: true,
        message: "User is already registered to this course.",
      });
    }

    const enrolmentData = {
      user_id: userId,
      course_id: courseId,
      enrolled: 1,
      completion_date: null,
      expiration_date: null,
    };

    // After adding the new registration to the in-memory representation
    const registration_id = await Enrolment.enrol(enrolmentData);

    res.status(201).json({
      message: "User Enrolled",
      registration_id: registration_id[0],
    });
  } catch (error) {
    next(error);
  }
};

const attemptedQuiz = async (req, res, next) => {
  const userId = req.body.user_id;
  const courseId = req.body.course_id;
  const quizId = req.body.quiz_id;
  const score = req.body.score;
  const feedback = req.body.feedback;

  if (!userId || !courseId || !quizId) {
    return res.status(400).json({
      error: true,
      message: "user_id, course_id, and quiz_id are required.",
    });
  }

  try {
    const registration = await Enrolment.checkenrol(userId, courseId);

    if (!registration) {
      return res.status(404).json({
        error: true,
        message: "User is not registered for this course.",
      });
    }


    // TODO: Figure out if we want to keep this
    // if (registration.quizzes_attempted.includes(quizId)) {
    //   return res.status(400).json({
    //     error: true,
    //     message: "Quiz already attempted by the user for this course.",
    //   });
    // }

    try {
      attempdata = {
        quiz_id: quizId,
        score: score,
        feedback: feedback,
      };

      const attempted = await Enrolment.addQuizAttempt(attempdata);
      res.status(201).json({
        message: "User attempted quiz",
        registration_id: attempted[0],
      });
    } catch (error) {
      next(error);
    }

    // TODO: Check course completion after marking a quiz as attempted
    // if (checkCourseCompletion(userId, courseId)) {
    //   updateUserCourseInformationFile(
    //     res,
    //     `Quiz with ID ${quizId} has been marked as attempted for user ID ${userId} in course ID ${courseId}. The course is now completed.`
    //   );
    // } else {
    //   updateUserCourseInformationFile(
    //     res,
    //     `Quiz with ID ${quizId} has been marked as attempted for user ID ${userId} in course ID ${courseId}`
    //   );
    // }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerCourse,
  attemptedQuiz,
  addInterest,
  removeInterest,
};

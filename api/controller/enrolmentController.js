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

async function checkCourseCompletion(userId, courseId) {
  try {
    const registration = await CourseModel.findRegistration(userId, courseId);
    
    if (!registration) {
      return false;
    }

    const totalQuizzes = await CourseModel.countTotalQuizzes(courseId);
    const attemptedQuizzes = await CourseModel.countAttemptedQuizzes(registration.registration_id);

    if (totalQuizzes[0].total !== attemptedQuizzes[0].total) {
      return false;
    }

    await CourseModel.markCourseCompleted(registration.registration_id);
    return true;
  } catch (err) {
    throw new Error("Error checking course completion: " + err.message);
  }
}


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
    const registration_id = await Enrolment.enrol(enrolmentData);

    res.status(201).json({
      message: "User Enrolled",
      registration_id: registration_id[0],
    });
  } catch (error) {
    next(error);
  }
};

const EnrolmentModel = require('./EnrolmentModel.js');
const checkCourseCompletion = require('./checkCourseCompletion.js');

const attemptedQuiz = async (req, res, next) => {
  const { user_id: userId, course_id: courseId, quiz_id: quizId, score, feedback } = req.body;

  if (!userId || !courseId || !quizId) {
    return res.status(400).json({
      error: true,
      message: "user_id, course_id, and quiz_id are required.",
    });
  }

  try {
    const registration = await EnrolmentModel.checkenrol(userId, courseId);

    if (!registration) {
      return res.status(404).json({
        error: true,
        message: "User is not registered for this course.",
      });
    }

    // TODO: If you want to check if a quiz has already been attempted, rework logic

    const attemptData = { quiz_id: quizId, score, feedback };

    const attempted = await EnrolmentModel.addQuizAttempt(attemptData);

    if (await checkCourseCompletion(userId, courseId)) {
      await CourseModel.markCourseCompleted(registration.registration_id);
      
      // Course complete
      return res.status(200).json({
        message: "Congratulations on finishing the course!",
        registration_id: registration.registration_id,
      });
    }
    

    res.status(201).json({
      message: "User attempted quiz",
      registration_id: attempted[0],
    });
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

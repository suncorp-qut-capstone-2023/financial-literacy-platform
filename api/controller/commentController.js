const { start } = require("repl");
const course_comments = require("../course-comments.json");

/**
 * Takes an array from comments starting at [startIndex] and 
 * ending at startIndex + 9 for pagination purposes
 * @param {number} startIndex 
 */
function splitArray(courseId, lectureId, startIndex) {
    return course_comments.courses.find((course) => {
        course.course_id === courseId && 
        course.lectures.lecture_id === lectureId;
    }).comments.slice(startIndex, startIndex + 9)
}


const getComments = async (req, res) => {
    const courseId = req.body.course_id;
    const lectureId = req.body.lecture_id;
    const startIndex = req.body.startIndex;

    const comments = splitArray(courseId, lectureId, startIndex);

    res.status(200).json(comments);
}
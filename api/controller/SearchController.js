const axios = require("axios");
const course_information = require("../course-information.json");

//TODO: create one FindController.js to be connected with every find functions
function FindCourseIndex(course_ID) {
  for (let i = 0; i < course_information.available_courses.length; i++) {
    if (course_information.available_courses[i].course_id == course_ID) {
      return i;
    }
  }

  return -1;
}

function SearchRegex(regex, input) {
  const pattern = new RegExp(`^${regex}`, 'i'); // The 'i' flag makes the match case-insensitive
  const result = pattern.exec(input);
  return result;
}

const searchModule = (req, res) => {
    const regex = req.body.search_query; //search input query to be search for

    //keep track of match modules
    let matchModules = [];
  
    axios
    .get('http://127.0.0.1:443/api/learningModules')
    .then((response) => {

      //compare the search input query with the available courses name
      response.data.available_courses.find(course => {
        const courseName = course.course_name;
        const result = SearchRegex(regex, courseName);

        if (result) {
            matchModules.push(course); // Include the course if match
        }
      });
  
      //check if module has been found or not
      if (matchModules.length === 0) {
        return res.status(404).json({
          "error": true,
          "message": "no module with the provided module name has been found"
        })
      } else {
        //TODO: add more result (but empty result is fine so wait until unit testing)
        return res.status(200).json({
          "error": false,
          "message": "one or several modules has been found",
          "module": matchModules
        })        
      }
    })
    .catch((error) => {
      return res.status(400).json({
        "error": true,
        "message": "Learning modules endpoint is not working"
      })  
    });
};

const addTag = async (req, res) => {
    const newTag = req.body.new_tag;
    const courseId = req.body.course_id;

    courseIdIndex = FindCourseIndex(courseId);

    const similarTag = course_information.available_courses[courseIdIndex].course_tag.find(tag => tag === newTag);

    if (similarTag !== undefined) {
      return res.status(400).json({
        "success": false,
        "error": true,
        message: `the new tag has already been included on course ID ${courseId}`
      })   
    } else {
      course_information.available_courses[courseIdIndex].course_tag.push(newTag);
      
      return res.status(200).json({
          "success": true,
          message: `new tag has been added to course ID ${courseId}`
        })      
    }


};

const deleteTag = async (req, res) => {
  const courseId = req.body.course_id;
  const deleteTag = req.body.delete_tag;

  courseIdIndex = FindCourseIndex(courseId);

  //search through the database
  await axios
  .get('http://127.0.0.1:443/api/learningModules')
  .then((response) => {

    const course = response.data.available_courses.find(course => course.course_id === courseId );

    if (course === undefined) {
      return res.status(404).json({
        "success": false,
        "error": true,
        message: `course ID ${courseId} is not available`
      }) 
    }

    const courseTag = course.course_tag.find( courseTag => courseTag === deleteTag );

    if (courseTag === undefined) {
      return res.status(404).json({
        "success": false,
        "error": true,
        message: `current tag with the name '${deleteTag}' has been not been found`
      }) 
    } else {
      //TODO: in cloud development, 
      //later we need to modify the file and put it back to the learning modules database.
      //at the moment, this is the solution first.
      course_information.available_courses[courseIdIndex].course_tag.pop(deleteTag);

      return res.status(200).json({
          "success": true,
          message: `new tag has been added to course ID ${courseId}`
      })      
    }
  })
};

const searchTag = async (req, res) => {
  const searchQuery = req.body.search_query;

  //search through the database
  await axios
  .get('http://127.0.0.1:443/api/learningModules')
  .then((response) => {

    let tagCounts = {};
    let sortDataResult = [];

    for (let i = 0; i < response.data.available_courses.length; i++) {
      const courseID = String(response.data.available_courses[i].course_id);
      tagCounts[courseID] = 0;

      response.data.available_courses[i].course_tag.find( courseTag => {

        const match = SearchRegex(searchQuery, courseTag);
        
        if (match !== null) {
          tagCounts[`${response.data.available_courses[i].course_id}`]++;
        }
      })      
    }

    const tagCountArray = Object.entries(tagCounts);

    for (const [index, [key, value]] of tagCountArray.entries()) {
      if (value === 0) {
        tagCountArray.splice(index, 1);
        delete tagCounts[key];
        break;
      }
    }

    // Sort the array based on the values
    tagCountArray.sort((a, b) => b[1] - a[1]);

    tagCountArray.find(tagData => {
      const index = FindCourseIndex(tagData[0]);

      sortDataResult.push(response.data.available_courses[index]);
    })

    return res.status(200).json({
      "success": true,
      "result": sortDataResult
    })     
        
  })
};

module.exports = {
    searchModule,
    addTag,
    deleteTag,
    searchTag
};

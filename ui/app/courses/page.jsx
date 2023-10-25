"use client";

import { useEffect, useState, useContext } from "react";
import styles from "@/styles/page.module.css";
import CourseOverview from "@/components/courseOverview";
import Loading from "@/components/loading";
import { Box } from "@mui/material";

import { AuthContext } from "@/app/auth.jsx";

// imports for create pop up
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  // constants for create pop up
  const [open, setOpen] = useState(false);
  const [courseName, setCourseName] = useState("");
  const [categoryType, setCategoryType] = useState("");

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://jcmg-api.herokuapp.com/api/courses",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      const data = await response.json();
      setCourses(data.course);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching courses data:", error);
    }
  };

  // A function to handle when a course is removed.
  const handleCourseRemoved = async (removedCourseId) => {
    const updatedCourses = courses.filter(
      (course) => course.course_id !== removedCourseId
    );
    setCourses(updatedCourses);
  };

  const handleCreateCourse = async () => {
    try {
      const response = await fetch(
        "https://jcmg-api.herokuapp.com/api/course/create",
        {
          method: "POST",
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            course_name: courseName, // fetch values from some input field or form
            category_type: categoryType,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        // If you wish, you can add the new course to your courses array using setCourses
        fetchData(); // Refresh the course list
      } else {
        console.error("Failed to create course. Status:", response.status);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
    // close dialog after attempting course creation
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    fetchData(); // Call fetchData during initial render
  }, [authToken, userType]);

  useEffect(() => {
    console.log("Courses updated:", courses);
  }, [courses]);

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Courses</h1>
          {userType === "admin" && (
            <>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
              >
                Create
              </Button>
              <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Create a New Course</DialogTitle>
                <DialogContent>
                  <TextField
                    autoFocus
                    margin="dense"
                    label="Course Name"
                    type="text"
                    fullWidth
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                  />
                  <TextField
                    margin="dense"
                    label="Category Type"
                    type="text"
                    fullWidth
                    value={categoryType}
                    onChange={(e) => setCategoryType(e.target.value)}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateCourse} color="primary">
                    Create
                  </Button>
                </DialogActions>
              </Dialog>
            </>
          )}
        </div>
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          className={styles.courseCardBox}
        >
          {isLoading ? (
            <Loading />
          ) : Array.isArray(courses) && courses.length > 0 ? (
            courses.map((course) => (
              // CMS functionality conditionally rendered here
              <CourseOverview
                key={course.COURSE_ID || course.course_id}
                courseId={course.COURSE_ID || course.course_id}
                courseName={course.COURSE_NAME || course.course_name}
                thumbnail={course.COURSE_THUMBNAIL}
                cms={userType === "admin"}
                onCourseRemoved={handleCourseRemoved}
                refreshCourses={fetchData} // Pass fetchData as a prop
              />
            ))
          ) : (
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              className={styles.courseCardBox}
            >
              No Courses Available
            </Box>
          )}
        </Box>
      </div>
    </main>
  );
}

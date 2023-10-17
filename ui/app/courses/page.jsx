"use client";

import { useEffect, useState, useContext } from "react";
import styles from "@/styles/page.module.css";
import CourseOverview from "@/components/courseOverview";
import Loading from "@/components/loading";
import { Box } from "@mui/material";
import { AuthContext } from "@/app/auth.jsx";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  // A function to handle when a course is removed.
  const handleCourseRemoved = (removedCourseId) => {
    const updatedCourses = courses.filter(
      (course) => course.course_id !== removedCourseId
    );
    setCourses(updatedCourses);
  };

  useEffect(() => {
    async function fetchData() {
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
    }
    fetchData();
  }, [authToken, userType]);

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Courses</h1>
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
              />
            ))
          ) : (
            <p>No courses available</p>
          )}
        </Box>
      </div>
    </main>
  );
}

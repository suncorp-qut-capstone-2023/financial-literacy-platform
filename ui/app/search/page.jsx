"use client";

import styles from "@/styles/page.module.css";
import SearchBar from "@/components/searchBar";
import CourseOverview from "@/components/courseOverview";
import Loading from "@/components/loading";
import { Box } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "@/app/auth.jsx";

export default function SearchResults() {
  const searchParams = useSearchParams();
  let q = searchParams.get("q");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  // Escape any special charaters that may cause issues building the regex
  RegExp.quote = function (str) {
    return str.replace(/([.?*+^$[\]\\(){}|-])/g, "\\$1");
  };
  let regex = new RegExp(RegExp.quote(q), "i"); // "i" makes the search case insensitive

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

  let filteredCourses = courses.filter((course) => {
    let courseName = course.COURSE_NAME || course.course_name;
    return courseName && regex.test(courseName);
  });

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Search Results</h1>
        </div>
        <SearchBar sx={{ marginTop: "2rem", marginBottom: 0 }} query={q} />
        <Box
          display="flex"
          flexWrap="wrap"
          alignItems="center"
          justifyContent="center"
          className={styles.courseCardBox}
        >
          {isLoading ? (
            <Loading />
          ) : Array.isArray(filteredCourses) && filteredCourses.length > 0 ? (
            filteredCourses.map((course) => (
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
            <p>No courses matched that search query, please try again.</p>
          )}
        </Box>
      </div>
    </main>
  );
}

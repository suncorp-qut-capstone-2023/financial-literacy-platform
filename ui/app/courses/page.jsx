"use client";

import { useEffect, useState } from "react";
import styles from "@/styles/page.module.css";
import CourseOverview from "@/components/courseOverview";
import Loading from "@/components/loading";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://jcmg-api.herokuapp.com/api/courses" // Adjust this URL if it has changed
        );
        const data = await response.json();
        setCourses(data.course);  // Adjusted to the new data structure
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Courses</h1>
        </div>
        {isLoading ? (
          <Loading />
        ) : (
          courses.map((course) => (
            <CourseOverview
              key={course.COURSE_ID}
              courseId={course.COURSE_ID}
              courseName={course.COURSE_NAME}
            />
          ))
        )}
      </div>
    </main>
  );
}

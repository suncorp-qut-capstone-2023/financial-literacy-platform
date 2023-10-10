"use client";

import { useEffect, useState, useContext } from "react";
import styles from "@/styles/page.module.css";
import Loading from "@/components/loading";
import Header from "@/components/header";
import CourseOverview from "@/components/courseOverview";
import { AuthContext } from './auth.jsx';


export default function Home() {
  const [courses, setCourses] = useState([]); // initialise state to store the courses data
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://jcmg-api.herokuapp.com/api/courses",
          {
            headers: {
              'Authorization': `Bearer ${authToken}`
            }
          }
        );
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        setCourses(data.course.slice(0, 3));
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    }
    fetchData();
  }, [authToken]);  

  return (
    <main className={styles.main}>
      <Header />
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Featured Courses</h1>
        </div>
        {isLoading ? (<Loading />) : (
          Array.isArray(courses) && courses.length > 0 ? courses.map((course) => (
          <CourseOverview
            key={course.COURSE_ID}
            courseId={course.COURSE_ID}
            courseName={course.COURSE_NAME}/>
            )) : (<p>No courses available</p>))
          }
      </div>
    </main>
  );
}
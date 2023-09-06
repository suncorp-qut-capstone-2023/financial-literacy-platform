"use client";
import { useState, useEffect } from 'react';
import styles from "@/styles/page.module.css";

export default function CoursePage({ params }) { 
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Use the specific endpoint to fetch the course with the provided ID
        const response = await fetch(`https://jcmg-api.herokuapp.com/api/learningModules/course?id=${params.courseId}`);
        const data = await response.json();
        
        setCourse(data.id); // The course details are nested inside an `id` key
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchData();
  }, [params.courseId]);

  // Return early if the course hasn't been fetched yet
  if (!course) return <div>Loading...</div>;

  console.log("Course Page is being accessed!");

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>{course.course_name}</h1>
          {/* Add other course details here, e.g., course_last_updated, course_tag, etc. */}
          <p>Last Updated: {new Date(course.course_last_updated.value).toLocaleDateString()}</p>
        </div>
      </div>
    </main>
  );
}

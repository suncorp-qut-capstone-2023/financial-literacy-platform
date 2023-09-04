"use client";

import { useEffect, useState } from 'react';
import styles from "@/styles/page.module.css";
import Header from "@/components/header";
import CourseOverview from '@/components/courseOverview';

export default function Home() {
  const [courses, setCourses] = useState([]); // initialise state to store the courses data

  useEffect(() => {
    // Fetching the data when the component mounts
    async function fetchData() {
      try {
        const response = await fetch("https://jcmg-api.herokuapp.com/api/learningModules");
        const data = await response.json();
        setCourses(data.available_courses.slice(0, 3));  // setting state with the first three fetched courses
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    }

    fetchData();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
        <div className={styles.contentWrapper}>
          <div className={styles.description}>
            <h1 className={styles.title}>Featured Courses</h1>
          </div>
          {courses.map(course => {
            // Look for a thumbnail in the materials array
            const thumbnailItem = course.material.find(m => m.material_type === "thumbnail");
  
            // If a thumbnail is found, use its URL, otherwise use a default or fallback URL
            const thumbnailURL = thumbnailItem ? thumbnailItem.material_media : "no_thumbnail"; // replace with default or fallback URL if needed
  
            return (
              <CourseOverview
                key={course.course_id}
                courseId={course.course_id}
                courseName={course.course_name}
                lastUpdated={course.course_last_updated.value}
                materialsCount={course.material.length}
                lecturesCount={course.lectures.length}
                thumbnail={thumbnailURL} // Passing the thumbnail URL as a prop
              />
            );
          })}
        </div>
      </main>
  );
}

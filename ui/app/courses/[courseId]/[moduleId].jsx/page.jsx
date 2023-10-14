"use client";

import { useState, useEffect, useContext } from 'react';
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import LectureOverview from "@/components/lectureOverview"; // Import the new ModuleOverview component
import { AuthContext } from '@/app/auth.jsx';

export default function ModulePage({ params }) { 
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const url = `https://jcmg-api.herokuapp.com/api/course/module/lectures?courseID=${params.courseId}&moduleID=${params.moduleId}`;
        console.log("Fetching from URL:", url);  // Log the URL to check if course and module IDs are correct
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });

        if (!response.ok) {
          console.error("Error response from server:", response);
          return;  // If response is not ok, log the error and return
        }

        const data = await response.json();
        console.log("Data: ", data);
        setCourse(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchData();
  }, [params.courseId, params.moduleId, authToken]);

  // Check if course is defined, if not then render loading or some other content
  if (!course) {
    return <div>Module not found</div>; 
  }

  const lectures = course.modules?.[0]?.lectures;  // Adjust this according to your actual data structure

  // Return early if the module hasn't been fetched yet
  if (isLoading) return (
    <main className={styles.main}>
    <div className={styles.contentWrapper}>
      <div className={styles.description}>
      <Loading />
      </div>
    </div>
  </main>
  );

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>{course && course.COURSE_NAME}</h1>

          {/* Updated Section for Lectures */}
          {lectures && lectures.length > 0 && (
            <div className={styles.modulesSection}>
              <h2>Lectures</h2>
              {lectures.map((lecture) => (
                <LectureOverview
                  key={lecture.LECTURE_ID} 
                  lectureId={lecture.LECTURE_ID}
                  lectureName={lecture.LECTURE_NAME} 
                  onLectureRemoved={handleLectureRemoved} // make sure this function is defined
                  cms = {userType === 'admin'}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

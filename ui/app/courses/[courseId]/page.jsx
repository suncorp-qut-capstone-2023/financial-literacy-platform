"use client";
import { useState, useEffect, useContext } from 'react';
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import ModuleOverview from "@/components/ModuleOverview"; // Import the new ModuleOverview component
import { AuthContext } from '../../auth.jsx';

export default function CoursePage({ params }) { 
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);
  
  useEffect(() => {
    async function fetchData() {
      try {
        // Use the specific endpoint to fetch the course with the provided ID
        const response = await fetch(`https://jcmg-api.herokuapp.com/api/course?courseID=${params.courseId}`,{
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        const data = await response.json();
        console.log("Data: ", data)
        setCourse(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchData();
  }, [params.courseId, authToken]);

  // Return early if the course hasn't been fetched yet
  if (isLoading) return <Loading />;

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>{course && course.COURSE_NAME}</h1>

          {/* Updated Section for Modules */}
          {course && course.modules && course.modules.length > 0 && (
            <div className={styles.modulesSection}>
              <h2>Modules</h2>
              {course.modules.map((module) => (
                <ModuleOverview 
                  key={module.MODULE_ID} 
                  courseId={params.courseId}
                  moduleId={module.MODULE_ID} 
                  moduleName={module.MODULE_NAME} 
                  onModuleRemoved={null}
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

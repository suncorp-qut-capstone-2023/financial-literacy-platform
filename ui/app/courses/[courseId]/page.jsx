"use client";
import { useState, useEffect, useContext } from "react";
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import ModuleOverview from "@/components/ModuleOverview"; // Import the new ModuleOverview component
import { AuthContext } from "../../auth.jsx";
import { Box } from "@mui/material";

export default function CoursePage({ params }) {
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken, userType } = useContext(AuthContext); // Combine into one useContext call

  const handleModuleRemoved = (removedModuleId) => {
    if (course && course.modules) {
      const updatedModules = course.modules.filter(
        (module) => module.MODULE_ID !== removedModuleId
      );
      setCourse((prevCourse) => ({
        ...prevCourse,
        modules: updatedModules,
      }));
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(params.courseId);
        const response = await fetch(
          `https://jcmg-api.herokuapp.com/api/course?courseID=${params.courseId}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        console.log("Data: ", data);
        setCourse(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchData();
  }, [params.courseId, authToken]);

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>{course && course.COURSE_NAME}</h1>
          {isLoading ? (
            <Loading />
          ) : course && course.modules && course.modules.length > 0 ? (
            <div className={styles.modulesSection}>
              <h2 className={styles.subtitle}>Modules</h2>
              <Box
                display="flex"
                flexWrap="wrap"
                alignItems="center"
                justifyContent="center"
                className={styles.courseCardBox}
              >
                {course.modules.map((module) => (
                  <ModuleOverview
                    key={module.MODULE_ID}
                    courseId={course.COURSE_ID}
                    moduleId={module.MODULE_ID}
                    moduleName={module.MODULE_NAME}
                    onModuleRemoved={handleModuleRemoved}
                    cms={userType === "admin"}
                  />
                ))}
              </Box>
            </div>
          ) : (
            <p>No modules available</p>
          )}
        </div>
      </div>
    </main>
  );
}

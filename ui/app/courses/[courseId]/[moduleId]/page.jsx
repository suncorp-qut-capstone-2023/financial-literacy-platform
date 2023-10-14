"use client";

import { useState, useEffect, useContext } from "react";
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import LectureOverview from "@/components/lectureOverview"; // Import the new ModuleOverview component
import QuizOverview from "@/components/quizOverview"; // Import the new ModuleOverview component
import { AuthContext } from "@/app/auth.jsx";
import { Box, Grid } from "@mui/material";

export default function ModulePage({ params }) {
  const [lectures, setLectures] = useState(null);
  const [quizzes, setQuizzes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  useEffect(() => {
    async function fetchLectures() {
      try {
        const url = `https://jcmg-api.herokuapp.com/api/course/module/lectures?courseID=${params.courseId}&moduleID=${params.moduleId}`;
        console.log("Fetching from URL:", url); // Log the URL to check if course and module IDs are correct

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          console.error("Error response from server:", response);
          return; // If response is not ok, log the error and return
        }

        const data = await response.json();
        console.log("Data: ", data);
        setLectures(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    async function fetchQuizzes() {
      try {
        const url = `https://jcmg-api.herokuapp.com/api/course/module/quizzes?moduleID=${params.moduleId}`;
        console.log("Fetching from URL:", url); // Log the URL to check if course and module IDs are correct

        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          console.error("Error response from server:", response);
          return; // If response is not ok, log the error and return
        }

        const data = await response.json();
        console.log("Data: ", data);
        setQuizzes(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchLectures();
    fetchQuizzes();
  }, [params.courseId, params.moduleId, authToken]);

  // Check if course is defined, if not then render loading or some other content
  if (!lectures) {
    return <div>Module not found</div>;
  }

  // Return early if the module hasn't been fetched yet
  if (isLoading)
    return (
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
          <h1 className={styles.title}>{lectures && lectures.COURSE_NAME}</h1>
          <Grid container>
            <Grid xs={12} md={6}>
              {/* Updated Section for Lectures */}
              {lectures && lectures.length > 0 ? (
                <div className={styles.modulesSection}>
                  <h2 className={styles.subtitle}>Lectures</h2>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.courseCardBox}
                  >
                    {lectures.map((lecture) => (
                      <LectureOverview
                        key={lecture.LECTURE_ID}
                        lectureId={lecture.LECTURE_ID}
                        lectureName={lecture.LECTURE_NAME}
                        // onLectureRemoved={handleLectureRemoved} // make sure this function is defined
                        cms={userType === "admin"}
                      />
                    ))}
                  </Box>
                </div>
              ) : (
                "No Lectures for this Module"
              )}
            </Grid>
            <Grid xs={12} md={6}>
              {/* Updated Section for Quizzes */}
              {quizzes && quizzes.length > 0 ? (
                <div className={styles.modulesSection}>
                  <h2 className={styles.subtitle}>Quizzes</h2>
                  <Box
                    display="flex"
                    flexWrap="wrap"
                    alignItems="center"
                    justifyContent="center"
                    className={styles.courseCardBox}
                  >
                    {quizzes.map((quiz) => (
                      <QuizOverview
                        key={quiz.QUIZ_ID}
                        quizId={quiz.QUIZ_ID}
                        quizName={quiz.QUIZ_NAME}
                        // onLectureRemoved={handleLectureRemoved} // make sure this function is defined
                        cms={userType === "admin"}
                      />
                    ))}
                  </Box>
                </div>
              ) : (
                "No Quizzes for this module"
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </main>
  );
}

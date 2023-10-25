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

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>{lectures && lectures.COURSE_NAME}</h1>
          <Grid container>
            <Grid xs={12} md={6}>
              {/* Updated Section for Lectures */}
              {isLoading ? (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  className={styles.courseCardBox}
                >
                  <Loading />
                </Box>
              ) : lectures && lectures.length > 0 ? (
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
                        courseId={params.courseId}
                        moduleId={params.moduleId}
                        lectureId={lecture.LECTURE_ID}
                        lectureName={lecture.LECTURE_NAME}
                        // onLectureRemoved={handleLectureRemoved} // make sure this function is defined
                        cms={userType === "admin"}
                      />
                    ))}
                  </Box>
                </div>
              ) : (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  className={styles.courseCardBox}
                >
                  No Lectures for this Module
                </Box>
              )}
            </Grid>
            <Grid xs={12} md={6}>
              {/* Updated Section for Quizzes */}
              {isLoading ? (
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  className={styles.courseCardBox}
                >
                  <Loading />
                </Box>
              ) : quizzes && quizzes.length > 0 ? (
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
                <Box
                  display="flex"
                  flexWrap="wrap"
                  alignItems="center"
                  justifyContent="center"
                  className={styles.courseCardBox}
                >
                  No Quizzes for this Module
                </Box>
              )}
            </Grid>
          </Grid>
        </div>
      </div>
    </main>
  );
}

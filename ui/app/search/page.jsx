"use client";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import SearchBar from "@/components/searchBar";
import CourseOverview from "@/components/courseOverview";
import { CircularProgress } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

const theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#000000",
    },
  },
});

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  let searchQuery = {
    search_query: query,
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          "https://jcmg-api.herokuapp.com/api/learningModules/search",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(searchQuery),
          }
        );

        const data = await response.json();
        setCourses(data.module);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <main className={styles.main}>
        <div className={styles.contentWrapper}>
          <div className={styles.description}>
            <h1 className={styles.title}>Search Results</h1>
          </div>
          <SearchBar
            sx={{ marginTop: "2rem", marginBottom: 0 }}
            query={query}
          />
            {isLoading ? (
              <div
                styles={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <CircularProgress
                  color="suncorpgreen"
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                  }}
                />
              </div>
            ) : (
              courses.map((course) => {
                // Look for a thumbnail in the materials array
                const thumbnailItem = course.material.find(
                  (m) => m.material_type === "thumbnail"
                );

                // If a thumbnail is found, use its URL, otherwise use a default or fallback URL
                const thumbnailURL = thumbnailItem
                  ? thumbnailItem.material_media
                  : "no_thumbnail"; // replace with default or fallback URL if needed

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
              })
            )}
        </div>
      </main>
    </ThemeProvider>
  );
}

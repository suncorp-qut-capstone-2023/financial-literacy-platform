"use client";

import { useState, useEffect, useContext } from "react";
import Loading from "@/components/loading";
import styles from "@/styles/page.module.css";
import { AuthContext } from "@/app/auth.jsx";
import Article from "@/components/article";
import VideoPlayer from "@/components/videoplayer";
import Infographic from "@/components/infographic";

export default function MaterialPage({ params }) {
  const [material, setMaterial] = useState(null);
  const [content, setContent] = useState();
  const [mediaType, setMediaType] = useState();
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { authToken } = useContext(AuthContext);
  const { userType } = useContext(AuthContext);

  // From https://stackoverflow.com/a/47767860
  function get_url_extension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim();
  }

  useEffect(() => {
    async function fetchContent() {
      try {
        const url = `https://jcmg-api.herokuapp.com/api/course/module/lecture/content/media?materialID=${params.materialId}`;
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
        setMaterial(data);
        setMediaType(get_url_extension(data[0].MATERIAL_URL));
        setIsComplete(true);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    }

    fetchContent();
  }, [params.courseId, params.moduleId, authToken]);

  useEffect(() => {
    if (isComplete) {
      // Fetch the text at the URL
      fetch(material[0].MATERIAL_URL)
        .then((response) => {
          if (!response.ok) {
            setIsLoading(false);
            throw new Error("HTTP error " + response.status);
          }
          if (mediaType === "txt") {
            return response.text();
          } else {
            return response.blob();
          }
        })
        .then((content) => {
          setContent(content);
          setIsLoading(false);
        })
        .catch((error) => {
          setContent(error.message);
          console.error("Fetch error: ", error);
          setIsLoading(false);
        });
    }
  }, [isComplete]);

  // Check if course is defined, if not then render loading or some other content
  if (!material && !isLoading) {
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
          {mediaType === "txt" ? (
            <Article heading={material[0].MATERIAL_NAME} text={content} />
          ) : mediaType === "mov" ||
            mediaType === "mp4" ||
            mediaType === "webm" ? (
            <VideoPlayer heading={material[0].MATERIAL_NAME} src={content} />
          ) : mediaType === "jpg" ||
            mediaType === "jpeg" ||
            mediaType === "png" ||
            mediaType === "webp" ? (
            <Infographic heading={material[0].MATERIAL_NAME} src={content} />
          ) : (
            <Box
              display="flex"
              flexWrap="wrap"
              alignItems="center"
              justifyContent="center"
              className={styles.courseCardBox}
            >
              Media Unable to be Loaded
            </Box>
          )}
        </div>
      </div>
    </main>
  );
}

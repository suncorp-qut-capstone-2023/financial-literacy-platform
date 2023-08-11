"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import VideoOverview from "@/components/videoOverview";


export default function Articles(/* TODO: pass in some api call */) {

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <h1 className={styles.title}>Video Materials</h1>
      </div>
      
      <Grid container spacing={2}>
        <VideoOverview />
        <VideoOverview />
        <VideoOverview />
        <VideoOverview />
      </Grid>
    </main>
  );
}
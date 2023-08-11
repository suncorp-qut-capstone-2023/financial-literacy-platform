"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import Video from "@/components/video";

export default function Videos(/* TODO: pass in some api call */) {
  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Video Materials</h1>
        </div>

        <Grid container spacing={2}>
          <Video />
          <Video />
          <Video />
          <Video />
        </Grid>
      </div>
    </main>
  );
}

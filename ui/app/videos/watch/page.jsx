"use client";
import styles from "@/styles/page.module.css";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "@mui/material/Link";
import VideoPlayer from "@/components/videoplayer";

export default function Watch(/* TODO: pass in some api call */) {
  return (
    <main className={styles.main}>
      <Grid container spacing={1} className={styles.articleTitle}>
        <Grid xs={12}>
          <h1>The Political and Economical State of the World</h1>
        </Grid>
        <Grid xs={12}>
          <p>Credits: Jaden Smith</p>
          <p>Published: August 9, 2023</p>
          <p>Duration: 3 min.</p>
        </Grid>
      </Grid>

      <div className={styles.articleContent}>
        <VideoPlayer />
        <Grid container sx={{ marginTop: "20px" }}>
          <Grid xs={6}>
            <Link href="/videos/watch" underline="hover">
              <ArrowBackIcon />
              Previous Video
            </Link>
          </Grid>
          <Grid xs={6} sx={{ textAlign: "right" }}>
            <Link href="/videos/watch" underline="hover">
              Next Video
              <ArrowForwardIcon />
            </Link>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

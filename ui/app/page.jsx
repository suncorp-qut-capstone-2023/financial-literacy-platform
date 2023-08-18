"use client";

import styles from "@/styles/page.module.css";
import Header from "@/components/header"

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ArticleOverview from "@/components/articleOverview";

export default function Home() {
  return (
    <main className={styles.main}>
      <Header/>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
            <h1 className={styles.title}>Featured Articles</h1>
        </div>
      <Grid container spacing={2}>
          <ArticleOverview />
          <ArticleOverview />
          <ArticleOverview />
        </Grid>
      </div>
    </main>
  );
}

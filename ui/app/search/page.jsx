"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import ArticleOverview from "@/components/articleOverview";
import VideoOverview from "@/components/videoOverview";
import SearchBar from "@/components/searchBar";
import { useSearchParams } from "next/navigation";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Search Results</h1>
        </div>
        <SearchBar sx={{ marginTop: "2rem", marginBottom: 0 }} query={query} />
        <Grid container spacing={2}>
          <ArticleOverview />
          <VideoOverview />
          <ArticleOverview />
          <VideoOverview />
        </Grid>
      </div>
    </main>
  );
}

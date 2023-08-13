"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import ArticleOverview from "@/components/articleOverview";
import VideoOverview from "@/components/videoOverview";
import SearchBar from "@/components/searchBar";
import { useRouter } from "next/navigation";

export default function SearchResults() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Search Results</h1>
        </div>
        <SearchBar
          onSubmit={(searchTerm) => {
            // when the user submits the form, we only modify the router query parameters
            router.push({
              pathname: "/search", // Provide the correct pathname
              query: {
                search: searchTerm,
              },
            });
          }}
          inputProps={{}}/>
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

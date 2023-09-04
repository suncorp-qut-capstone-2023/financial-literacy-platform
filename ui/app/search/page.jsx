"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import styles from "@/styles/page.module.css";
import ArticleOverview from "@/components/articleOverview";
import VideoOverview from "@/components/videoOverview";
import SearchBar from "@/components/searchBar";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  const [results, setResults] = useState('');
  const [loading, setLoading] = useState(false);

  let searchQuery = {
    "search_query": query,
  };

  // Send data to the backend via POST
  fetch("https://jcmg-api.herokuapp.com/api/learningModules/search", {
    method: "POST",
    mode: "cors",
    body: JSON.stringify(searchQuery),
  })
    .then((response) => response.json())
    .then((responseData) => {
        setResults(responseData.results)
        setLoading(false)
    })
    .catch((error) => {
      console.log("Error fetching and parsing data", error);
    });

  return (
    <main className={styles.main}>
      <div className={styles.contentWrapper}>
        <div className={styles.description}>
          <h1 className={styles.title}>Search Results</h1>
        </div>
        <SearchBar sx={{ marginTop: "2rem", marginBottom: 0 }} query={query} />
        <Grid container spacing={2}>
          {results}
        </Grid>
      </div>
    </main>
  );
}

"use client";

import { createTheme, ThemeProvider, styled, responsiveFontSizes } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";

import NextLink from 'next/link';
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import Image from "next/image";
import styles from "../styles/page.module.css";

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  marginTop: theme.spacing(2.5),
  padding: theme.spacing(1),
  flexDirection: "column",
}));

let theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#000000",
    },
  }
});

theme = responsiveFontSizes(theme, {
    factors: {
      'xs': 0.2,
      'sm': 0.2,
      'md': 0.2,
      'lg': 1,
      'xl': 1,
    }
});


function CourseOverview({ courseId, courseName, lastUpdated, materialsCount, lecturesCount, thumbnail }) {
    var defaultSrc = "https://placehold.co/1024x1024";
    const thumbnailURL = (thumbnail && thumbnail !== "no_thumbnail") ? thumbnail : defaultSrc;

    return (
    <ThemeProvider theme={theme}>
      <Item>
        <Grid xs={12}>
          <Grid container spacing={1}>
            <Grid xs={3}>
              <div style={{ width: "10rem", height: "10rem", position: "relative" }}>
              <Image
                  loader={() => thumbnailURL}
                  src={thumbnailURL}
                  fill={true}
                  alt="Course Thumbnail"
                  style={{objectFit:'cover'}}
                />
              </div>
            </Grid>
            <Grid xs={9}>
              <Grid direction="column" container spacing={1}>
                <Grid xs={12}>
                <Typography variant="h5" fontWeight="bold">{courseName}</Typography>
                </Grid>
                <Grid xs={12}>
                    <b>Last updated:</b> {new Date(lastUpdated).toLocaleDateString()}
                </Grid>
                <Grid xs={12}>
                    <b>Total Materials:</b> {materialsCount}
                </Grid>
                <Grid xs={12}>
                <b>Total Lectures:</b> {lecturesCount}
                </Grid>
                <Grid xs={6}>
                    <NextLink href={`/courses/${courseId}`} passHref>
                        <Link>
                            <Button variant="contained" color="suncorpgreen" className={styles.buttons}>
                                View Course
                            </Button>
                        </Link>
                    </NextLink>
                </Grid>
              </Grid>   
            </Grid>
          </Grid>
        </Grid>
      </Item>
    </ThemeProvider>
  );
}

export default CourseOverview;

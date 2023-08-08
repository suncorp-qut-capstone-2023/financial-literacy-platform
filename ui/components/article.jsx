"use client";

import { createTheme,ThemeProvider, styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import Image from "next/image";
import styles from "../styles/page.module.css";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  marginTop: theme.spacing(5),
  padding: theme.spacing(0.1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

const theme = createTheme({
  palette: {
    teal: {
      main: '#24AFB5',
      contrastText: '#000000',
    },
  },
});

const src = "https://placehold.co/64x256";

export default function Article(/* TODO: pass in some api call */) {

  return (
    <ThemeProvider theme={theme}>
        <Item>
          <Grid xs={12}>
            <Grid container spacing={1}>
              <Grid xs={3}>
                <Image
                  loader={() => src}
                  src={src}
                  width={64}
                  height={256}
                  alt="Article Placeholder"
                />
              </Grid>
              <Grid xs={9}>
                <Grid container spacing={1}>
                  <Grid xs={12}sx={{ fontWeight: 'bold' }}>Article Title Placeholder</Grid>
                  <Grid xs={12}>
                    Article Description Placeholder. Lorem ipsum dolor sit amet
                    consectetur adipisicing elit. Obcaecati, tenetur. Aliquid
                    quisquam, qui ex ut nisi inventore vel itaque facilis quo
                    soluta corporis temporibus molestias eaque dolor ipsam,
                    accusamus rerum.
                  </Grid>
                  <Grid xs={6} sx={{ fontWeight: 'bold' }}>Estimated Reading Time: 3min.</Grid>
                  <Grid xs={6}><Button variant="contained" color="teal" className={styles.buttons} component={Link} href="/articles/read">Continue Reading</Button></Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Item>
    </ThemeProvider>
  );
}

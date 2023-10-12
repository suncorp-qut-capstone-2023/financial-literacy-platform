"use client";

import { useState } from "react";
import { createTheme, ThemeProvider, styled, responsiveFontSizes } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";

import NextLink from 'next/link';
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import Image from "next/image";
import styles from "../styles/page.module.css";

// for delete/success feedback
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

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
      contrastText: "#ffffff",
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

function CourseOverview({ courseId, courseName, lastUpdated, materialsCount, lecturesCount, thumbnail, cms, onCourseRemoved }) {
    var defaultSrc = "https://placehold.co/1024x1024";
    const thumbnailURL = (thumbnail && thumbnail !== "no_thumbnail") ? thumbnail : defaultSrc;
    const [open, setOpen] = useState(false); // for delete dialog box
    const [successOpen, setSuccessOpen] = useState(false);

    const handleClickOpen = () => {setOpen(true);};
  
    const handleClose = () => {setOpen(false);};

    const handleSuccessOpen = () => {setSuccessOpen(true);};
  
    const handleSuccessClose = () => { setSuccessOpen(false);};
  
    const handleDelete = async () => {
      try {
          const response = await fetch(`https://jcmg-api.herokuapp.com/api/course/delete?courseID=${courseId}`, {
              method: 'DELETE',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              }});
          if (response.ok) { // Delete was successful
            onCourseRemoved(courseId);  
            setTimeout(() => handleSuccessOpen(), 500); // Delay by 500ms
            handleSuccessOpen();
          } else {
              // Handle error response. Possibly add another dialog.
              console.error('Failed to delete the course. Status:', response.status);
          }
      } catch (error) {
          console.error('An error occurred while deleting the course:', error);
      }
  };
    return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Delete Course"}</DialogTitle>
          <DialogContent>
              <DialogContentText id="alert-dialog-description">
                  Are you sure you want to delete this course? This action cannot be undone.
              </DialogContentText>
          </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
              Cancel
          </Button>
          <Button onClick={() => {handleDelete(); handleClose();}} color="primary" autoFocus>
              Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description">
        <DialogTitle id="success-dialog-title">{"Success!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
              Course has been successfully deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <div style={{ maxWidth: '80%', minWidth:'80%'}}>
        <Item>
          <Grid xs={12}>
            <Grid container spacing={1}>
              {/* image container */}
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
              {/* Course Info container */}
              <Grid xs={9}>
                <Grid direction="column" container spacing={1}>
                  <Grid xs={12}>
                  <Typography variant="h5" fontWeight="bold">{courseName}</Typography>
                  </Grid>
                  <Grid xs={6}>
                      <b>Last updated:</b> {new Date(lastUpdated).toLocaleDateString()}
                  </Grid>
                  <Grid xs={6}>
                      <b>Total Materials:</b> {materialsCount}
                  </Grid>
                  <Grid xs={6}>
                  <b>Total Lectures:</b> {lecturesCount}
                  </Grid>
                  <Grid xs={6}>
                      <NextLink href={`/courses/${courseId}`} passHref>
                        <Link>
                          <Button variant="contained" color="suncorpgreen" className={styles.buttons}>
                            {cms ? 'Edit/View Course' : 'View Course'}
                          </Button>
                        </Link>
                      </NextLink>
                        {cms && (
                          <Button onClick={handleClickOpen} variant="outlined" color="secondary">
                            Delete Course
                          </Button>)}
                  </Grid>
                </Grid>   
              </Grid>
            </Grid>
          </Grid>
        </Item>
      </div>
    </ThemeProvider>
  );
}

export default CourseOverview;
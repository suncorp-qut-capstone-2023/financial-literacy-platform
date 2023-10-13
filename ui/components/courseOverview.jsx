"use client";

import { useState } from "react";
import {
  createTheme,
  ThemeProvider,
  styled,
  responsiveFontSizes,
} from "@mui/material/styles";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Box } from "@mui/material";

import NextLink from "next/link";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

import styles from "../styles/page.module.css";

// for delete/success feedback
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

let theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#ffffff",
    },
  },
});

function CourseOverview({
  courseId,
  courseName,
  thumbnail,
  cms,
  onCourseRemoved,
}) {
  var defaultSrc = "https://placehold.co/1024x1024";
  const thumbnailURL =
    thumbnail && thumbnail !== "no_thumbnail" ? thumbnail : defaultSrc;
  const [open, setOpen] = useState(false); // for delete dialog box
  const [successOpen, setSuccessOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSuccessOpen = () => {
    setSuccessOpen(true);
  };

  const handleSuccessClose = () => {
    setSuccessOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(
        `https://jcmg-api.herokuapp.com/api/course/delete?courseID=${courseId}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        // Delete was successful
        onCourseRemoved(courseId);
        setTimeout(() => handleSuccessOpen(), 500); // Delay by 500ms
        handleSuccessOpen();
      } else {
        // Handle error response. Possibly add another dialog.
        console.error("Failed to delete the course. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while deleting the course:", error);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Course"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this course? This action cannot be
            undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete();
              handleClose();
            }}
            color="primary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
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
      {/* image container */}
      <Card sx={{ margin: "20px", border: "#009877 solid 2px" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          padding="10px"
        >
          <CardMedia
            sx={{
              width: "10rem",
              height: "10rem",
            }}
            image={thumbnailURL}
            title="Course Thumbnail"
          />
          {/* Course Info container */}
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {courseName}
            </Typography>
          </CardContent>
          <CardActions>
            <NextLink href={`/courses/${courseId}`} passHref>
              <Link>
                <Button
                  variant="contained"
                  color="suncorpgreen"
                  className={styles.buttons}
                >
                  {cms ? "Edit/View Course" : "View Course"}
                </Button>
              </Link>
            </NextLink>
            {cms && (
              <Button
                onClick={handleClickOpen}
                variant="outlined"
                color="secondary"
              >
                Delete Course
              </Button>
            )}
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}

export default CourseOverview;

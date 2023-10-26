import { useState, useContext } from "react";
import { AuthContext } from "@/app/auth.jsx";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Box } from "@mui/material";
import NextLink from "next/link";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import styles from "@/styles/page.module.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#ffffff",
    },
  },
});

function LectureOverview({
  courseId,
  moduleId,
  lectureId,
  lectureName,
  onLectureRemoved,
  cms,
}) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { authToken } = useContext(AuthContext);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSuccessOpen = () => setSuccessOpen(true);
  const handleSuccessClose = () => setSuccessOpen(false);

  const handleDelete = async () => {
    try {
      console.log(lectureId)
      const response = await fetch(
        `https://jcmg-api.herokuapp.com/api/course/module/lecture/delete?lectureID=${lectureId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        onLectureRemoved(lectureId);
        handleSuccessOpen();
      } else {
        console.error("Failed to delete lecture. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while deleting the lecture:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Lecture"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this lecture? This action cannot be
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

      {/* Deletion Success Dialog */}
      <Dialog
        open={successOpen}
        onClose={handleSuccessClose}
        aria-labelledby="success-dialog-title"
        aria-describedby="success-dialog-description"
      >
        <DialogTitle id="success-dialog-title">{"Success!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="success-dialog-description">
            Lecture has been successfully deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Lecture Display */}
      <Card
        sx={{
          margin: "20px",
          border: "#009877 solid 2px",
          width: "250px",
          height: "300px",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="space-around"
          textAlign="center"
          padding="10px"
          height="100%"
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {lectureName}
            </Typography>
          </CardContent>
          <CardActions>
            <NextLink
              href={`/courses/${courseId}/${moduleId}/${lectureId}`}
              passHref
            >
              <Link>
                <Button
                  variant="contained"
                  color="suncorpgreen"
                  className={styles.buttons}
                >
                  {cms ? "Edit/View Lecture" : "View Lecture"}
                </Button>
              </Link>
            </NextLink>
            {cms && (
              <Button
                onClick={handleClickOpen}
                variant="outlined"
                color="secondary"
              >
                Delete Lecture
              </Button>
            )}
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}

export default LectureOverview;

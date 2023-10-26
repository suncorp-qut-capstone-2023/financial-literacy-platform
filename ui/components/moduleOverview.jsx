"use client";
import { useState, useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import { AuthContext } from "../app/auth.jsx";

import NextLink from "next/link";
import Link from "@mui/material/Link";
import styles from "@/styles/page.module.css";

let theme = createTheme({
  palette: {
    suncorpgreen: {
      main: "#009877",
      contrastText: "#ffffff",
    },
  },
});

function ModuleOverview({
  courseId,
  moduleId,
  moduleName,
  onModuleRemoved,
  cms,
  refreshModules
}) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { authToken } = useContext(AuthContext);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSuccessOpen = () => setSuccessOpen(true);
  const handleSuccessClose = () => {
    setSuccessOpen(false);
    refreshModules();  // Call refreshModules when the success popup is closed
};

  const handleDelete = async () => {
    try {
      // Update the endpoint URL and headers as needed
      const response = await fetch(
        `https://jcmg-api.herokuapp.com/api/course/module/delete?courseID=${courseId}&moduleID=${moduleId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (response.ok) {
        onModuleRemoved(moduleId);
        handleSuccessOpen();
      } else {
        console.error("Failed to delete module. Status:", response.status);
      }
    } catch (error) {
      console.error("An error occurred while deleting the module:", error);
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
        <DialogTitle id="alert-dialog-title">{"Delete Module"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this module? This action cannot be
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
            Module has been successfully deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Module Display */}
      <Card
        sx={{
          margin: "20px",
          border: "#009877 solid 2px",
          width: "250px",
          height: "400px",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="space-around"
          alignItems="center"
          textAlign="center"
          padding="10px"
          height="100%"
        >
          <CardContent>
            <Typography variant="h5" fontWeight="bold">
              {moduleName}
            </Typography>
          </CardContent>
          <CardActions>
            <NextLink href={`/courses/${courseId}/${moduleId}`} passHref>
              <Link>
                <Button
                  variant="contained"
                  color="suncorpgreen"
                  className={styles.buttons}
                >
                  {cms ? "Edit/View Module" : "View Module"}
                </Button>
              </Link>
            </NextLink>
            {cms && (
              <Button
                onClick={handleClickOpen}
                variant="outlined"
                color="secondary"
              >
                Delete Module
              </Button>
            )}
          </CardActions>
        </Box>
      </Card>
    </ThemeProvider>
  );
}

export default ModuleOverview;

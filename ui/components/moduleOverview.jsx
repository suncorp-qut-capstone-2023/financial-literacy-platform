"use client";
import { useState, useContext } from "react";
import { createTheme, ThemeProvider, styled, responsiveFontSizes } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { AuthContext } from '../../auth.jsx';

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

theme = responsiveFontSizes(theme);

function ModuleOverview({ courseId, moduleId, moduleName, onModuleRemoved, cms }) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const { authToken } = useContext(AuthContext);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleSuccessOpen = () => setSuccessOpen(true);
  const handleSuccessClose = () => setSuccessOpen(false);

  const handleDelete = async () => {
    try {
        // Update the endpoint URL and headers as needed
        const response = await fetch(`https://jcmg-api.herokuapp.com/api/course/module/delete?courseID=${courseId}&moduleID=${moduleId}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            }
        });
        if (response.ok) {
            onModuleRemoved(moduleId);
            handleSuccessOpen();
        } else {
            console.error('Failed to delete the module. Status:', response.status);
        }
    } catch (error) {
        console.error('An error occurred while deleting the module:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle id="alert-dialog-title">{"Delete Module"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this module? This action cannot be undone.
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

      {/* Deletion Success Dialog */}
      <Dialog open={successOpen} onClose={handleSuccessClose} aria-labelledby="success-dialog-title" aria-describedby="success-dialog-description">
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
      <div style={{ maxWidth: '80%', minWidth:'80%'}}>
        <Item>
          <Grid xs={12}>
            <Grid container spacing={1}>
              <Grid xs={12}>
                <Grid direction="column" container spacing={1}>
                  <Grid xs={12}>
                    <Typography variant="h5" fontWeight="bold">{moduleName}</Typography>
                  </Grid>
                  <Grid xs={6}>
                  <NextLink href={`/courses/${moduleIdId}`} passHref>
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

export default ModuleOverview;

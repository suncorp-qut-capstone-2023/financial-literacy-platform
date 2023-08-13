"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";
import TextField from '@mui/material/TextField';



export default function Login(/* TODO: pass in some api call */) {

    return (
        <main className={styles.main}>
            <Grid item xs={12} md={12} className={styles.profile}>
                <h1  className={styles.profileTitle}>Sign Up</h1>
            </Grid>

            <Grid container spacing={1} xs={12} md={12} style={{ paddingTop: "50px", width: "60%" }}>
                <Grid item xs={6} md={6}>
                    <h3 style={{paddingBottom: "5px"}}>First Name*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="First Name"
                        helperText="Please enter your first name"
                        variant="outlined" />
                </Grid>
                <Grid item xs={6} md={6}>
                    <h3 style={{paddingBottom: "5px"}}>Last Name*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Last Name"
                        helperText="Please enter your last name"
                        variant="outlined" />
                </Grid>
            </Grid>

            <Grid item xs={12} md={12} style={{ paddingTop: "15px", width: "60%" }}>
                <div>
                    <h3 style={{paddingBottom: "5px"}}>Account Name*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Account Name"
                        helperText="Please enter your account name"
                        variant="outlined" />
                </div>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>E-mail Address*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="E-mail Address"
                        helperText="Please enter your e-mail address"
                        variant="outlined" />
                </div>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>Password*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Password"
                        helperText="Please enter your password"
                        variant="outlined" />
                </div>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>Confirm Password*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Comfirm Password"
                        helperText="Please re-enter your password to confirm"
                        variant="outlined" />
                </div>
            </Grid>

            <Grid item xs={12} md={12} direction="column" display="flex"
                  justifyContent="center" padding="20px">
                <Button variant="contained" size="large" >Create Account</Button>
            </Grid>

        </main>
    );
}
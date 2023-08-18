"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";
import TextField from '@mui/material/TextField';



export default function Login(/* TODO: pass in some api call */) {

    return (
        <main className={styles.main}>
            <Grid item xs={12} md={12} className={styles.profile}>
                <h1  className={styles.profileTitle}>Login</h1>
            </Grid>

            <Grid contaier xs={12} md={12} className={styles.login}>
                <div>
                    <h3 style={{paddingBottom: "10px"}}>E-mail Address</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="E-mail Address"
                        helperText="Please enter your e-mail address"
                        variant="outlined"/>
                </div>
                <div style={{paddingTop: "30px"}}>
                    <h3 style={{paddingBottom: "10px"}}>Password</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        label="Password"
                        helperText="Please enter your password"
                        variant="outlined" />
                </div>
            </Grid>

            <Grid container xs={12} md={12} paddingRight="350px" paddingTop="10px"
                  direction="row" alignItems="center" justifyContent="flex-end">
                <Button variant="contained" >LOGIN</Button>
            </Grid>

            <Grid container xs={12} md={12}>
                <Grid item xs={12} md={12} direction="column" display="flex"
                      justifyContent="center" padding="20px">
                    <Button variant="outlined" size="large">Continue With Google</Button>
                </Grid>
                <Grid item xs={12} md={12} direction="column" display="flex"
                      justifyContent="center" >
                    <Button variant="outlined" size="large">Continue With Apple</Button>
                </Grid>
            </Grid>
            <div style={{ paddingTop: "8px"}}>
                <p>OR</p>
            </div>
            <Grid item xs={12} md={12} direction="column" display="flex"
                  justifyContent="center" padding="20px">
                <Button variant="contained" size="large" href="/login/createAccount">Create An Account</Button>
            </Grid>
        </main>
    );
}

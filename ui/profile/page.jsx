"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";


const src = "https://placehold.co/1400";

export default function Profile(/* TODO: pass in some api call */) {

    return (
        <main className={styles.main}>
            <Grid container spacing={6} className={styles.profile}>
                <Grid item xs={12}>
                    <h1  className={styles.profileTitle}>Account Profile</h1>
                    <div
                        style={{ position: "relative", paddingTop: "50px"}}>
                        <img className={styles.profilePic}
                             src={src}
                             alt="Profile Picture Placeholder"
                        />
                    </div>
                </Grid>
                <Grid container spacing={1} sm xs={12}>
                    <Grid item xs md={12}>
                        <div
                            style={{position: "relative", paddingLeft: "100px",
                                    fontSize: "25px"}}>
                            <p>E-mail Address: PLACEHOLDER</p>
                            <br></br>
                            <p>First Name: PLACEHOLDER</p>
                            <br></br>
                            <p>Last Name: PLACEHOLDER</p>
                            <br></br>
                            <p>Account Level: PLACEHOLDER</p>
                        </div>
                    </Grid>
                    <Grid item xs md={6}>
                        <div
                            style={{position: "relative", paddingTop: "25px",
                                fontSize: "25px", paddingLeft: "100px"}}>
                            <p>Password: ******</p>
                        </div>
                    </Grid>
                    <Grid item xs md={6}>
                        <Button variant="contained" color="error">CHANGE</Button>
                    </Grid>
                </Grid>
            </Grid>

        </main>
    );
}
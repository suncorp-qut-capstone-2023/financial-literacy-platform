"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";
import {useState} from "react";


const src = "https://placehold.co/1400";

const Profile = () => {
    const [email, setEmail] = useState(localStorage.getItem('email'));
    const [userType, setUserType] = useState(localStorage.getItem('userType'));
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    fetch("https://jcmg-api.herokuapp.com/api/user/me", {
        method: "GET",
        headers: {
            Authorization : `Bearer ${localStorage.getItem('token')}`
        }
    }).then((res) => {
        return res.json();
    }).then((resp) => {
        setEmail(resp.email);
        setFirstName(resp.firstName);
        setLastName(resp.lastName);
        setUserType(resp.userType);
    });

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
                            <p>E-mail Address: {email}</p>
                            <br></br>
                            <p>First Name: {firstName}</p>
                            <br></br>
                            <p>Last Name: {lastName}</p>
                            <br></br>
                            <p>User Type: {userType}</p>
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

export default Profile;
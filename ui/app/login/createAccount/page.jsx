"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";
import TextField from '@mui/material/TextField';
import { useState, useEffect} from "react";
import { useRouter } from "next/navigation";



const createAccount = () => {
    const [firstName, setFirstName]=useState("")
    const [lastName, setLastName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [confirm, setConfirm]=useState("");

    const router = useRouter();

    useEffect( () => {
        sessionStorage.clear();
    }, []);

    const proceedRego = (e) => {
        e.preventDefault();
        if (password != confirm){
            console.log("Password is not matching!!!")
        }
        else{
            let item = {"firstName": firstName,
                        "lastName": lastName,
                        "email": email,
                        "password": confirm};
            fetch("https://jcmg-api.herokuapp.com/api/user/register", {
                method: "POST",
                headers: {"content-type":"application/json"},
                body:JSON.stringify(item)
            }).then((res) => {
                return res.json();
            }).then((resp) => {
                if(resp.error){
                    console.log(resp.message);
                }
                else{
                    router.push("/login");
                }
            }).catch((error) => {
            });

        }
    }

    return (
        <form onSubmit={proceedRego} className={styles.main}>
            <Grid item xs={12} md={12}>
                <h1  className={styles.profileTitle}>Sign Up</h1>
            </Grid>

            <Grid container spacing={1} xs={12} md={12} style={{ paddingTop: "50px", width: "80%" }}>
                <Grid item xs={6} md={6}>
                    <h3 style={{paddingBottom: "5px"}}>First Name*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="text"
                        onChange={ (e) => setFirstName(e.target.value)}
                        label="First Name"
                        helperText="Please enter your first name"
                        variant="outlined" />
                </Grid>
                <Grid item xs={6} md={6}>
                    <h3 style={{paddingBottom: "5px"}}>Last Name*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="text"
                        onChange={ (e) => setLastName(e.target.value)}
                        label="Last Name"
                        helperText="Please enter your last name"
                        variant="outlined" />
                </Grid>
            </Grid>

            <Grid item xs={12} md={12} style={{ paddingTop: "15px", width: "80%" }}>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>E-mail Address*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="text"
                        onChange={ (e) => setEmail(e.target.value)}
                        label="E-mail Address"
                        helperText="Please enter your e-mail address"
                        variant="outlined" />
                </div>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>Password*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="password"
                        onChange={ (e) => setPassword(e.target.value)}
                        label="Password"
                        helperText="Please enter your password"
                        variant="outlined" />
                </div>
                <div style={{paddingTop: "15px"}}>
                    <h3 style={{paddingBottom: "5px"}}>Confirm Password*</h3>
                    <TextField
                        fullWidth
                        id="outlined-basic"
                        type="password"
                        onChange={ (e) => setConfirm(e.target.value)}
                        label="Comfirm Password"
                        helperText="Please re-enter your password to confirm"
                        variant="outlined" />
                </div>
            </Grid>

            <Grid item xs={12} md={12} direction="column" display="flex"
                  justifyContent="center" padding="20px">
                <Button variant="contained" size="large" type="submit" >Create Account</Button>
            </Grid>

        </form>
    );
}

export default createAccount;

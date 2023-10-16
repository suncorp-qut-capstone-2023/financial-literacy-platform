"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import {Button, Alert, TextField, Snackbar} from '@mui/material'
import styles from "@/styles/page.module.css"
import { useState, useEffect } from 'react'
import {useRouter} from "next/navigation";
import jwt_decode from 'jwt-decode';
import {styled} from "@mui/material/styles";

const ClickButton = styled(Button)({
    padding: '6px 12px 6px 12px',
    textAlign: "center",
    borderColor: '#00987783',
    backgroundColor: '#00987783',
    '&:hover' : {
        backgroundColor: '#00987783',
    },
    color: 'white',
    margin: '2% 0 2% 0',
})

const Login = () => {
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const [flag, setFlag]=useState(true);

    const router= useRouter();

    localStorage.clear();

    const ProceedLogin = (e) => {
        e.preventDefault();
        let item= {"email": email,
            "password": password};
        fetch("https://jcmg-api.herokuapp.com/api/user/login", {
            method: "POST",
            headers: {"content-type":"application/json"},
            body:JSON.stringify(item)
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            let decode = jwt_decode(resp.token);
            localStorage.setItem('userType', decode.userType);
            localStorage.setItem('token', resp.token);
            localStorage.setItem('email',email);
            localStorage.setItem('password', password);
            router.push("/");
        }).catch((error) => {
            setFlag(false);
        });
    }


    return (
        <form onSubmit={ProceedLogin} className={styles.main}>
            <Grid item xs={12} md={12}>
                <h1  className={styles.profileTitle}>Login</h1>
            </Grid>

            <Grid contaier xs={12} md={12} className={styles.login}>
                <div>
                    <h3 style={{paddingBottom: "10px"}}>E-mail Address</h3>
                    <TextField
                        fullWidth
                        value={email}
                        id="outlined-basic"
                        type="email"
                        onChange={(e)=>setEmail(e.target.value)}
                        label="E-mail Address"
                        helperText="Please enter your e-mail address"
                        variant="outlined"/>
                </div>
                <div style={{paddingTop: "30px"}}>
                    <h3 style={{paddingBottom: "10px"}}>Password</h3>
                    <TextField
                        fullWidth
                        value={password}
                        id="outlined-basic"
                        label="Password"
                        type="password"
                        onChange={(e)=>setPassword(e.target.value)}
                        helperText="Please enter your password"
                        variant="outlined" />
                </div>
            </Grid>

            {flag === false && <p style={{margin : '2%', color : "red"}}>
                Invalid Email Address or Password! </p>}

            <Grid item xs={12} md={12} direction="column" display="flex"
                  justifyContent="center" padding="20px">
                <ClickButton variant="contained" type="submit">LOGIN</ClickButton>
            </Grid>


            <div style={{ paddingTop: "8px"}}>
                <p>OR</p>
            </div>

            <Grid item xs={12} md={12} direction="column" display="flex"
                  justifyContent="center" padding="20px">
                <ClickButton variant="contained" size="large" href="/login/createAccount">Create An Account</ClickButton>
            </Grid>
        </form>
    );
}

export default Login;

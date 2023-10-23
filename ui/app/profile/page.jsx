"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from '@mui/material/Button';
import styles from "@/styles/page.module.css";
import { useState, useContext } from "react";
import {Divider} from "@mui/joy";
import {styled} from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import {useRouter} from "next/navigation";

import { AuthContext } from '@/app/auth.jsx';


const ChangeButton = styled(Button)({
    fontSize: '60%',
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

const DivideLine = styled(Divider)({
    margin: '5% 0 5% 0',
})

const Profile = () => {
    const {authToken} = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState('text');
    const [change, setChange] = useState('');

    const handleClickOpen = (field) => {
        setOpen(true);
        setTitle("New " + field);
        switch (field){
            case "Email Address":
                setType("email");
                break;
            case "Password":
                setType("password");
                break;
            default:
                setType("text");
                break;
        }
    }
    const handleClose = () => {
        setOpen(false);
    }

    const ChangeInfo = (e) => {
        e.preventDefault();
        let item = {[`${change}`] : content};
        fetch("https://jcmg-api.herokuapp.com/api/user/me", {
            method: "PUT",
            headers: {
                Authorization : `Bearer ${authToken}`,
                "content-type":"application/json",
            },
            body:JSON.stringify(item)
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            handleClose();
        }).catch((error) => {
        });
    }

    const router = useRouter();

    const deleteAccount = (e) => {
        e.preventDefault();
        fetch("https://jcmg-api.herokuapp.com/api/user/me", {
            method: "DELETE",
            headers: {
                Authorization : `Bearer ${authToken}`
            },
        }).then((res) => {
            return res.json();
        }).then((resp) => {
            router.push("/logout");
        }).catch((error) => {
        });
    }

    fetch("https://jcmg-api.herokuapp.com/api/user/me", {
        method: "GET",
        headers: {
            Authorization : `Bearer ${authToken}`,
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
                </Grid>
                <Grid container spacing={1} sm xs={12}>
                    <Grid item md xs={12}>
                        <div
                            style={{position: "relative", paddingLeft: "5%",
                                fontSize: "20px", marginBottom: '5%'}}>
                            <p>First Name: {firstName}</p>
                            <ChangeButton onClick={function() { handleClickOpen('First Name'); setChange('firstName')}} >
                                Change first name</ChangeButton>
                            <DivideLine />
                            <p>Last Name: {lastName}</p>
                            <ChangeButton onClick={function() { handleClickOpen('Last Name'); setChange('lastName')}} >
                                Change last name</ChangeButton>
                            <DivideLine />
                            <p>E-mail Address: {email}</p>
                            <ChangeButton onClick={function() { handleClickOpen('Email Address'); setChange('email')}}>
                                Change email address</ChangeButton>
                            <DivideLine />
                            <p>User Type: {userType}</p>
                            <DivideLine />
                            <p>Password: *********</p>
                            <ChangeButton onClick={function() { handleClickOpen('Password'); setChange('password')}}>
                                Change password</ChangeButton>
                        </div>
                        <Button color="error" variant='contained' onClick={deleteAccount}>Delete Account</Button>
                    </Grid>

                </Grid>
            </Grid>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        fullWidth
                        variant='standard'
                        type={type}
                        onChange={(e)=>setContent(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={ChangeInfo}>Submit</Button>
                </DialogActions>
            </Dialog>
        </main>
    );
}

export default Profile;

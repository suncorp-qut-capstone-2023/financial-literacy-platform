"use client";

import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Button from "@mui/material/Button";
import styles from "@/styles/page.module.css";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { styled } from "@mui/material/styles";

const ClickButton = styled(Button)({
  padding: "6px 12px 6px 12px",
  textAlign: "center",
  borderColor: "#00987783",
  backgroundColor: "#00987783",
  "&:hover": {
    backgroundColor: "#00987783",
  },
  color: "white",
  margin: "2% 0 2% 0",
});

const createAccount = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [adminToken, setAdminToken] = useState("");

  const [flag, setFlag] = useState(true);
  const [errMsg, setErrMsg] = useState("");

  const router = useRouter();

  useEffect(() => {
    sessionStorage.clear();
  }, []);

  const proceedRego = (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setFlag(false);
      setErrMsg("Password is not matching!");
    } else {
      let item = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: confirm,
        createAdminToken: adminToken,
      };

      fetch("https://jcmg-api.herokuapp.com/api/user/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(item),
      })
        .then((res) => {
          return res.json();
        })
        .then((resp) => {
          if (resp.error) {
            setFlag(false);
            setErrMsg(resp.message);
          } else {
            router.push("/login");
          }
        })
        .catch((error) => {
          setFlag(false);
          setErrMsg("Unable to create account");
        });
    }
  };

  return (
    <form onSubmit={proceedRego} className={styles.main}>
      <Grid item xs={12} md={12}>
        <h1 className={styles.profileTitle}>Sign Up</h1>
      </Grid>

      <Grid
        container
        spacing={1}
        xs={12}
        md={12}
        style={{ paddingTop: "50px", width: "80%" }}
      >
        <Grid item xs={6} md={6}>
          <h3 style={{ paddingBottom: "5px" }}>First Name*</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="text"
            onChange={(e) => setFirstName(e.target.value)}
            label="First Name"
            helperText="Please enter your first name"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={6} md={6}>
          <h3 style={{ paddingBottom: "5px" }}>Last Name*</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="text"
            onChange={(e) => setLastName(e.target.value)}
            label="Last Name"
            helperText="Please enter your last name"
            variant="outlined"
          />
        </Grid>
      </Grid>

      <Grid item xs={12} md={12} style={{ paddingTop: "15px", width: "80%" }}>
        <div style={{ paddingTop: "15px" }}>
          <h3 style={{ paddingBottom: "5px" }}>E-mail Address*</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            label="E-mail Address"
            helperText="Please enter your e-mail address"
            variant="outlined"
          />
        </div>
        <div style={{ paddingTop: "15px" }}>
          <h3 style={{ paddingBottom: "5px" }}>Password*</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            label="Password"
            helperText="Please enter your password"
            variant="outlined"
          />
        </div>
        <div style={{ paddingTop: "15px" }}>
          <h3 style={{ paddingBottom: "5px" }}>Confirm Password*</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="password"
            onChange={(e) => setConfirm(e.target.value)}
            label="Comfirm Password"
            helperText="Please re-enter your password to confirm"
            variant="outlined"
          />
        </div>
        <div style={{ paddingTop: "15px" }}>
          <h3 style={{ paddingBottom: "5px" }}>Admin Token</h3>
          <TextField
            fullWidth
            id="outlined-basic"
            type="text"
            onChange={(e) => setAdminToken(e.target.value)}
            label="Optional Admin Token"
            helperText="Please enter special token if you are registering an admin account. Please leave blank if not"
            variant="outlined"
          />
        </div>
      </Grid>

      {!flag && <p style={{ margin: "2%", color: "red" }}>{errMsg}</p>}

      <Grid
        item
        xs={12}
        md={12}
        direction="column"
        display="flex"
        justifyContent="center"
        padding="20px"
      >
        <ClickButton variant="contained" size="large" type="submit">
          Create Account
        </ClickButton>
      </Grid>
    </form>
  );
};

export default createAccount;

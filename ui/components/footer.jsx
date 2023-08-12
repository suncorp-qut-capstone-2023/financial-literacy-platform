"use client";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import Image from "next/image";
import logo from "../assets/logo.svg";
import styles from "../styles/footer.module.css";

import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(0.1),
  textAlign: "left",
  color: theme.palette.text.secondary,
}));

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <Grid container spacing={2}>
        <Grid xs={12} md={3}>
          {/* TODO: Add Links */}
          <Image src={logo} alt="Suncorp Logo" />
        </Grid>
        <Grid xs={12} md={3}>
          <Item elevation={0}>
            <FacebookIcon className={styles.f_socials} />
            <TwitterIcon className={styles.f_socials} />
            <LinkedInIcon className={styles.f_socials} />
            <YouTubeIcon className={styles.f_socials} />
          </Item>
        </Grid>
        <Grid xs={12} md={3}>
          <Item elevation={0}>
            <p>Contact Us</p>
            <p>Report an Issue</p>
          </Item>
        </Grid>
        <Grid xs={12} md={3}>
          <Item elevation={0}>
            <p>
              Sustainable business • Disclaimer • Accessibility • Privacy policy
              • Sitemap
            </p>
            <p>© Copyright 2023 Suncorp Group</p>
            <p>
              Suncorp Group Limited ABN 66 145 290 124. In accessing Suncorp's
              site you agree to the terms and conditions outlined in the
              disclaimer. <br /> Please ensure that you read both the
              Securityholder Privacy Statement and the Suncorp Privacy Policy
              before accessing the site.
            </p>
          </Item>
        </Grid>
      </Grid>
    </footer>
  );
}

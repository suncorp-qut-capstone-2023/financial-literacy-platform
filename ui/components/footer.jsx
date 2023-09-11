"use client";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import Image from "next/image";
import Link from "next/link";
import logo from "../assets/logo.svg";
import styles from "../styles/footer.module.css";

import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import InstagramIcon from "@mui/icons-material/Instagram";

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
      <Grid container className={styles.footerGrid}>
        <Grid xs={12} md={4} className={styles.footerGridItem}>
          <Link href="/">
            <Image src={logo} alt="Suncorp Logo" />
          </Link>
        </Grid>
        <Grid xs={12} md={4} className={styles.footerGridItem}>
          <Item elevation={0}>
          <Link href="https://www.facebook.com/suncorpAUNZ/">
            <FacebookIcon className={styles.f_socials} />
          </Link>
          <Link href="https://twitter.com/suncorp?lang=en">
            <TwitterIcon className={styles.f_socials} />
          </Link>
          <Link href="https://www.instagram.com/suncorp/">
            <InstagramIcon className={styles.f_socials} />
          </Link>
          <Link href="https://www.linkedin.com/company/suncorp/">
            <LinkedInIcon className={styles.f_socials} />
          </Link>
          <Link href="https://www.youtube.com/user/suncorpinsurance">
            <YouTubeIcon className={styles.f_socials} />
          </Link>
          </Item>
        </Grid>
        <Grid xs={12} md={4} className={styles.footerGridItem}>
          <Item elevation={0}>
          <Link href="mailto:somecontactemail@suncorpemail.com">
            <p>Contact Us</p>
          </Link>
          <Link href="mailto:somecontactemail@suncorpemail.com">
            <p>Report an Issue</p>
          </Link>
          </Item>
        </Grid>
      </Grid>
    </footer>
  );
}

"use client";

import { useEffect, useState } from "react";

// Header component.
import Image from "next/image";
import Typography from "@mui/material/Typography";

import styles from "@/styles/header.module.css";

import businessWoman from "../assets/businesswoman.png";
import businessWomanWide from "../assets/businesswomanwide.png";

const { heroContent, heroWrapper, imageWrapper } = styles;

export default function Header() {
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    // Function to update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Initial width
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const imageSrc = windowWidth > 900 ? businessWomanWide : businessWoman;

  return (
    <div className={heroWrapper}>
      <div className={imageWrapper}>
        <Image
          priority={true}
          src={imageSrc}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 25%" // Adjust these values as needed
          alt="hero image example"
        />
      </div>

      <div className={heroContent}>
        <Typography variant="h5" align="center" color="white">
          Financial Literacy Platform
        </Typography>
        <Typography align="center" color="white">
          Let Suncorp help you take control of your finances
        </Typography>
      </div>
    </div>
  );
}

// Import required libraries
import { useEffect, useState } from "react";
import Image from "next/image";
import Typography from "@mui/material/Typography";
import styles from "@/styles/header.module.css";
import businessWomanWide from "../assets/businesswomanwide.png";
import businessWoman from "../assets/businesswoman.png";

const { heroContent, heroBox, heroTitle, heroSubtitle, heroWrapper, imageWrapper } = styles;

export default function Header() {
  // Set the initial windowWidth based on the client's window.innerWidth if available
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 900
  );

  useEffect(() => {
    // Check if it's running in a browser
    if (typeof window === "undefined") return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const imageSrc = windowWidth < 900 ? businessWoman : businessWomanWide;

  return (
    <div className={heroWrapper}>

      <div className={imageWrapper}>
        <Image
          priority={true}
          src={imageSrc}
          layout="fill"
          objectFit="cover"
          objectPosition="50% 25%"
          alt="hero image example"
        />
      </div>

      <div className={heroContent}>
        <div className={heroBox}>
          <Typography 
            variant="h4" 
            align="center" 
            color="white" 
            className={heroTitle}
          >
            Financial Literacy Platform
          </Typography>
          <Typography 
            align="center" 
            color="white" 
            className={heroSubtitle}
          >
            Let Suncorp help you take control of your finances
          </Typography>
        </div>
      </div>

    </div>
  );
}

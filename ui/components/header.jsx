// Header component.
import Image from "next/image";
import Typography from '@mui/material/Typography';

import styles from "./header.module.css";

const { heroContent, heroWrapper, imageWrapper } = styles;

const IMAGE_URL =
  "https://www.perssondennis.com/images/articles/how-to-make-a-hero-image-in-nextjs/perfect-avocado.webp";

export default function Header () {
  return (
    <div className={heroWrapper}>
      <div className={imageWrapper}>
        <Image
          priority
          src={'https://cdn.discordapp.com/attachments/1104524531944652860/1139352052926005338/krissandrew_hd_business_woman_minority_suncorp_bank_018cb885-7c18-41b3-9369-293f38be1142.png'}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
          alt="hero image example"
        />
      </div>

      <div className={heroContent}>
        <Typography variant = 'h5' align='center' color='white'>Financial Literacy Platform</Typography>
        <Typography align='center' color='white'>Let Suncorp help you take control of your finances</Typography>
      </div>
    </div>
  );
};
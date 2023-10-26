import styles from "@/styles/page.module.css";
import Image from "next/image";

const Infographic = ({ heading, src }) => {
  const url = URL.createObjectURL(src);

  return (
    <div>
      <h1 className={styles.title}>{heading}</h1>
      <div className={styles.blobWrapper}>
        <Image
          src={url}
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: "100%", height: "auto" }}
          alt={heading}
          loading="lazy"
        />
      </div>
    </div>
  );
};

export default Infographic;

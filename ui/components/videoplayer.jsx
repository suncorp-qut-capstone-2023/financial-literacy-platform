import dynamic from "next/dynamic";
import styles from "@/styles/page.module.css";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const VideoPlayer = ({ heading, src }) => {
  const url = URL.createObjectURL(src);

  return (
    <div>
      <h1 className={styles.title}>{heading}</h1>
      <div className={styles.blobWrapper}>
        <ReactPlayer
          controls={true}
          playing={false}
          url={url}
          className={styles.reactPlayer}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;

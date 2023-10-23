import styles from "@/styles/page.module.css";

export default function Article({ heading, text }) {
  return (
    <div>
      <h1 className={styles.title}>{heading}</h1>

      <p>{text}</p>
    </div>
  );
}

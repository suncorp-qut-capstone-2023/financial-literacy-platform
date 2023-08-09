import styles from "@/styles/page.module.css";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import Link from "@mui/material/Link";

export default function Read(/* TODO: pass in some api call */) {
  return (
    
    <main className={styles.main}>
      <Grid container spacing={1} className={styles.articleTitle}>
        <Grid xs={12}>
          <h1>The Political and Economical State of the World</h1>
        </Grid>
        <Grid xs={12}>
          <p>Author: Jaden Smith</p>
          <p>Published: August 9, 2023</p>
          <p>Estimated Reading Time 3 min.</p>
        </Grid>
      </Grid>

      <div className={styles.articleContent}>
        <h2>Subheading</h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam
          similique necessitatibus saepe aperiam, ullam placeat nisi cupiditate
          ipsa laboriosam rerum aut quod quibusdam dicta, consectetur at veniam
          velit voluptatibus voluptatem.
        </p>
        <p>
          Maxime excepturi deserunt accusantium est, temporibus similique sunt
          rerum vero pariatur rem porro repudiandae ad libero! Quibusdam
          asperiores modi corporis nisi, eligendi numquam, quam exercitationem
          error commodi quae, amet obcaecati?
        </p>
        <h2>Subheading</h2>
        <p>
          Voluptas pariatur laboriosam, fugit eum eius voluptatem rerum! Eaque
          optio excepturi, consequuntur commodi tempora sequi veniam nihil a
          quibusdam sit ipsum pariatur quidem voluptatibus distinctio, quis,
          numquam possimus autem consectetur?
        </p>
        <p>
          Soluta nisi doloremque aperiam facilis. Sapiente adipisci sint harum
          amet eaque nemo quidem facilis inventore consectetur, aspernatur
          debitis officia explicabo placeat? Consectetur animi enim perferendis
          molestias officiis aliquid veritatis amet.
        </p>
        <h2>Subheading</h2>
        <p>
          Nobis impedit id dolorum nostrum omnis natus quia. Cum, corporis quod
          dolor iure iusto eveniet error velit neque ipsam eos voluptatibus
          laudantium repudiandae explicabo, rerum nostrum dignissimos assumenda
          aut nisi.
        </p>
        <Grid container>
          <Grid xs={6}>
            
          <Link
                    href="/articles/read" underline="hover"
                  >
                    <ArrowBackIcon />
            Previous Article
                  </Link>
            
            
          </Grid>
          <Grid xs={6} style={{ textAlign: 'right' }}>
          <Link
                    href="/articles/read" underline="hover"
                  >
            Next Article
                    <ArrowForwardIcon />
                  </Link>
          </Grid>
        </Grid>
      </div>
    </main>
  );
}

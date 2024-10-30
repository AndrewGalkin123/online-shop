import styles from "./Introduction.module.css";
import animeFigure from "./Frame 89.png";

const Introduction = () => {
  return (
    <article className={styles.introduction}>
      <div className={styles.attractionBlock}>
        <p>IMMERSE YOURSELF IN THE WORLD OF JAPANESE CULTURE WITH NEKON</p>

        <button className={`${styles.button} ${styles.buttonPrimary}`}>
          OUR CATALOG
        </button>
      </div>
      <div className={styles.product}>
        <img src={animeFigure} />
      </div>
    </article>
  );
};

export default Introduction;

import styles from "./Introduction.module.css";
import animeFigure from "./AnimeFigure.png";

const Introduction = ({ setCatalogStatus }) => {
  return (
    <article className={styles.introduction}>
      <div className={styles.attractionBlock}>
        <p>IMMERSE YOURSELF IN THE WORLD OF JAPANESE CULTURE WITH NEKON</p>

        <button
          onClick={() => {
            setCatalogStatus(true);
          }}
          className={`${styles.button}`}
        >
          OUR CATALOG
        </button>
      </div>
      <div className={styles.product}>
        <img src={animeFigure} alt="AnimeFigure" />
      </div>
    </article>
  );
};

export default Introduction;

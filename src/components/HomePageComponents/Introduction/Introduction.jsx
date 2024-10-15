import styles from "./Introduction.module.css";
import animeFigure from "./AnimeFigure.png";

const Introduction = () => {
  return (
    <article className={styles.introduction}>
      <div className={styles.attractionBlock}>
        <p>IMMERSE YOURSELF IN THE WORLD OF JAPANESE CULTURE WITH NEKON</p>
        <button>OUR CATALOG</button>
      </div>
      <img src={animeFigure}></img>
    </article>
  );
};

export default Introduction;

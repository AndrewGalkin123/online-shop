import styles from "./Introduction.module.css";
import animeFigure from "./Leviathan1.jpg";
import ProductCard from "../../../components/common/ProductCard/ProductCard";

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
        <ProductCard
          imageSrc={animeFigure}
          cardTitle="Leviathan Yukano"
          price={1099}
          originalPrice={1399}
          onSale={true}
          id={46}
          category="forAdults"
        />
      </div>
    </article>
  );
};

export default Introduction;

import styles from "./ProductCard.module.css";

const ProductCard = () => {
  return (
    <div className={styles.card}>
      <img src="https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/e19d7c34-42a9-4d2b-3300-34926e44ca00/width=450/00093-2732514167.jpeg" />
      <div className={styles.purchaseBox}>
        <div className={styles.cardDescription}>
          <p className={styles.cardTitle}>Anime Figure</p>
          <div className={styles.prices}>
            <p className={styles.actualPrice}>999$</p>
            <s className={styles.oldPrice}>1299$</s>
          </div>
        </div>
        <button>BUY</button>
      </div>
    </div>
  );
};

export default ProductCard;

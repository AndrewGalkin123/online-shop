import styles from "./ProductCard.module.css";

const ProductCard = ({ imageSrc, cardTitle, price, onSale, originalPrice }) => {
  return (
    <div className={styles.card}>
      <img src={imageSrc} />
      <div className={styles.purchaseBox}>
        <div className={styles.cardDescription}>
          <p className={styles.cardTitle}>{cardTitle}</p>
          {onSale ? (
            <div className={styles.prices}>
              <p className={styles.actualPrice}>{price}¥</p>
            </div>
          ) : (
            <div className={styles.prices}>
              <p className={styles.actualPrice}>{price}¥</p>
              <s className={styles.oldPrice}>{originalPrice}¥</s>
            </div>
          )}
        </div>
        <button>BUY</button>
      </div>
    </div>
  );
};

export default ProductCard;

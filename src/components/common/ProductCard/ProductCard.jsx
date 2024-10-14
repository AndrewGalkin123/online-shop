import { Link } from "react-router-dom";
import styles from "./ProductCard.module.css";

const ProductCard = ({
  imageSrc,
  cardTitle,
  price,
  onSale,
  originalPrice,
  id,
}) => {
  return (
    <div className={styles.card}>
      <img src={imageSrc} />
      <div className={styles.purchaseBox}>
        <div className={styles.cardDescription}>
          <p className={styles.cardTitle}>{cardTitle}</p>
          {onSale ? (
            <div className={styles.prices}>
              <p className={styles.actualPrice}>{price}¥</p>
              <s className={styles.oldPrice}>{originalPrice}¥</s>
            </div>
          ) : (
            <div className={styles.prices}>
              <p className={styles.actualPrice}>{price}¥</p>
            </div>
          )}
        </div>
        <Link to={`${id}`}>
          <button>BUY</button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

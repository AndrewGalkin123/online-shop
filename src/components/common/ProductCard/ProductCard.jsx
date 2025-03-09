import styles from "./ProductCard.module.css";
import { useContext } from "react";
import { UserContext } from "../../../context/UserContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
  const { buyNow } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCardClick = () => navigate(`/${product.category}/${product.id}`);
  const handleBuyClick = (e) => {
    e.stopPropagation();
    buyNow(product);
  };

  return (
    <div
      className={styles.card}
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
    >
      <img
        src={product.imageSrc[0]}
        alt={product.cardTitle}
        className={styles.cardImage}
      />
      <div className={styles.purchaseBox}>
        <div className={styles.cardDescription}>
          <p className={styles.cardTitle}>{product.name}</p>
          <div className={styles.prices}>
            <p className={styles.actualPrice}>{product.price}¥</p>
            {product.onSale && (
              <s className={styles.oldPrice}>{product.originalPrice}¥</s>
            )}
          </div>
        </div>
        <button onClick={handleBuyClick} aria-label={`Buy ${product.name}`}>
          BUY
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

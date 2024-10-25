import styles from "./ProductCard.module.css";
import { useContext } from "react";
import { PurchasesContext } from "../../../context/PurchasesContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  imageSrc,
  cardTitle,
  price,
  onSale,
  originalPrice,
  id,
  category,
}) => {
  const { buyNow } = useContext(PurchasesContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${category}/${id}`);
  };

  const handleBuyClick = (e) => {
    e.stopPropagation(); // Остановить событие, чтобы не перейти на страницу товара
    buyNow({
      id,
      name: cardTitle,
      price,
      originalPrice,
      onSale,
      category,
      imageSrc,
    });
  };

  return (
    <div className={styles.card} onClick={handleCardClick}>
      <img src={imageSrc} alt={cardTitle} />
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
        <button onClick={handleBuyClick}>BUY</button>
      </div>
    </div>
  );
};

export default ProductCard;

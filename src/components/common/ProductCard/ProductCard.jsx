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
  animatedCartoon,
}) => {
  const { buyNow } = useContext(PurchasesContext);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${category}/${id}`);
  };

  const handleBuyClick = (e) => {
    e.stopPropagation();
    buyNow({
      id: id,
      name: cardTitle,
      price: price,
      originalPrice: originalPrice,
      onSale: onSale,
      category: category,
      animatedCartoon: animatedCartoon,
      imageSrc: imageSrc ? [imageSrc] : [],
    });
  };

  return (
    <div className={styles.card}>
      <img onClick={handleCardClick} src={imageSrc} alt={cardTitle} />
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

import { Link, useLocation } from "react-router-dom";
import styles from "./ProductCard.module.css";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";

const ProductCard = ({
  imageSrc,
  cardTitle,
  price,
  onSale,
  originalPrice,
  id,
  category,
}) => {
  const location = useLocation();
  const isCategoryPage = location.pathname.includes(category);
  const { addToCart } = useContext(CartContext);
  return (
    <Link to={isCategoryPage ? `${id}` : `${category}/${id}`}>
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
          <Link>
            <button
              onClick={() =>
                addToCart({
                  id: id,
                  name: cardTitle,
                  price: price,
                  originalPrice: originalPrice,
                  onSale: onSale,
                  category: category,
                  imageSrc: imageSrc,
                })
              }
            >
              BUY
            </button>
          </Link>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

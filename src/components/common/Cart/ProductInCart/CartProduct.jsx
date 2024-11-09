import styles from "./CartProduct.module.css";
import { useContext } from "react";
import { PurchasesContext } from "../../../../context/PurchasesContext";
import React from "react";

const CartProduct = ({ product }) => {
  const { updateQuantity } = useContext(PurchasesContext);

  // Отдельный компонент для управления количеством
  const QuantityControl = () => (
    <div className={styles.quantityControl}>
      <button onClick={() => updateQuantity(product.id, -1)}>&minus;</button>
      <input
        className={styles.quantityInput}
        readOnly
        value={product.quantity}
      />
      <button onClick={() => updateQuantity(product.id, 1)}>+</button>
    </div>
  );

  return (
    <div className={styles.cartProduct}>
      <img
        className={styles.productImg}
        alt="product"
        src={product.imageSrc?.[0] || ""}
      />
      <div className={styles.productDetails}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDesc}>
          {product.name} from the popular animated cartoon{" "}
          {product.animatedCartoon}
        </p>
        <div className={styles.productControls}>
          <QuantityControl />
          <div className={styles.productPrice}>
            {product.onSale && (
              <s className={styles.oldPrice}>¥{product.originalPrice}</s>
            )}
            <p className={styles.actualPrice}>¥{product.price}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(CartProduct);

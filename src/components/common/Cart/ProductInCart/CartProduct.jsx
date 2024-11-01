import styles from "./CartProduct.module.css";
import { useContext } from "react";
import { PurchasesContext } from "../../../../context/PurchasesContext";

const CartProduct = ({ product }) => {
  const { updateQuantity } = useContext(PurchasesContext);

  return (
    <div className={styles.cartProduct}>
      <img
        className={styles.productImg}
        alt="product"
        src={product.imageSrc[0]}
      />
      <div className={styles.productDetails}>
        <h3 className={styles.productName}>{product.name}</h3>
        <p className={styles.productDesc}>
          {product.name} from the popular animated cartoon{" "}
          {product.animatedCartoon}
        </p>
        <div className={styles.productControls}>
          <div className={styles.quantityControl}>
            <button onClick={() => updateQuantity(product.id, -1)}>
              &minus;
            </button>
            <input
              className={styles.quantityInput}
              readOnly
              value={product.quantity}
            />
            <button onClick={() => updateQuantity(product.id, 1)}>+</button>
          </div>
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

export default CartProduct;

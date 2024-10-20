import styles from "./CartProduct.module.css";
import { useContext } from "react";
import { CartContext } from "../../../../context/CartContext";

const CartProduct = ({ product }) => {
  const { updateQuantity } = useContext(CartContext);
  return (
    <div className={styles.buying}>
      <img className={styles.productImg} alt="product" src={product.imageSrc} />
      <div className={styles.productInfo}>
        <h3>{product.name}</h3>
        <p>Moineau from the popular smartphone game "Azur Lane"</p>
      </div>
      <div className={styles.quantity}>
        <div onClick={() => updateQuantity(product.id, -1)}>
          <p>&minus;</p>
        </div>
        <input readOnly value={product.quantity}></input>
        <div onClick={() => updateQuantity(product.id, 1)}>
          <p>+</p>
        </div>
      </div>
      {product.onSale ? (
        <div className={styles.prices}>
          <s className={styles.oldPrice}>{product.originalPrice}¥</s>
          <p className={styles.actualPrice}>{product.price}¥</p>
        </div>
      ) : (
        <div className={styles.prices}>
          <p className={styles.actualPrice}>{product.price}¥</p>
        </div>
      )}
    </div>
  );
};

export default CartProduct;

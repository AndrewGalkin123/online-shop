import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import CartProduct from "./ProductInCart/CartProduct";
import styles from "./Cart.module.css";
import { PurchasesContext } from "../../../context/PurchasesContext";

const Cart = () => {
  const { cartItems, getTotalPrice, isCartVisible, setCartStatus } =
    useContext(PurchasesContext);
  const navigate = useNavigate();

  const handleCloseCartClick = () => {
    setCartStatus(false);
  };

  const handleCheckoutClick = () => {
    navigate("/checkout"); // redirecting to /checkout
    setCartStatus(false);
  };

  return (
    <div>
      <div
        className={
          isCartVisible
            ? `${styles.basket} ${styles.visibleBasket}`
            : `${styles.basket}`
        }
      >
        <div className={styles.basketHeader}>
          <div className={styles.title}>Basket</div>
          <img
            className={styles.closeButton}
            onClick={handleCloseCartClick}
            src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"
            alt="cross"
          />
        </div>
        <div className={styles.mainContent}>
          <div className={styles.buyings}>
            {cartItems.map((product) => (
              <CartProduct key={product.id} product={product} />
            ))}
          </div>

          <div className={styles.controlContainer}>
            <button
              onClick={handleCloseCartClick}
              className={styles.continueShoppingButton}
            >
              Continue shopping
            </button>

            <div className={styles.confirmBlock}>
              <div className={styles.totalAmount}>{getTotalPrice()}¥</div>

              <button
                className={styles.checkoutButton}
                onClick={handleCheckoutClick}
              >
                CHECKOUT
              </button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={
          isCartVisible
            ? `${styles.blurBackground} ${styles.visibleBlurBack}`
            : `${styles.blurBackground}`
        }
      ></div>
    </div>
  );
};

export default Cart;

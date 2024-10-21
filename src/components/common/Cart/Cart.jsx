import CartProduct from "./ProductInCart/CartProduct";
import styles from "./Cart.module.css";
import { useContext } from "react";
import { CartContext } from "../../../context/CartContext";

const BOT_TOKEN = "7725618525:AAH9QyLTH4UG1iVdF5VaBBj1ERvdU6ctCPo"; // TG-Bot Token
const CHAT_ID = "1066918561"; // chat id where should info be sent
// function to send message
function sendMessageToTelegram(cartItems, totalAmount) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  if (cartItems.length > 0) {
    const message = `New order:\n\n${cartItems
      .map((item, index) => `${index + 1}. ${item.name} - ${item.quantity} pcs`)
      .join("\n")}\n\nTotal: ${totalAmount()}¥`;

    const data = {
      chat_id: CHAT_ID,
      text: message,
    };

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((result) => {
        console.log("Message sent:", result);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    alert("Order has been sent to us!");
  }
}

const Cart = () => {
  const { cartItems, getTotalPrice, clearCart, isCartVisible, setCartStatus } =
    useContext(CartContext);

  const handleCloseCartClick = () => {
    setCartStatus(false);
  };

  //Function to send order when checout is clicked
  const handleCheckoutClick = () => {
    sendMessageToTelegram(cartItems, getTotalPrice);
    clearCart();
    handleCloseCartClick();
  };

  return (
    <div>
      <div
        className={
          isCartVisible
            ? `${styles.basket} ${styles.visible}`
            : `${styles.basket}`
        }
      >
        <div className={styles.basketHeader}>
          <img
            onClick={handleCloseCartClick}
            src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"
            alt="cross"
          />
          <div className={styles.title}>Basket</div>
        </div>
        <div className={styles.buyings}>
          {cartItems.map((product) => (
            <CartProduct key={product.id} product={product} />
          ))}
        </div>
        <div>
          <div className={styles.confirmBlock}>
            <div className={styles.totalAmount}>{getTotalPrice()}¥</div>
            <button
              onClick={handleCheckoutClick}
              className={styles.checkoutButton}
            >
              CHECKOUT
            </button>
          </div>
          <button
            onClick={handleCloseCartClick}
            className={styles.continueShoppingButton}
          >
            Continue shopping
          </button>
        </div>
      </div>
      <div
        className={
          isCartVisible
            ? `${styles.blurBackground} ${styles.visible}`
            : `${styles.blurBackground}`
        }
      ></div>
    </div>
  );
};

export default Cart;

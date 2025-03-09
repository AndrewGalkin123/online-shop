import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import styles from "./CheckoutOrderPage.module.css";

const CheckoutOrderPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { cartItems, getTotalPrice, clearCart, sendMessageToTelegram } =
    useContext(UserContext);

  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleOrderSubmit = () => {
    sendMessageToTelegram(customerInfo);
    clearCart();
  };

  return (
    <div className={styles.checkoutPage}>
      <h2 className={styles.header}>Checkout Order</h2>

      <div className={styles.orderDetails}>
        <h3 className={styles.sectionTitle}>Your Items</h3>
        <ul className={styles.itemList}>
          {cartItems.map((item) => (
            <li key={item.id} className={styles.item}>
              <span className={styles.itemName}>{item.name}</span>
              <span className={styles.itemQuantity}>x{item.quantity}</span>
              <span className={styles.itemPrice}>{item.price}¥</span>
            </li>
          ))}
        </ul>
        <div className={styles.totalPrice}>Total: {getTotalPrice()}¥</div>
      </div>

      <div className={styles.contactForm}>
        <h3 className={styles.sectionTitle}>Your Information</h3>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={customerInfo.name}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={customerInfo.phone}
          onChange={handleChange}
          className={styles.inputField}
        />
        <input
          type="text"
          name="address"
          placeholder="Address"
          value={customerInfo.address}
          onChange={handleChange}
          className={styles.inputField}
        />
      </div>

      <button onClick={handleOrderSubmit} className={styles.confirmButton}>
        Confirm Order
      </button>
    </div>
  );
};

export default CheckoutOrderPage;

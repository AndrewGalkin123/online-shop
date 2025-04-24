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

	const [error, setError] = useState(""); // state for errors
	const [successMessage, setSuccessMessage] = useState(""); // state for success

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCustomerInfo((prevInfo) => ({
			...prevInfo,
			[name]: value,
		}));
	};

	const handleOrderSubmit = () => {
		if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
			setError("Enter all fields");
			setSuccessMessage("");
			return;
		}
		setError("");
		sendMessageToTelegram(customerInfo);
		clearCart();

		// Show message when success
		setSuccessMessage("Your order was successfully sent to us");
		setCustomerInfo({
			name: "",
			phone: "",
			address: "",
		});
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

			<div className="formWrapper">
				<h3 className={styles.sectionTitle}>Your Information</h3>
				<input
					type="text"
					name="name"
					placeholder="Name"
					value={customerInfo.name}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="phone"
					placeholder="Phone"
					value={customerInfo.phone}
					onChange={handleChange}
					required
				/>
				<input
					type="text"
					name="address"
					placeholder="Address"
					value={customerInfo.address}
					onChange={handleChange}
					required
				/>
				{/* Error */}
				{error && <p className={styles.error}>{error}</p>}
				{/* success message */}
				{successMessage && <p className={styles.success}>{successMessage}</p>}
			</div>

			<button
				onClick={handleOrderSubmit}
				className={`gradientButton ${styles.confirmButton}`}
			>
				Confirm Order
			</button>
		</div>
	);
};

export default CheckoutOrderPage;

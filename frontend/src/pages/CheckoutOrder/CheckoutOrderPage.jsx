import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import styles from "./CheckoutOrderPage.module.css";
import { useNavigate } from "react-router-dom";

const CheckoutOrderPage = () => {
	useEffect(() => { window.scrollTo(0, 0); }, []);

	const { cartItems, getTotalPrice, placeOrder } = useContext(UserContext);
	const navigate = useNavigate();

	const [customerInfo, setCustomerInfo] = useState({
		name: "",
		surname: "",
		phone: "",
		address: "",
	});
	const [error, setError] = useState("");
	const [successMessage, setSuccessMessage] = useState("");

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCustomerInfo(prev => ({ ...prev, [name]: value }));
	};

	const handleOrderSubmit = async () => {
		if (!customerInfo.name || !customerInfo.surname || !customerInfo.phone || !customerInfo.address) {
			setError("Enter all fields");
			return;
		}
		setError("");

		try {
			await placeOrder(
				customerInfo.name,
				customerInfo.surname,
				customerInfo.phone,
				customerInfo.address
			);
			setSuccessMessage("Your order was successfully placed!");
			setCustomerInfo({ name: "", surname: "", phone: "", address: "" });
			// Через 2 секунды перенаправляем на главную
			setTimeout(() => navigate("/"), 2000);
		} catch (err) {
			setError(err.message || "Failed to place order");
		}
	};

	return (
		<div className={styles.checkoutPage}>
			<h2 className={styles.header}>Checkout Order</h2>
			<div className={styles.orderDetails}>
				<h3 className={styles.sectionTitle}>Your Items</h3>
				<ul className={styles.itemList}>
					{cartItems.map((item) => (
						<li key={item.productId} className={styles.item}>
							<span className={styles.itemName}>{item.productName}</span>
							<span className={styles.itemQuantity}>x{item.quantity}</span>
							<span className={styles.itemPrice}>{item.price}¥</span>
						</li>
					))}
				</ul>
				<div className={styles.totalPrice}>Total: {getTotalPrice()}¥</div>
			</div>

			<div className="formWrapper">
				<h3 className={styles.sectionTitle}>Delivery Information</h3>
				<input type="text" name="name" placeholder="Name"
					   value={customerInfo.name} onChange={handleChange} required/>
				<input type="text" name="surname" placeholder="Surname"
					   value={customerInfo.surname} onChange={handleChange} required/>
				<input type="text" name="phone" placeholder="Phone"
					   value={customerInfo.phone} onChange={handleChange} required/>
				<input type="text" name="address" placeholder="Address"
					   value={customerInfo.address} onChange={handleChange} required/>
				{error && <p className={styles.error}>{error}</p>}
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

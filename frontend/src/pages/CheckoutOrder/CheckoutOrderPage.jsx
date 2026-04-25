import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../context/UserContext";
import styles from "./CheckoutOrderPage.module.css";
import { useNavigate } from "react-router-dom";
import {showToast} from "../../utils/toast";

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

	const validate = () => {
		if (!customerInfo.name.trim()) return "Name is required";
		if (customerInfo.name.trim().length < 2) return "Name is too short";
		if (!customerInfo.phone.trim()) return "Phone is required";
		if (!/^[+]?[0-9]{7,15}$/.test(customerInfo.phone)) return "Invalid phone number";
		if (!customerInfo.address.trim()) return "Address is required";
		if (customerInfo.address.trim().length < 5) return "Address is too short";
		return null;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setCustomerInfo(prev => ({ ...prev, [name]: value }));
	};

	const handleOrderSubmit = async () => {
		const validationError = validate();
		if (validationError) {
			showToast(validationError, "error");
			return;
		}

		try {
			await placeOrder(
				customerInfo.name,
				customerInfo.phone,
				customerInfo.address
			);
			showToast("Order placed successfully!", "success");
			setTimeout(() => navigate("/"), 2000);
		} catch (err) {
			showToast(err.message, "error");
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

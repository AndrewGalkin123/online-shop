import styles from "./CartProduct.module.css";
import { useContext } from "react";
import { UserContext } from "../../../../context/UserContext";
import React from "react";
import {showToast} from "../../../../utils/toast";

const CartProduct = ({ product }) => {
	const { updateQuantity, removeFromCart } = useContext(UserContext);

	const handleQuantityChange = async (newQty) => {
		try {
			await updateQuantity(product.productId, newQty);
		} catch (err) {
			showToast(err.message, "error");
		}
	};

	const QuantityControl = () => (
		<div className={styles.quantityControl}>
			<button onClick={() => handleQuantityChange(product.quantity - 1)}>−</button>
			<input
				className={styles.quantityInput}
				readOnly
				value={product.quantity}
			/>
			<button onClick={() => handleQuantityChange(product.quantity + 1)}>+</button>
		</div>
	);

	return (
		<div className={styles.cartProduct}>
			<img
				className={styles.productImg}
				alt="product"
				src={product.mainImage || ""}
			/>
			<div className={styles.productDetails}>
				<h3 className={styles.productName}>{product.productName}</h3>
				<div className={styles.productControls}>
					<QuantityControl />
					<div className={styles.productPrice}>
						<p className={styles.actualPrice}>¥{product.price}</p>
					</div>
				</div>
				<button
					onClick={() => removeFromCart({ id: product.productId })}
					className={styles.removeButton}
				>
					Remove
				</button>
			</div>
		</div>
	);
};

export default React.memo(CartProduct);

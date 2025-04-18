import { useState } from "react";
import useCards from "../../../hooks/useCards";
import styles from "./CardManagement.module.css";

const CardManagement = () => {
	const { cards, addCard, deleteCard, updateCard } = useCards();
	const [newCard, setNewCard] = useState({
		name: "",
		description: "",
		price: "",
		originalPrice: "",
		category: "",
		animatedCartoon: "",
		images: 1,
		onSale: true,
	});
	const [editCard, setEditCard] = useState(null);

	const showCustomAlert = () => {
		return new Promise((resolve) => {
			const modal = document.getElementById("customAlert");
			modal.style.display = "block";

			document.getElementById("yesBtn").onclick = () => {
				modal.style.display = "none";
				resolve(true);
			};

			document.getElementById("noBtn").onclick = () => {
				modal.style.display = "none";
				resolve(false);
			};
		});
	};

	return (
		<div className="content">
			<div
				id="customAlert"
				style={{
					display: "none",
					position: "fixed",
					top: "40%",
					left: "50%",
					transform: "translate(-50%, -50%)",
					background: "white",
					padding: "20px",
					borderRadius: "5px",
				}}
			>
				<p style={{ color: "black" }}>Are you sure?</p>
				<button style={{ padding: "20px" }} id="yesBtn">
					Yes
				</button>
				<button style={{ padding: "20px" }} id="noBtn">
					No
				</button>
			</div>
			<h1>Card Control</h1>
			<div className="formWrapper">
				<h2>Creating new card</h2>
				<input
					type="text"
					placeholder="Name"
					value={newCard.name}
					onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
				/>
				<input
					type="text"
					placeholder="Cartoon"
					value={newCard.animatedCartoon}
					onChange={(e) =>
						setNewCard({ ...newCard, animatedCartoon: e.target.value })
					}
				/>
				<input
					type="text"
					placeholder="Description"
					value={newCard.description}
					onChange={(e) =>
						setNewCard({ ...newCard, description: e.target.value })
					}
				/>
				<label>On Sale?</label>
				<select
					value={newCard.onSale}
					onChange={(e) =>
						setNewCard({ ...newCard, onSale: e.target.value === "true" })
					}
				>
					<option value="true">Yes</option>
					<option value="false">No</option>
				</select>
				<label>Number of images</label>
				<select
					value={newCard.images}
					onChange={(e) =>
						setNewCard({ ...newCard, images: Number(e.target.value) })
					}
				>
					<option value="1">1</option>
					<option value="4">4</option>
				</select>

				<input
					type="number"
					placeholder="Price"
					value={newCard.price}
					onChange={(e) => setNewCard({ ...newCard, price: e.target.value })}
				/>
				<input
					type="number"
					placeholder="Original Price"
					value={newCard.originalPrice}
					onChange={(e) =>
						setNewCard({ ...newCard, originalPrice: e.target.value })
					}
				/>
				<input
					type="text"
					placeholder="Category"
					value={newCard.category}
					onChange={(e) => setNewCard({ ...newCard, category: e.target.value })}
				/>

				<button
					className={styles.addButton}
					onClick={() => {
						addCard(newCard);
						setNewCard({
							...newCard,
							name: "",
							description: "",
							price: "",
							originalPrice: "",
							category: "",
							animatedCartoon: "",
						});
					}}
				>
					Add
				</button>
			</div>

			<h2>Cards list</h2>
			<ul className={styles.cardList}>
				{cards.map((card) => (
					<li key={card.id} className={styles.card}>
						<div style={{ width: "100%" }}>
							<div>
								<p>
									{card.name} - {card.price} Y.
								</p>
							</div>
							<div className={styles.cardActions}>
								<button
									onClick={() =>
										setEditCard(editCard?.id === card.id ? null : card)
									}
								>
									Edit
								</button>
								<button
									onClick={async () => {
										const isConfirmed = await showCustomAlert();
										if (isConfirmed) {
											deleteCard(card.id);
										}
									}}
								>
									Delete
								</button>
							</div>
						</div>
						{editCard?.id === card.id && (
							<div className={styles.editForm}>
								<h4>Editing</h4>
								<input
									type="text"
									value={editCard.name}
									onChange={(e) =>
										setEditCard({ ...editCard, name: e.target.value })
									}
								/>
								<input
									type="text"
									value={editCard.description}
									onChange={(e) =>
										setEditCard({ ...editCard, description: e.target.value })
									}
								/>
								<input
									type="number"
									value={editCard.price}
									onChange={(e) =>
										setEditCard({ ...editCard, price: e.target.value })
									}
								/>
								<button
									onClick={() => {
										updateCard(editCard);
										setEditCard(null);
									}}
								>
									Save
								</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CardManagement;

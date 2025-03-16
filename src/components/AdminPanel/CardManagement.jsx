import { useState, useEffect } from "react";
import { db } from "../../firebase";
import {
	collection,
	getDocs,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
} from "firebase/firestore";
import styles from "./CardManagement.module.css";

const CardManagement = () => {
	const [cards, setCards] = useState([]);
	const [newCard, setNewCard] = useState({
		title: "",
		description: "",
		price: "",
		originalPrice: "",
		category: "",
	});
	const [editCard, setEditCard] = useState(null);

	useEffect(() => {
		const fetchCards = async () => {
			const cardCollection = collection(db, "products");
			const cardSnapshot = await getDocs(cardCollection);
			const cardList = cardSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setCards(cardList);
		};
		fetchCards();
	}, []);

	const addCard = async () => {
		await addDoc(collection(db, "products"), newCard);
		setNewCard({
			title: "",
			description: "",
			price: "",
			originalPrice: "",
			category: "",
		});
	};

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

	const deleteCard = async (id) => {
		const userChoice = await showCustomAlert();

		if (userChoice) {
			await deleteDoc(doc(db, "products", id));
			setCards(cards.filter((card) => card.id !== id));
		}
	};

	const updateCard = async () => {
		if (editCard) {
			await updateDoc(doc(db, "products", editCard.id), { ...editCard });
			setEditCard(null);
		}
	};

	return (
		<div className={styles.container}>
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
			<div className={styles.formWrapper}>
				<h2>Creating new card</h2>
				<input
					type="text"
					placeholder="Name"
					value={newCard.name}
					onChange={(e) => setNewCard({ ...newCard, name: e.target.value })}
				/>
				<input
					type="text"
					placeholder="Description"
					value={newCard.description}
					onChange={(e) =>
						setNewCard({ ...newCard, description: e.target.value })
					}
				/>
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

				<button className={styles.addButton} onClick={addCard}>
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
								<button onClick={() => deleteCard(card.id)}>Delete</button>
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
								<button onClick={updateCard}>Save</button>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default CardManagement;

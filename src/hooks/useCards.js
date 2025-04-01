import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
	collection,
	getDocs,
	deleteDoc,
	doc,
	updateDoc,
	setDoc,
	onSnapshot,
} from "firebase/firestore";

const useCards = () => {
	const [cards, setCards] = useState([]);

	// Function to generate images src
	const generateImageSources = (card) => {
		return Array.from(
			{ length: card.images },
			(_, i) => `/images/${card.category}/${card.name}${i + 1}.jpg`
		);
	};

	useEffect(() => {
		const cardCollection = collection(db, "products");

		const unsubscribe = onSnapshot(cardCollection, (snapshot) => {
			const cardList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setCards(cardList);
		});

		return () => unsubscribe();
	}, []);

	// Adding card function
	const addCard = async (newCard) => {
		const { images, onSale, ...cardData } = newCard;

		const maxId = cards.reduce(
			(max, card) => Math.max(max, Number(card.id)),
			0
		);
		const newId = (maxId + 1).toString();

		// Добавляем карточку в Firestore
		const newDocRef = doc(db, "products", newId);
		await setDoc(newDocRef, {
			...cardData,
			id: newId,
			onSale,
			imageSrc: generateImageSources(newCard),
		});

		// Обновляем список карточек
		setCards((prevCards) => [
			...prevCards,
			{
				id: newId,
				...cardData,
				onSale,
				imageSrc: generateImageSources(newCard),
			},
		]);
	};

	// Delete Card Function
	const deleteCard = async (id) => {
		await deleteDoc(doc(db, "products", id));
	};

	// Update Card Function
	const updateCard = async (editCard) => {
		if (editCard) {
			await updateDoc(doc(db, "products", editCard.id), { ...editCard });
			setCards((prevCards) =>
				prevCards.map((card) => (card.id === editCard.id ? editCard : card))
			);
		}
	};
	return { cards, addCard, deleteCard, updateCard };
};

export default useCards;

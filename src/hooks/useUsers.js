import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
	collection,
	addDoc,
	deleteDoc,
	doc,
	updateDoc,
	onSnapshot,
} from "firebase/firestore";

const useUsers = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const userCollection = collection(db, "users");

		const unsubscribe = onSnapshot(userCollection, (snapshot) => {
			const userList = snapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(userList);
		});

		return () => unsubscribe();
	}, []);

	const addUser = async (newUser) => {
		if (!newUser.email.trim()) return;
		await addDoc(collection(db, "users"), newUser);
	};

	const deleteUser = async (id) => {
		await deleteDoc(doc(db, "users", id));
		setUsers(users.filter((user) => user.id !== id));
	};

	const updateUser = async (editUser) => {
		if (editUser) {
			await updateDoc(doc(db, "users", editUser.id), {
				email: editUser.email,
				permission: editUser.permission,
			});
		}
	};
	return { users, updateUser, deleteUser, addUser };
};

export default useUsers;

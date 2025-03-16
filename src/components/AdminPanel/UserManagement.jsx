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
import styles from "./UserManagement.module.css";

const UserManagement = () => {
	const [users, setUsers] = useState([]);
	const [newUser, setNewUser] = useState({ email: "", permission: "user" });
	const [editUser, setEditUser] = useState(null);

	useEffect(() => {
		const fetchUsers = async () => {
			const userCollection = collection(db, "users");
			const userSnapshot = await getDocs(userCollection);
			const userList = userSnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			setUsers(userList);
		};

		fetchUsers();
	}, []);

	const addUser = async () => {
		if (!newUser.email.trim()) return;
		await addDoc(collection(db, "users"), newUser);
		setNewUser({ email: "", permission: "user" });
	};

	const deleteUser = async (id) => {
		await deleteDoc(doc(db, "users", id));
		setUsers(users.filter((user) => user.id !== id));
	};

	const updateUser = async () => {
		if (editUser) {
			await updateDoc(doc(db, "users", editUser.id), {
				email: editUser.email,
				permission: editUser.permission,
			});
			setEditUser(null);
		}
	};

	return (
		<div className={styles.container}>
			<h1>User Management</h1>
			<div className={styles.formWrapper}>
				<h2>Add New User</h2>
				<input
					type="email"
					value={newUser.email}
					onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					placeholder="Email"
				/>
				<select
					value={newUser.permission}
					onChange={(e) =>
						setNewUser({ ...newUser, permission: e.target.value })
					}
				>
					<option value="user">User</option>
					<option value="admin">Admin</option>
				</select>
				<button className={styles.addButton} onClick={addUser}>
					Add User
				</button>
			</div>

			<h3>User List</h3>
			<ul className={styles.userList}>
				{users.map((user) => (
					<li key={user.id} className={styles.userCard}>
						<p>
							{user.email} - {user.permission}
						</p>
						<div className={styles.userActions}>
							<button onClick={() => setEditUser(user)}>Edit</button>
							<button onClick={() => deleteUser(user.id)}>Delete</button>
						</div>
					</li>
				))}
			</ul>

			{editUser && (
				<div className={styles.editForm}>
					<h2>Edit User</h2>
					<input
						type="email"
						value={editUser.email}
						onChange={(e) =>
							setEditUser({ ...editUser, email: e.target.value })
						}
					/>
					<select
						value={editUser.permission}
						onChange={(e) =>
							setEditUser({ ...editUser, permission: e.target.value })
						}
					>
						<option value="user">User</option>
						<option value="admin">Admin</option>
					</select>
					<button className={styles.saveButton} onClick={updateUser}>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default UserManagement;

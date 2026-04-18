import { useState } from "react";
import styles from "./UserManagement.module.css";
import useUsers from "../../../hooks/useUsers";

const UserManagement = () => {
	const { addUser, deleteUser, updateUser, users } = useUsers();
	const [newUser, setNewUser] = useState({ email: "", permission: "user" });
	const [editUser, setEditUser] = useState(null);

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
			<h1>User Management</h1>
			<div className="formWrapper">
				<h2>Add New User</h2>
				<input
					type="email"
					value={newUser.email}
					onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
					placeholder="Email"
				/>
				<input
					type="text"
					value={newUser.firstName}
					onChange={(e) =>
						setNewUser({ ...newUser, firstName: e.target.value })
					}
					placeholder="FirstName"
				/>
				<input
					type="text"
					value={newUser.lastName}
					onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
					placeholder="LastName"
				/>
				<input
					type="number"
					value={newUser.phone}
					onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
					placeholder="Phone"
				/>
				<input
					type="text"
					value={newUser.password}
					onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
					placeholder="Password"
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
				<button
					className={styles.addButton}
					onClick={() => {
						addUser(newUser);
						setNewUser({ email: "", permission: "user" });
					}}
				>
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
							<button
								onClick={async () => {
									const isConfirmed = await showCustomAlert();
									if (isConfirmed) {
										deleteUser(user.id);
									}
								}}
							>
								Delete
							</button>
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
					<input
						type="text"
						value={editUser.firstName}
						onChange={(e) =>
							setEditUser({ ...editUser, firstName: e.target.value })
						}
					/>
					<input
						type="text"
						value={editUser.lastName}
						onChange={(e) =>
							setEditUser({ ...editUser, lastName: e.target.value })
						}
					/>
					<input
						type="number"
						value={editUser.phone}
						onChange={(e) =>
							setEditUser({ ...editUser, phone: e.target.value })
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
					<button
						className={styles.saveButton}
						onClick={() => {
							updateUser(editUser);
							setEditUser(null);
						}}
					>
						Save
					</button>
				</div>
			)}
		</div>
	);
};

export default UserManagement;

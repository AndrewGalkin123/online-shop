import styles from "./Auth.module.css";
import { UserContext } from "../../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import PoppingMenu from "../PoppingMenu/PoppingMenu";
import defaultAvatar from "./Yori1.jpg";
import { Link } from "react-router-dom";

const Auth = () => {
	const { isAuthVisible, setAuthStatus, logIn, signUp, user, logOut, deleteAccount } =
		useContext(UserContext);
	const [isLoginMode, setisLoginMode] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const [shake, setShake] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	const handleClose = () => {
		setAuthStatus(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			if (isLoginMode) {
				await logIn(email, password);
			} else {
				await signUp(email, password, firstName, lastName, phone);
				await logIn(email, password);
			}
		} catch (err) {
			setError(err.message);
			setShake(true);
			setTimeout(() => setShake(false), 500); // Delete shake after 0.5s
		}
	};

	// close error after 5s
	useEffect(() => {
		if (error) {
			const timer = setTimeout(() => setError(""), 5000);
			return () => clearTimeout(timer);
		}
	}, [error]);

	return (
		<PoppingMenu
			title={
				user
					? `Welcome, ${user.firstName}!`
					: isLoginMode
					? "Log In"
					: "Sign Up"
			}
			isVisible={isAuthVisible}
			onClose={handleClose}
		>
			{user ? (
				<div className={styles.userInfo}>
					<img
						src={user.avatar || defaultAvatar}
						alt="User Avatar"
						className={styles.avatar}
					/>
					<h2>
						{user.firstName} {user.lastName}
					</h2>
					<p>
						<strong>Email:</strong> {user.email}
					</p>
					<p>
						<strong>Phone:</strong> {user.phone}
					</p>
					{user.permission === "admin" && (
						<Link to="/adminPanel" className={styles.adminLink}>
							Go to Admin Panel
						</Link>
					)}
					<button onClick={() => logOut()} className={styles.logoutButton}>
						Log Out
					</button>
					{!showDeleteConfirm ? (
						<button
							onClick={() => setShowDeleteConfirm(true)}
							className={styles.deleteButton}
						>
							Delete Account
						</button>
					) : (
						<div className={styles.confirmDelete}>
							<p>Are you sure? This cannot be undone.</p>
							<button
								onClick={async () => {
									await deleteAccount();
									setAuthStatus(false);
								}}
								className={styles.confirmButton}
							>
								Yes, delete
							</button>
							<button
								onClick={() => setShowDeleteConfirm(false)}
								className={styles.cancelButton}
							>
								Cancel
							</button>
						</div>
					)}
				</div>
			) : (
				<form
					className={`formWrapper ${styles.authForm} ${
						shake ? styles.shake : ""
					}`}
					onSubmit={handleSubmit}
				>
					{!isLoginMode && (
						<>
							<div className={styles.formGroup}>
								<label htmlFor="firstName">First Name</label>
								<input
									type="text"
									id="firstName"
									value={firstName}
									onChange={(e) => setFirstName(e.target.value)}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="lastName">Last Name</label>
								<input
									type="text"
									id="lastName"
									value={lastName}
									onChange={(e) => setLastName(e.target.value)}
									required
								/>
							</div>
							<div className={styles.formGroup}>
								<label htmlFor="phone">Phone Number</label>
								<input
									type="tel"
									id="phone"
									value={phone}
									onChange={(e) => setPhone(e.target.value)}
									required
								/>
							</div>
						</>
					)}
					<div className={styles.formGroup}>
						<label htmlFor="email">Email</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
						/>
					</div>
					<div className={styles.formGroup}>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
					</div>
					{error && <p className={styles.error}>{error}</p>}
					<button type="submit" className={styles.submitButton}>
						{isLoginMode ? "Log In" : "Sign Up"}
					</button>
					<div className={styles.switchMode}>
						<p>
							{isLoginMode
								? "Don't have an account? "
								: "Already have an account? "}
							<button
								type="button"
								onClick={() => setisLoginMode(!isLoginMode)}
								className={styles.switchButton}
							>
								{isLoginMode ? "Sign Up" : "Log In"}
							</button>
						</p>
					</div>
				</form>
			)}
		</PoppingMenu>
	);
};

export default Auth;

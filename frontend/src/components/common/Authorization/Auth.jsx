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

	const validate = () => {
		if (!email.trim()) return "Email is required";
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format";
		if (!password) return "Password is required";
		if (password.length < 6) return "Password must be at least 6 characters";
		if (!isLoginMode) {
			if (!firstName.trim()) return "First name is required";
			if (!lastName.trim()) return "Last name is required";
			if (!phone.trim()) return "Phone is required";
			if (!/^[+]?[0-9]{7,15}$/.test(phone)) return "Invalid phone number";
		}
		return null;
	};

	const handleClose = () => {
		setAuthStatus(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");

		// Валидация перед отправкой
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			setShake(true);
			setTimeout(() => setShake(false), 500);
			return;
		}

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
			setTimeout(() => setShake(false), 500);
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

					{/* Шапка */}
					{/* Шапка */}
					<div className={styles.profileHeader}>
						<div className={styles.profileBg} />
						<div className={styles.avatarWrapper}>
							<img
								src={user.avatar || defaultAvatar}
								alt="Avatar"
								className={styles.avatar}
							/>
						</div>
						<div className={styles.profileName}>
							{user.firstName} {user.lastName}
						</div>
						{/* Показываем роль красиво */}
						<div className={styles.profileRole}>
							{user.role === "ROLE_ADMIN" ? "Administrator"
								: user.role === "ROLE_MANAGER" ? "Manager"
									: "Member"}
						</div>
					</div>

					{/* Инфо */}
					<div className={styles.profileBody}>
						<div className={styles.infoRow}>
							<span className={styles.infoIcon}>📧</span>
							<span className={styles.infoLabel}>Email</span>
							<span className={styles.infoValue}>{user.email}</span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoIcon}>👤</span>
							<span className={styles.infoLabel}>Name</span>
							<span className={styles.infoValue}>
                    {user.firstName} {user.lastName}
                </span>
						</div>
						<div className={styles.infoRow}>
							<span className={styles.infoIcon}>📱</span>
							<span className={styles.infoLabel}>Phone</span>
							<span className={styles.infoValue}>
                    {user.phone || "—"}
                </span>
						</div>
					</div>

					{/* Кнопки */}
					<div className={styles.actions}>
						<Link
							to="/orders"
							onClick={() => setAuthStatus(false)}
							className={styles.ordersLink}
						>
							📦 My Orders
						</Link>

						<button
							onClick={() => logOut()}
							className={styles.logoutButton}
						>
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
								<div className={styles.confirmRow}>
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
							</div>
						)}
					</div>
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

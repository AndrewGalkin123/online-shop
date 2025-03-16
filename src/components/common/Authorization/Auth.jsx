import styles from "./Auth.module.css";
import { UserContext } from "../../../context/UserContext";
import { useContext, useState } from "react";
import PoppingMenu from "../PoppingMenu/PoppingMenu";
import defaultAvatar from "./Yori1.jpg";

const Auth = () => {
	const { isAuthVisible, setAuthStatus, logIn, signUp, user, logOut } =
		useContext(UserContext);
	const [isLogin, setIsLogin] = useState(false);
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [phone, setPhone] = useState("");
	const [error, setError] = useState("");
	const handleClose = () => {
		setAuthStatus(false);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError("");
		try {
			if (isLogin) {
				await logIn(email, password);
			} else {
				await signUp(email, password, firstName, lastName, phone);
			}
		} catch (err) {
			setError(err.message);
			console.error(err);
		}
	};

	return (
		<PoppingMenu
			title={
				user ? `Welcome, ${user.firstName}!` : isLogin ? "Log In" : "Sign Up"
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
					<button onClick={() => logOut()} className={styles.logoutButton}>
						Log Out
					</button>
				</div>
			) : (
				<form className={styles.authForm} onSubmit={handleSubmit}>
					{!isLogin && (
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
						{isLogin ? "Log In" : "Sign Up"}
					</button>
					<div className={styles.switchMode}>
						<p>
							{isLogin
								? "Don't have an account? "
								: "Already have an account? "}
							<button
								type="button"
								onClick={() => setIsLogin(!isLogin)}
								className={styles.switchButton}
							>
								{isLogin ? "Sign Up" : "Log In"}
							</button>
						</p>
					</div>
				</form>
			)}
		</PoppingMenu>
	);
};

export default Auth;

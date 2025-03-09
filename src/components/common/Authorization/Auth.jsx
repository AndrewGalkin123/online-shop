import styles from "./Auth.module.css";
import { UserContext } from "../../../context/UserContext";
import { useContext, useState } from "react";
import PoppingMenu from "../PoppingMenu /PoppingMenu";
import { auth, db } from "../../../firebase"; // Импорт Firebase auth и Firestore
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; // Методы работы с Firestore

const Auth = () => {
    const { isAuthVisible, setAuthStatus } = useContext(UserContext);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [permission, setPermission] = useState("user"); // По умолчанию permission 'user'

    const handleClose = () => {
        setAuthStatus(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                // Авторизация пользователя
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Загрузка данных permission из Firestore
                const userDocRef = doc(db, "users", user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    alert(`Logged in! Permission: ${userData.permission}`);
                } else {
                    alert("Logged in! But no additional data found.");
                }

                handleClose();
            } else {
                // Регистрация пользователя
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;

                // Сохранение дополнительных данных в Firestore
                await setDoc(doc(db, "users", user.uid), {
                    firstName,
                    lastName,
                    phone,
                    email,
                    permission: "user",
                });

                alert("Successfully registered with permission: " + permission);
                handleClose();
            }
        } catch (err) {
            setError(err.message);
            console.error(err);
        }
    };

    return (
        <PoppingMenu title={isLogin ? "Log In" : "Sign Up"} isVisible={isAuthVisible} onClose={handleClose}>
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
            </form>

            <div className={styles.switchMode}>
                <p>
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className={styles.switchButton}
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </p>
            </div>
        </PoppingMenu>
    );
};

export default Auth;

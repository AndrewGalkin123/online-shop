import { UserContext } from "../../context/UserContext";
import { useContext, useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import styles from "./AdminPanel.module.css";
import CardManagement from "../../components/AdminPanel/CardManagement/CardManagement";
import UserManagement from "../../components/AdminPanel/UserManagement/UserManagement";

const AdminPanel = () => {
	const { user } = useContext(UserContext);
	const [isAdmin, setIsAdmin] = useState(null);
	const [activeTab, setActiveTab] = useState("users");

	useEffect(() => {
		if (user?.uid) {
			const checkAdmin = async () => {
				const userRef = doc(db, "users", user.uid);
				const userSnap = await getDoc(userRef);

				if (userSnap.exists() && userSnap.data().permission === "admin") {
					setIsAdmin(true);
				} else {
					setIsAdmin(false);
				}
			};
			checkAdmin();
		} else {
			setIsAdmin(false);
		}
	}, [user]);

	if (isAdmin === null) return <div>Загрузка...</div>;
	if (isAdmin === false) return <div>Not allowed for you</div>;

	return (
		<div className={styles.adminPanel}>
			<div className={styles.sidebar}>
				<h2>AdminPanel</h2>
				<ul>
					<li onClick={() => setActiveTab("users")}>Users</li>
					<li onClick={() => setActiveTab("cards")}>Cards</li>
					<li onClick={() => setActiveTab("settings")}>Settings</li>
				</ul>
			</div>
			<div className={styles.mainContent}>
				{activeTab === "users" && <UserManagement />}
				{activeTab === "cards" && <CardManagement />}
			</div>
		</div>
	);
};

export default AdminPanel;

import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import styles from "./AdminPanel.module.css";
import OrdersTab from "../../components/AdminPanel/OrdersTab/OrdersTab";
import ProductsTab from "../../components/AdminPanel/ProductsTab/ProductsTab";
import UsersTab from "../../components/AdminPanel/UsersTab/UsersTab";
import ReportsTab from "../../components/AdminPanel/ReportsTab/ReportsTab";
import LogsTab from "../../components/AdminPanel/LogsTab/LogsTab";

const AdminPanel = () => {
	const { user } = useContext(UserContext);
	const [activeTab, setActiveTab] = useState("orders");
	const isAdmin = user?.role === "ROLE_ADMIN";

	// Проверяем роль из токена — у нас нет roles в localStorage
	// Просто проверяем что пользователь залогинен
	// Реальная защита на бэкенде через @PreAuthorize
	if (!user) {
		return <div style={{ color: "white", padding: "20px" }}>
			Please log in
		</div>;
	}

	const tabs = [
		{ id: "orders", label: "Orders" },
		{ id: "products", label: "Products" },
		{ id: "users", label: "Users" },
		{ id: "reports", label: "Reports" },
		...(isAdmin ? [{ id: "logs", label: "Logs" }] : []),
	];

	return (
		<div className={styles.adminPanel}>
			<div className={styles.sidebar}>
				<h2>Panel</h2>
				<ul>
					{tabs.map(tab => (
						<li
							key={tab.id}
							onClick={() => setActiveTab(tab.id)}
							className={activeTab === tab.id ? styles.active : ""}
						>
							{tab.label}
						</li>
					))}
				</ul>
			</div>
			<div className={styles.mainContent}>
				{activeTab === "orders"   && <OrdersTab />}
				{activeTab === "products" && <ProductsTab />}
				{activeTab === "users"    && <UsersTab isAdmin={isAdmin}/>}
				{activeTab === "reports"  && <ReportsTab />}
				{activeTab === "logs"     && isAdmin && <LogsTab />}
			</div>
		</div>
	);
};

export default AdminPanel;
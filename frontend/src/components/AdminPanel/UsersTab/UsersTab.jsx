import { useState, useEffect } from "react";
import {
    getAllUsers,
    getUserStatistics,
    changeUserRole,
    deactivateUser, activateUser,
} from "../../../api/adminApi";
import styles from "../admin.module.css";


const ROLES = ["ROLE_USER", "ROLE_MANAGER", "ROLE_ADMIN"];

const UsersTab = ({ isAdmin }) => {
    const [users, setUsers] = useState([]);
    const [statistics, setStatistics] = useState([]);
    const [activeSection, setActiveSection] = useState("list");

    useEffect(() => {
        getAllUsers().then(setUsers);
        getUserStatistics().then(setStatistics);
    }, []);

    const handleChangeRole = async (id, role) => {
        await changeUserRole(id, role);
        const updated = await getAllUsers();
        setUsers(updated);
    };

    const handleDeactivate = async (id) => {
        if (!window.confirm("Deactivate this user?")) return;
        await deactivateUser(id);
        const updated = await getAllUsers();
        setUsers(updated);
    };

    const handleActivate = async (id) => {
        if (!window.confirm("Active this user?")) return;
        await activateUser(id);
        const updated = await getAllUsers();
        setUsers(updated);
    }

    return (
        <div className={styles.container}>
            <h1>Users</h1>
            <div className={styles.tabs}>
                <button
                    onClick={() => setActiveSection("list")}
                    className={activeSection === "list" ? styles.activeTab : ""}
                >
                    User List
                </button>
                <button
                    onClick={() => setActiveSection("stats")}
                    className={activeSection === "stats" ? styles.activeTab : ""}
                >
                    Statistics
                </button>
            </div>

            {activeSection === "list" && (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Total Spent</th>
                        <th>Role</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.email}</td>
                            <td>{u.firstName} {u.lastName}</td>
                            <td>{u.totalSpent}¥</td>
                            {isAdmin ? (
                                <td>
                                    <select
                                        value={u.role}
                                        onChange={e => handleChangeRole(u.id, e.target.value)}
                                        className={styles.roleSelect}
                                    >
                                        {ROLES.map(r => (
                                            <option key={r} value={r}>{r}</option>
                                        ))}
                                    </select>
                                </td>
                            ) : (
                                <span style={{color: "rgba(255,255,255,0.5)", fontSize: "13px"}}>
                                    {u.role}
                                </span>
                            )}
                            <td>
                                <span style={{
                                    color: u.isActive ? "#22c55e" : "#ef4444",
                                    fontSize: "13px",
                                    fontWeight: "500"
                                }}>
                                    {u.isActive ? "Active" : "Inactive"}
                                </span>
                            </td>
                            {isAdmin && (
                                <td>
                                    {u.isActive ? (
                                        <button
                                            onClick={() => handleDeactivate(u.id)}
                                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                        >
                                            Deactivate
                                        </button>
                                    ): (
                                        <button
                                            onClick={() => handleActivate(u.id)}
                                            className={`${styles.actionBtn} ${styles.activateBtn}`}
                                        >
                                            Activate
                                        </button>)}

                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {activeSection === "stats" && (
                <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Orders</th>
                        <th>Total Spent</th>
                    </tr>
                    </thead>
                    <tbody>
                    {statistics.map(s => (
                        <tr key={s.id}>
                            <td>{s.email}</td>
                            <td>{s.totalOrders}</td>
                            <td>{s.totalSpent}¥</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default UsersTab;
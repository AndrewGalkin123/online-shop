import { useState, useEffect } from "react";
import { getUserLogs } from "../../../api/adminApi";
import styles from "../admin.module.css";

const LogsTab = () => {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        getUserLogs().then(setLogs);
    }, []);

    return (
        <div className={styles.container}>
            <h1>User Logs</h1>
            <table className={styles.table}>
                <thead>
                <tr><th>User ID</th><th>Action</th><th>Details</th><th>Date</th></tr>
                </thead>
                <tbody>
                {logs.map(log => (
                    <tr key={log.id}>
                        <td>{log.user?.id || "—"}</td>
                        <td>
                                <span className={`${styles.badge} ${styles[log.action?.toLowerCase()]}`}>
                                    {log.action}
                                </span>
                        </td>
                        <td>{log.details}</td>
                        <td>{new Date(log.createdAt).toLocaleString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default LogsTab;
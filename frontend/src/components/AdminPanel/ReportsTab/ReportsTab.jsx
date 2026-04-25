import { useState, useEffect } from "react";
import { getMonthlySales } from "../../../api/adminApi";
import styles from "../admin.module.css";


const ReportsTab = () => {
    const [sales, setSales] = useState([]);

    useEffect(() => {
        getMonthlySales().then(setSales);
    }, []);

    return (
        <div className={styles.container}>
            <h1>Monthly Sales Report</h1>
            <table className={styles.table}>
                <thead>
                <tr><th>Month</th><th>Orders</th><th>Revenue</th></tr>
                </thead>
                <tbody>
                {sales.map((s, i) => (
                    <tr key={i}>
                        <td>{new Date(s.month).toLocaleDateString("en", {
                            year: "numeric", month: "long"
                        })}</td>
                        <td>{s.totalOrders}</td>
                        <td>{s.totalRevenue}¥</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default ReportsTab;
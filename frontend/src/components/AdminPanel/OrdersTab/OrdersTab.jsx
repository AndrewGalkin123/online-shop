import { useState, useEffect } from "react";
import { getAllOrders, getOrderDetails, updateOrderStatus } from "../../../api/adminApi";
import styles from "../admin.module.css";


const STATUSES = ["CREATED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const OrdersTab = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrders()
            .then(setOrders)
            .finally(() => setLoading(false));
    }, []);

    const handleSelectOrder = async (id) => {
        const data = await getOrderDetails(id);
        setSelectedOrder(data);
    };

    const handleStatusChange = async (id, status) => {
        await updateOrderStatus(id, status);
        // Обновляем список
        const updated = await getAllOrders();
        setOrders(updated);
        if (selectedOrder?.id === id) {
            setSelectedOrder(prev => ({ ...prev, status }));
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className={styles.container}>
            <h1>Orders</h1>

            {/* Список заказов */}
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {orders.map(order => (
                    <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.email}</td>
                        <td>
                            <select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                className={styles.statusSelect}
                            >
                                {STATUSES.map(s => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </td>
                        <td>{order.totalAmount}¥</td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>
                            <button
                                onClick={() => handleSelectOrder(order.id)}
                                className={styles.detailsBtn}
                            >
                                Details
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {/* Детали заказа */}
            {selectedOrder && (
                <div className={styles.orderDetails}>
                    <h3>Order #{selectedOrder.id}</h3>
                    <p>Status: <strong>{selectedOrder.status}</strong></p>

                    <h4 style={{ marginTop: "12px", color: "rgba(255,255,255,0.6)" }}>
                        Delivery
                    </h4>
                    <p>Name: {selectedOrder.customerName}</p>
                    <p>Phone: {selectedOrder.customerPhone}</p>
                    <p>Address: {selectedOrder.customerAddress}</p>

                    <h4 style={{ marginTop: "12px", color: "rgba(255,255,255,0.6)" }}>
                        Items
                    </h4>
                    <ul>
                        {selectedOrder.items?.map(item => (
                            <li key={item.productId}>
                                {item.productName} × {item.quantity} = {item.totalPrice}¥
                            </li>
                        ))}
                    </ul>
                    <p><strong>Total: {selectedOrder.totalAmount}¥</strong></p>
                    <button onClick={() => setSelectedOrder(null)}>Close</button>
                </div>
            )}
        </div>
    );
};

export default OrdersTab;
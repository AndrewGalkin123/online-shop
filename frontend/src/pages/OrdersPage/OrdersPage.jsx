import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { getMyOrders, getOrderById } from "../../api/orderApi";
import { UserContext } from "../../context/UserContext";
import styles from "./OrdersPage.module.css";

// Цвет и текст для каждого статуса
const STATUS_CONFIG = {
    CREATED:    { color: "#60a5fa", label: "Created" },
    PROCESSING: { color: "#eab308", label: "Processing" },
    SHIPPED:    { color: "#a78bfa", label: "Shipped" },
    DELIVERED:  { color: "#22c55e", label: "Delivered" },
    CANCELLED:  { color: "#ef4444", label: "Cancelled" },
};

const OrdersPage = () => {
    const { user } = useContext(UserContext);
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (user) {
            getMyOrders()
                .then(setOrders)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [user]);

    const handleSelectOrder = async (id) => {
        // Если кликнули на уже открытый — закрываем
        if (selectedOrder?.id === id) {
            setSelectedOrder(null);
            return;
        }
        const data = await getOrderById(id);
        setSelectedOrder(data);
    };

    // Если не залогинен
    if (!user) {
        return (
            <main className={styles.main}>
                <div className={styles.empty}>
                    <h2>Please log in to see your orders</h2>
                </div>
            </main>
        );
    }

    if (loading) {
        return (
            <main className={styles.main}>
                <div className={styles.empty}>
                    <p>Loading...</p>
                </div>
            </main>
        );
    }

    if (orders.length === 0) {
        return (
            <main className={styles.main}>
                <h1 className={styles.title}>My Orders</h1>
                <div className={styles.empty}>
                    <p>You have no orders yet</p>
                    <Link to="/" className={styles.shopLink}>
                        Start shopping
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.main}>
            <h1 className={styles.title}>My Orders</h1>

            <div className={styles.list}>
                {orders.map(order => {
                    const status = STATUS_CONFIG[order.status] || STATUS_CONFIG.CREATED;
                    const isOpen = selectedOrder?.id === order.id;

                    return (
                        <div key={order.id} className={styles.card}>
                            {/* Шапка заказа */}
                            <div
                                className={styles.cardHeader}
                                onClick={() => handleSelectOrder(order.id)}
                            >
                                <div className={styles.orderInfo}>
                                    <span className={styles.orderId}>
                                        Order #{order.id}
                                    </span>
                                    <span className={styles.date}>
                                        {new Date(order.createdAt).toLocaleDateString("en", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })}
                                    </span>
                                </div>

                                <div className={styles.orderMeta}>
                                    <span
                                        className={styles.status}
                                        style={{ color: status.color, borderColor: status.color }}
                                    >
                                        {status.label}
                                    </span>
                                    <span className={styles.total}>
                                        {order.totalAmount}¥
                                    </span>
                                    <span className={styles.arrow}>
                                        {isOpen ? "▲" : "▼"}
                                    </span>
                                </div>
                            </div>

                            {/* Прогресс статусов */}
                            {isOpen && selectedOrder && (
                                <div className={styles.cardBody}>
                                    <div className={styles.progressBar}>
                                        {["CREATED", "PROCESSING", "SHIPPED", "DELIVERED"].map((s, i) => {
                                            const steps = ["CREATED", "PROCESSING", "SHIPPED", "DELIVERED"];
                                            const currentIndex = steps.indexOf(selectedOrder.status);
                                            const isActive = i <= currentIndex;
                                            const isCancelled = selectedOrder.status === "CANCELLED";

                                            return (
                                                <div key={s} className={styles.step}>
                                                    <div
                                                        className={styles.stepDot}
                                                        style={{
                                                            background: isCancelled
                                                                ? "#ef4444"
                                                                : isActive ? "#22c55e" : "rgba(255,255,255,0.2)",
                                                            borderColor: isCancelled
                                                                ? "#ef4444"
                                                                : isActive ? "#22c55e" : "rgba(255,255,255,0.2)",
                                                        }}
                                                    />
                                                    <span className={styles.stepLabel}
                                                          style={{
                                                              color: isCancelled
                                                                  ? "#ef4444"
                                                                  : isActive
                                                                      ? "white"
                                                                      : "rgba(255,255,255,0.3)"
                                                          }}
                                                    >
                                                        {STATUS_CONFIG[s].label}
                                                    </span>
                                                    {i < 3 && (
                                                        <div
                                                            className={styles.stepLine}
                                                            style={{
                                                                background: isActive && i < currentIndex
                                                                    ? "#22c55e"
                                                                    : "rgba(255,255,255,0.1)"
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Товары */}
                                    <div className={styles.items}>
                                        <h4 className={styles.itemsTitle}>Items</h4>
                                        {selectedOrder.items?.map(item => (
                                            <div key={item.productId} className={styles.item}>
                                                <span className={styles.itemName}>
                                                    {item.productName}
                                                </span>
                                                <span className={styles.itemQty}>
                                                    × {item.quantity}
                                                </span>
                                                <span className={styles.itemPrice}>
                                                    {item.totalPrice}¥
                                                </span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Доставка */}
                                    <div className={styles.delivery}>
                                        <h4 className={styles.itemsTitle}>Delivery</h4>
                                        <p>{selectedOrder.customerName}</p>
                                        <p>{selectedOrder.customerPhone}</p>
                                        <p>{selectedOrder.customerAddress}</p>
                                    </div>

                                    <div className={styles.totalRow}>
                                        <span>Total</span>
                                        <span className={styles.totalAmount}>
                                            {selectedOrder.totalAmount}¥
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default OrdersPage;
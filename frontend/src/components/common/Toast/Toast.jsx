import { useEffect } from "react";
import styles from "./Toast.module.css";

const Toast = ({ message, type = "error", onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <span>{message}</span>
            <button onClick={onClose} className={styles.close}>×</button>
        </div>
    );
};

export default Toast;
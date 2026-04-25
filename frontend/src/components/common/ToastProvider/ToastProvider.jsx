import { useState, useEffect } from "react";
import Toast from "../Toast/Toast";

const ToastProvider = () => {
    const [toast, setToast] = useState(null); // ← один тост вместо массива

    useEffect(() => {
        const handler = (e) => {
            const { message, type } = e.detail;
            // Новый тост просто заменяет старый
            setToast({ id: Date.now(), message, type });
        };

        window.addEventListener("show-toast", handler);
        return () => window.removeEventListener("show-toast", handler);
    }, []);

    return (
        <>
            {toast && (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
};

export default ToastProvider;
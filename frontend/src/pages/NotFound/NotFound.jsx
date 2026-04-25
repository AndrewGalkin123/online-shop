import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import styles from "./NotFound.module.css";

const NotFound = () => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        setTimeout(() => setVisible(true), 50);
    }, []);

    return (
        <main className={`${styles.main} ${visible ? styles.visible : ""}`}>
            {/* Декоративные круги на фоне */}
            <div className={styles.bgCircle1} />
            <div className={styles.bgCircle2} />

            <div className={styles.content}>
                {/* Большой 404 */}
                <div className={styles.code}>
                    <span className={styles.four}>4</span>
                    <span className={styles.zero}>0</span>
                    <span className={styles.four}>4</span>
                </div>

                <div className={styles.divider} />

                <h1 className={styles.title}>Page not found</h1>
                <p className={styles.description}>
                    The page you are looking for doesn't exist or has been moved.
                </p>

                <div className={styles.actions}>
                    <Link to="/" className={styles.homeBtn}>
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className={styles.backBtn}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </main>
    );
};

export default NotFound;
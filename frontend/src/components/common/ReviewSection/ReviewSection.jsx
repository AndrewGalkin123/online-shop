import { useState, useEffect, useContext } from "react";
import { getProductReviews, createReview, deleteReview } from "../../../api/reviewApi";
import { UserContext } from "../../../context/UserContext";
import { showToast } from "../../../utils/toast";
import styles from "./ReviewSection.module.css";

const STARS = [1, 2, 3, 4, 5];

const ReviewSection = ({ productId }) => {
    const { user } = useContext(UserContext);
    const [data, setData] = useState(null); // { averageRating, totalReviews, reviews }
    const [message, setMessage] = useState("");
    const [rating, setRating] = useState(5);
    const [hovered, setHovered] = useState(0);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        const result = await getProductReviews(productId);
        setData(result);
    };

    useEffect(() => {
        if (productId) load();
    }, [productId]);

    const handleSubmit = async () => {
        if (!message.trim()) {
            showToast("Write a message first", "error");
            return;
        }
        setLoading(true);
        try {
            await createReview(productId, message, rating);
            setMessage("");
            setRating(5);
            await load();
            showToast("Review added!", "success");
        } catch (err) {
            showToast(err.message, "error");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        try {
            await deleteReview(reviewId);
            await load();
            showToast("Review deleted", "success");
        } catch (err) {
            showToast(err.message, "error");
        }
    };

    if (!data) return null;

    return (
        <section className={styles.section}>
            {/* Заголовок с рейтингом */}
            <div className={styles.header}>
                <h2 className={styles.title}>Reviews</h2>
                <div className={styles.summary}>
                    <span className={styles.avgRating}>
                        ⭐ {Number(data.averageRating).toFixed(1)}
                    </span>
                    <span className={styles.totalReviews}>
                        {data.totalReviews} {data.totalReviews === 1 ? "review" : "reviews"}
                    </span>
                </div>
            </div>

            {/* Форма добавления — только для залогиненных */}
            {user ? (
                <div className={styles.form}>
                    {/* Звёзды */}
                    <div className={styles.stars}>
                        {STARS.map(star => (
                            <span
                                key={star}
                                className={styles.star}
                                style={{
                                    color: star <= (hovered || rating)
                                        ? "#eab308"
                                        : "rgba(255,255,255,0.2)"
                                }}
                                onMouseEnter={() => setHovered(star)}
                                onMouseLeave={() => setHovered(0)}
                                onClick={() => setRating(star)}
                            >
                                ★
                            </span>
                        ))}
                        <span className={styles.ratingLabel}>
                            {rating} / 5
                        </span>
                    </div>

                    {/* Текст */}
                    <textarea
                        className={styles.textarea}
                        placeholder="Share your thoughts about this product..."
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        rows={3}
                    />

                    <button
                        className={styles.submitBtn}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Submit Review"}
                    </button>
                </div>
            ) : (
                <p className={styles.loginHint}>
                    Log in to leave a review
                </p>
            )}

            {/* Список отзывов */}
            <div className={styles.list}>
                {data.reviews.length === 0 ? (
                    <p className={styles.empty}>No reviews yet. Be the first!</p>
                ) : (
                    data.reviews.map(review => (
                        <div key={review.id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.cardLeft}>
                                    <span className={styles.author}>
                                        {review.authorName}
                                    </span>
                                    <div className={styles.cardStars}>
                                        {STARS.map(s => (
                                            <span
                                                key={s}
                                                style={{
                                                    color: s <= review.rating
                                                        ? "#eab308"
                                                        : "rgba(255,255,255,0.15)"
                                                }}
                                            >★</span>
                                        ))}
                                    </div>
                                </div>
                                <div className={styles.cardRight}>
                                    <span className={styles.date}>
                                        {new Date(review.createdAt).toLocaleDateString("en", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric"
                                        })}
                                    </span>
                                    {/* Кнопка удаления — только если это твой отзыв */}
                                    {user?.email === review.authorEmail && (
                                        <button
                                            className={styles.deleteBtn}
                                            onClick={() => handleDelete(review.id)}
                                        >
                                            Delete
                                        </button>
                                    )}
                                </div>
                            </div>
                            <p className={styles.message}>{review.message}</p>
                        </div>
                    ))
                )}
            </div>
        </section>
    );
};

export default ReviewSection;
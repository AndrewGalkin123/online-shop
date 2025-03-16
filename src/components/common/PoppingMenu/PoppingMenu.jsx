import styles from "./PoppingMenu.module.css";

const PoppingMenu = ({ children, title, isVisible, onClose }) => {
	return (
		<div>
			<div
				className={
					isVisible
						? `${styles.poppingMenu} ${styles.visiblePoppingMenu}`
						: `${styles.poppingMenu}`
				}
			>
				<div className={styles.menuHeader}>
					<div className={styles.title}>{title}</div>
					<img
						onClick={onClose}
						className={styles.closeButton}
						src="https://png.klev.club/uploads/posts/2024-04/png-klev-club-vmnn-p-belii-krestik-png-20.png"
						alt="cross"
					/>
				</div>
				{children}
			</div>
			<div
				className={
					isVisible
						? `${styles.blurBackground} ${styles.visibleBlurBack}`
						: `${styles.blurBackground}`
				}
			></div>
		</div>
	);
};

export default PoppingMenu;

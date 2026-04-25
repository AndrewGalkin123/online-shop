import {useState, useEffect, useContext} from "react";
import ProductCard from "../../components/common/ProductCard/ProductCard";
import { useParams } from "react-router-dom";
import styles from "./ProductsPage.module.css";
import { convertPath } from "../../utils/utils";
import {getProductsByCategory, getProductsByIds} from "../../api/productsApi";
import {UserContext} from "../../context/UserContext";
import {getCategoryBySlug} from "../../api/productsApi";

const ProductsPage = () => {
	const { products: category } = useParams();
	const { selectedItems } = useContext(UserContext);
	const [products, setProducts] = useState([]);
	const [categoryTitle, setCategoryTitle] = useState("");
	const [loading, setLoading] = useState(true);


	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true);
			try {
				if (category === "favourites") {
					setCategoryTitle("Favourites");
					if (selectedItems.length === 0) {
						setProducts([]);
						return;
					}
					const data = await getProductsByIds(selectedItems);
					setProducts(data);
				} else {
					const [categoryData, productsData] = await Promise.all([
						getCategoryBySlug(category),
						getProductsByCategory(category),
					]);
					setCategoryTitle(categoryData.name);
					setProducts(productsData.content);
				}
			} catch (error) {
				console.error(error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [category]);

	if (loading) {
		return <h2 style={{ color: "white" }}>Loading...</h2>;
	}

	return (
		<main className={`${styles.catalog}`}>
			<h1 className={styles.title}>{categoryTitle}</h1>
			<div className={`${styles.products} content`}>
				{products.length ? (
					products.map((el) => <ProductCard key={el.id} product={el} />)
				) : (
					<h1 style={{color: "white"}}>
						No products found.
					</h1>
				)}
			</div>
		</main>
	);
};

export default ProductsPage;

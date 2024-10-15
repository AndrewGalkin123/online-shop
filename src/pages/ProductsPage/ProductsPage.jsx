import ProductCard from "../../components/common/ProductCard/ProductCard";
import { products } from "../../data/products";
import { useParams } from "react-router-dom";
import styles from "./ProductsPage.module.css";

const title = (title) => {
  if (!title) return title;

  return (title[0].toUpperCase() + title.slice(1))
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const ProductsPage = () => {
  const category = useParams();

  const filteredProducts = products.filter(
    (product) => product.category === category.products
  );
  console.log(filteredProducts);
  return (
    <div className={styles.catalog}>
      <h1 className={styles.title}>{title(category.products)}</h1>
      <div className={styles.products}>
        {filteredProducts.map((el) => (
          <ProductCard
            imageSrc={el.imageSrc}
            onSale={el.onSale}
            cardTitle={el.name}
            price={el.price}
            originalPrice={el.originalPrice}
            id={el.id}
            category={el.category}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;

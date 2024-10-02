import ProductCard from "../../components/common/ProductCard/ProductCard";

let arr = [1, 2, 3, 4, 5, 5, 5, 5, 5, 3, 43, 43, 2];
const Sale = () => {
  return (
    <div className="catalog">
      <h1 className="title">Sale</h1>
      <div className="products">
        {arr.map((el) => (
          <ProductCard />
        ))}
      </div>
    </div>
  );
};

export default Sale;

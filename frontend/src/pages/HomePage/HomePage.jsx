import Introduction from "../../components/HomePageComponents/Introduction/Introduction";
import Offer from "../../components/HomePageComponents/Offer/Offer";
import { newCollection, sale, bestSellings } from "./offersProducts";
import { useEffect } from "react";

const Home = ({ setCatalogStatus }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <main>
      <Introduction setCatalogStatus={setCatalogStatus} />
      <Offer title="NEW COLLECTION" products={newCollection} />
      <Offer title="SALE" products={sale} />
      <Offer title="BEST SELLINGS" products={bestSellings} />
    </main>
  );
};

export default Home;

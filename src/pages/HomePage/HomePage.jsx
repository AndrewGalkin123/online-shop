import Introduction from "../../components/HomePageComponents/Introduction/Introduction";
import Offer from "../../components/HomePageComponents/Offer/Offer";
import { newCollection, sale, bestSellings } from "./offersProducts";

const Home = () => {
  return (
    <main>
      <Introduction />
      <Offer title="NEW COLLECTION" products={newCollection} />
      <Offer title="SALE" products={sale} />
      <Offer title="BEST SELLINGS" products={bestSellings} />
    </main>
  );
};

export default Home;

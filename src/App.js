import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";

import Introduction from "./components/Introduction/Introduction";
import Offer from "./components/Offer/Offer";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <main>
        <Introduction />
        <Offer />
        <Offer />
        <Offer />
      </main>
      <Footer />
    </div>
  );
}

export default App;

import "./App.css";
import Footer from "./components/common/Footer/Footer";
import Header from "./components/common/Header/Header";
import Introduction from "./components/Introduction/Introduction";

function App() {
  return (
    <div className="App">
      <Header></Header>
      <main>
        <Introduction />
      </main>
      <Footer />
    </div>
  );
}

export default App;

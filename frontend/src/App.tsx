import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import ProductList from "./Components/ProductList";
import CategoryList from "./Components/CategoryList";
import StockList from "./Components/StockList";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/stocks" element={<StockList />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import ProductForm from "./Components/ProductForm";
import CategoryList from "./Components/CategoryList";
import StockList from "./Components/StockList";
import StockForm from "./Components/StockForm";
import CategoryForm from "./Components/CategoryForm";
import ProductList from "./Components/ProductList";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/new" element={<ProductForm />} />
          <Route path="/categories" element={<CategoryList />} />
          <Route path="/categories/new" element={<CategoryForm />} />
          <Route path="/stocks" element={<StockList />} />
          <Route path="/stocks/new" element={<StockForm />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;

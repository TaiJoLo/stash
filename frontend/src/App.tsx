import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./Components/MainLayout";
import ItemForm from "./Components/ItemForm";
import SimpleTestComponent from "./Components/SimpleTestComponent";
import ItemList from "./Components/ItemList";
import CategoryList from "./Components/CategoryList";
import StockList from "./Components/StockList";
import StockForm from "./Components/StockForm";
import CategoryForm from "./Components/CategoryForm"; // Adjust the path as needed

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<SimpleTestComponent />} />
          <Route path="/items" element={<ItemList />} />
          <Route path="/items/new" element={<ItemForm />} />
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

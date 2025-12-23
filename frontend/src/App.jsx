import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import CreateProducts from "./components/seller/CreateProducts.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import EditProduct from "./components/seller/EditProducts.jsx";
import First from "./components/First.jsx";
import ProductLists from "./components/ProductLists.jsx";
import Explore from "./components/Explore.jsx";
import CartPage from "./components/cartPage.jsx";
import ProductLists_Seller from "./components/seller/ProductList_Seller.jsx";
import ProductsManager from "./components/seller/ProductsManager.jsx";
import Explore_Seller from "./components/seller/Explore_Seller.jsx";
import ProductDetail from "./components/ProductDetail.jsx";
import SellerOrders from "./components/seller/SellerOrders.jsx";
import Dashboard from "./components/DashBoard.js";
import StatisticsChart from "./components/ecommerce/StatisticsChart.js";
import BarChartOne from "./components/charts/bar/BarChartOne.js";
import BasicTableOne from "./components/tables/BasicTables/BasicTableOne.js";
import Profile from "./components/profile.jsx";
import CustomerOrders from "./components/CustomerOrders.jsx";
import ProductsListAD from "./components/ecommerce/ProductsListAD.jsx";
import PostPage from "./components/PostPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<First />} />
        <Route path="/createproducts" element={<CreateProducts />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/edit/:id" element={<EditProduct />} />
        <Route path="/seller" element={<ProductLists_Seller />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/customer" element={<ProductLists />} />
        <Route path="/productsmanager" element={<ProductsManager />} />
        <Route path="/explore_seller" element={<Explore_Seller />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/sellerorders" element={<SellerOrders />} />
        <Route path="/dashboard/*" element={<Dashboard />} />
        <Route path="/line-chart" element={<StatisticsChart />} />
        <Route path="/bar-chart" element={<BarChartOne />} />
        <Route path="/basic-tables" element={<BasicTableOne />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/customerorders" element={<CustomerOrders />} />
        <Route path="/productslistad" element={<ProductsListAD />} />
        <Route path="/postpage" element={<PostPage />} />
      </Routes>
    </Router>
  );
}

export default App;

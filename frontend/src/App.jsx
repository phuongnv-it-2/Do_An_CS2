import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import Home from "./components/Home.jsx";
import CreateProducts from "./components/CreateProducts.jsx";
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import EditProduct from "./components/EditProducts.jsx";
import First from "./components/First.jsx";
import NavBar from "./components/NavBar.jsx";
import ProductLists from "./components/ProductLists.jsx";
import Explore from "./components/Explore.jsx";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<First />} />
          <Route path="/createproducts" element={<CreateProducts />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/edit/:id" element={<EditProduct />} />
          <Route path="/home" element={<Home />} />
          <Route path="/productlists" element={<ProductLists />} />
          <Route path="/explore" element={<Explore />} />

          {/* <Route path="/posts/:id" element={<Post/>} /> */}
        </Routes>
      </Router>
    </>
  );
}

export default App;

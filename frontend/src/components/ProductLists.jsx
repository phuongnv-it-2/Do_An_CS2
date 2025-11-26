import axios from "axios";
import { useEffect, useState } from "react";
import { Package, ShoppingCart } from "lucide-react";
import { Search, Grid, List, Trash2, Edit } from "lucide-react";
import BottomSheet from "./BottomSheet";
import NavBar from "./NavBar.jsx";

function ProductLists() {
  const [products, setProducts] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const API_URL = "http://localhost:3000";

  // ================= Lấy danh sách sản phẩm ====================
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        setProducts(response.data);
        setFilteredList(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setLoading(false);
      });
  }, []);

  // ================= Search sản phẩm ====================
  useEffect(() => {
    const search = searchTerm.toLowerCase();

    const filtered = products.filter(
      (p) =>
        p.Name.toLowerCase().includes(search) || // tìm theo tên
        p.id?.toString().toLowerCase().includes(search)
    );

    setFilteredList(filtered);
  }, [searchTerm, products]);

  // ================= Format giá ====================
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // ================= Xử lý ảnh ====================
  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}/${imgPath}`;
  };

  // ================= Loading Skeleton ====================
  if (loading) {
    return (
      <div className="min-h-screen bg-[#ffffff] p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-5xl font-bold text-center mb-10 text-[#00214d]">
            Danh Sách Sản Phẩm
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div
                key={index}
                className="bg-[#ffffff] rounded-2xl border border-[#00214d] shadow-lg overflow-hidden animate-pulse"
              >
                <div className="w-full h-56 bg-[#fde24f]"></div>
                <div className="p-5">
                  <div className="h-6 bg-[#00ebc7] rounded mb-3"></div>
                  <div className="h-4 bg-[#ff5470] rounded mb-2"></div>
                  <div className="h-4 bg-[#ff5470] rounded mb-2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= Empty state ====================
  if (filteredList.length === 0) {
    return (
      <div className="min-h-screen bg-[#ffffff] p-8 flex items-center justify-center">
        <div className="text-center bg-[#ffffff] border border-[#00214d] p-12 rounded-3xl shadow-xl">
          <Package className="w-32 h-32 mx-auto text-[#00214d] mb-6" />
          <h2 className="text-4xl font-bold text-[#00214d] mb-3">
            Không tìm thấy sản phẩm
          </h2>
          <p className="text-[#1b2d45] text-lg">Hãy thử từ khóa khác!</p>
        </div>
      </div>
    );
  }

  // ================= UI chính ====================
  return (
    <div className="min-h-screen bg-[#ffffff]">
      <div className="absolute top-0 left-0 w-full z-20">
        <NavBar />
      </div>
      <div className=" px-8 py-8">
        {/* HEADER */}
        <div className="text-center mb-12 pt-15">
          <div className="mx-auto w-20 h-20 rounded-3xl bg-[#00ebc7]/20 flex items-center justify-center mb-4 shadow-md">
            <Package className="w-10 h-10 text-[#00214d]" />
          </div>

          <h1 className="text-5xl font-extrabold text-[#00214d] mb-2">
            Danh Sách Sản Phẩm
          </h1>
        </div>

        {/* SEARCH BAR */}
        <div className="  flex items-center justify-between bg-white p-4 rounded-2xl shadow-xl border border-[#00214d] mb-10">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên hoặc mã sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:shadow-lg focus:shadow-purple-100 outline-none transition-all duration-300"
            />
          </div>

          {/* Counter badge */}
          <div className="ml-4 px-4 py-2 rounded-xl bg-[#00ebc7] text-[#00214d] font-semibold shadow">
            {filteredList.length} sản phẩm
          </div>

          {/* View Mode */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg ml-4">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "grid"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${
                viewMode === "list"
                  ? "bg-white shadow text-purple-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "flex flex-col gap-8"
          }
        >
          {filteredList.map((item) => (
            <div
              key={item.id}
              className="rounded-3xl shadow-lg bg-white border border-[#00214d] overflow-hidden hover:-translate-y-2 transition-all duration-300"
            >
              {/* IMAGE */}
              <div className="relative w-full h-60 bg-[#fde24f] rounded-b-3xl overflow-hidden">
                <img
                  src={getImageUrl(item.ImgPath)}
                  alt={item.Name}
                  className="w-full h-full object-cover"
                />

                {/* Badge */}
                <div className="absolute top-3 right-3 bg-[#00ebc7] text-[#00214d] px-4 py-1 rounded-full text-sm shadow-md">
                  ID {item.id}
                </div>
              </div>

              {/* INFO */}
              <div className="p-5">
                <h2 className="text-2xl font-bold text-[#00214d] mb-1">
                  {item.Name}
                </h2>

                <p className="text-[#1b2d45] text-sm mb-4 line-clamp-2">
                  {item.Description}
                </p>

                <div className="text-xl font-extrabold text-[#00214d] mb-4">
                  {formatPrice(item.Price)}
                </div>

                {/* BUTTONS */}
                <div className="flex gap-3">
                  {/* ADD TO CART */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct({
                        name: item.Name,
                        price: formatPrice(item.Price),
                        img: getImageUrl(item.ImgPath),
                        desc: item.Description,
                        colors: item.colors?.map((c) => c.ColorName) || [], // lấy màu từ API
                      });
                      setOpenSheet(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 
      bg-gradient-to-r from-[#00ebc7] to-[#fde24f] 
      text-white font-semibold py-2.5 px-4 rounded-xl 
      hover:from-[#00d9b5] hover:to-[#fcd836] 
      transform hover:scale-105 transition-all duration-200 
      shadow-md hover:shadow-lg"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span className="text-sm">Thêm vào giỏ</span>
                  </button>

                  {/* VIEW 3D */}
                  <button
                    type="button"
                    className="flex-1 flex items-center justify-center gap-2 
      bg-gradient-to-r from-[#4f46e5] to-[#a78bfa] 
      text-white font-semibold py-2.5 px-4 rounded-xl 
      hover:from-[#4338ca] hover:to-[#8b5cf6] 
      transform hover:scale-105 transition-all duration-200 
      shadow-md hover:shadow-lg"
                  >
                    <Package className="w-4 h-4" />
                    <span className="text-sm">Xem 3D</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        product={selectedProduct}
      />
    </div>
  );
}

export default ProductLists;

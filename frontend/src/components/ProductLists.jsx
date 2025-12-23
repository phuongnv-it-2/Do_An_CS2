import axios from "axios";
import { useEffect, useState, Suspense } from "react";
import { Package, ShoppingCart, Star, X } from "lucide-react";
import { Search, Grid, List } from "lucide-react";
import BottomSheet from "./BottomSheet";
import NavBar from "./NavBar.jsx";
import CartPage from "./cartPage.jsx";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Html, useGLTF } from "@react-three/drei";

function ProductLists() {
  const [products, setProducts] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [loading, setLoading] = useState(true);
  const [openSheet, setOpenSheet] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  // const navigate = useNavigate();

  const API_URL = "https://do-an-cs2.onrender.com";

  // ================= Lấy danh sách sản phẩm ====================
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${API_URL}/products`)
      .then((response) => {
        console.log("Products with reviews:", response.data);
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
        p.Name.toLowerCase().includes(search) ||
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
  const reloadProducts = async () => {
    try {
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setFilteredList(response.data);

      // Cập nhật selectedProduct nếu đang mở
      if (selectedProduct) {
        const updatedProduct = response.data.find(
          (p) => p.id === selectedProduct.id
        );
        if (updatedProduct) {
          setSelectedProduct({
            id: updatedProduct.id,
            name: updatedProduct.Name,
            price: formatPrice(updatedProduct.Price),
            img: getImageUrl(updatedProduct.ImgPath),
            desc: updatedProduct.Description,
            colors: updatedProduct.colors?.map((c) => c.ColorName) || [],
            rating: updatedProduct.rating || 0,
            reviews: updatedProduct.reviewCount || 0,
            reviewList: updatedProduct.reviews || [],
            mod3DFile: updatedProduct.mod3D || null, // Thêm dòng này
          });
        }
      }
    } catch (error) {
      console.error("Error reloading products:", error);
    }
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
  // ================= Model3d Viewer Component ====================

  function ModelViewer({ file, onClose }) {
    const { scene } = useGLTF(file);

    // Set position, rotation, scale mặc định cho scene
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.set(1, 1, 1); // Bạn có thể điều chỉnh scale nếu model quá lớn hoặc quá nhỏ

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-white p-2 rounded-full bg-red-500 hover:bg-red-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-3/4 h-3/4 bg-white rounded-xl overflow-hidden">
          <Canvas camera={{ position: [0, 1, 3] }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />

            <Suspense fallback={<Html>Loading 3D...</Html>}>
              <primitive object={scene} />
            </Suspense>

            <OrbitControls
              enablePan={true}
              enableZoom={true}
              autoRotate={true}
              autoRotateSpeed={1.5}
              maxPolarAngle={Math.PI / 2} // hạn chế xoay quá cao
              minPolarAngle={0} // hạn chế xoay quá thấp
            />
          </Canvas>
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
      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-4 right-4 bg-yellow-400 text-black p-4 rounded-full shadow-lg z-50 flex items-center gap-2 hover:bg-yellow-300 transition"
      >
        <ShoppingCart className="w-6 h-6" />
      </button>

      {showCart && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center"
          onClick={() => setShowCart(false)}
        >
          <div
            className="bg-white rounded-2xl 
                 w-[95vw] h-[90vh] 
                 max-w-6xl 
                 p-6 shadow-lg relative overflow-auto "
            onClick={(e) => e.stopPropagation()}
          >
            <CartPage />
          </div>
        </div>
      )}

      <div className="px-8 py-8">
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
        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-xl border border-[#00214d] mb-10">
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
          {currentItems.map((item) => (
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

                <p className="text-[#1b2d45] text-sm mb-3 line-clamp-2">
                  {item.Description}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(item.rating || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {item.rating ? item.rating.toFixed(1) : "0.0"}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({item.reviewCount || 0} đánh giá)
                  </span>
                </div>

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
                        id: item.id,
                        name: item.Name,
                        price: formatPrice(item.Price),
                        img: getImageUrl(item.ImgPath),
                        desc: item.Description,
                        colors: item.colors?.map((c) => c.ColorName) || [],
                        rating: item.rating || 0,
                        reviews: item.reviewCount || 0,
                        reviewList: item.reviews || [],
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
                    onClick={() => {
                      console.log("Clicked Xem 3D cho sản phẩm:", item);
                      if (item.mod3D) {
                        setSelectedProduct({
                          ...item,
                          mod3DFile: item.mod3D, // đảm bảo lưu đường dẫn 3D
                        });
                        console.log(
                          "Đặt selectedProduct với mod3DFile:",
                          item.mod3D
                        );
                        setOpen(true);
                      } else {
                        alert("Sản phẩm này chưa có mô hình 3D!");
                      }
                    }}
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

                  {open && selectedProduct?.mod3DFile && (
                    <>
                      {console.log(
                        "Render ModelViewer với file:",
                        selectedProduct.mod3DFile
                      )}
                      <ModelViewer
                        file={getImageUrl(selectedProduct.mod3DFile)}
                        onClose={() => setOpen(false)}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-2 mt-8">
          {Array.from(
            { length: Math.ceil(filteredList.length / itemsPerPage) },
            (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-4 py-2 rounded-lg ${
                  currentPage === i + 1
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            )
          )}
        </div>
      </div>
      <BottomSheet
        open={openSheet}
        onClose={() => setOpenSheet(false)}
        product={selectedProduct}
        fetchReviews={reloadProducts}
      />
    </div>
  );
}

export default ProductLists;

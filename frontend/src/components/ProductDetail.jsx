// ProductDetail.jsx - Layout hiện đại và tối giản
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle,
  XCircle,
  MapPin,
  CreditCard,
  Package,
  ArrowLeft,
  Leaf,
  Recycle,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  Star,
  Clock,
  ChevronRight,
} from "lucide-react";
import axios from "axios";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loadingLocation, setLoadingLocation] = useState(false);

  const API_URL = "http://localhost:3000";

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/${id}`);
      console.log("Product data:", response.data);
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Không thể tải thông tin sản phẩm");
    }
  };
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      setErrorMessage("Trình duyệt không hỗ trợ định vị GPS");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await res.json();

          if (data?.display_name) {
            setShippingAddress(data.display_name);
            setErrorMessage("");
          } else {
            setErrorMessage("Không thể xác định địa chỉ");
          }
        } catch (err) {
          setErrorMessage("Lỗi khi lấy địa chỉ từ bản đồ");
        } finally {
          setLoadingLocation(false);
        }
      },
      () => {
        setErrorMessage("Bạn đã từ chối quyền truy cập vị trí");
        setLoadingLocation(false);
      }
    );
  };

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}/${imgPath}`;
  };

  const handleBuyNow = async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      alert("Vui lòng đăng nhập để mua hàng");
      navigate("/login");
      return;
    }

    if (!shippingAddress.trim()) {
      setErrorMessage("Vui lòng nhập địa chỉ giao hàng");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(
        `${API_URL}/orders/create`,
        {
          productId: id,
          quantity: quantity,
          paymentMethod: paymentMethod,
          shippingAddress: shippingAddress,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Order created:", response.data);
      setOrderSuccess(true);
      setTimeout(() => {
        navigate("/orders");
      }, 2000);
    } catch (error) {
      console.error("❌ Error creating order:", error);
      setErrorMessage(
        error.response?.data?.message ||
          "Có lỗi xảy ra khi tạo đơn hàng. Vui lòng thử lại!"
      );
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Trở về</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                <Recycle className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-black text-gray-900">EcoShop</span>
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Product Visual */}
          <div className="space-y-6">
            {/* Product Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 shadow-xl"
            >
              <div className="aspect-square w-full overflow-hidden">
                <img
                  src={getImageUrl(product.ImgPath || product.img)}
                  alt={product.Name || product.name}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>

              {/* Eco Badge */}
              <div className="absolute top-4 right-4">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                  <Leaf className="w-4 h-4" />
                  <span className="text-sm font-bold">Eco-Friendly</span>
                </div>
              </div>
            </motion.div>

            {/* Product Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.Name || product.name}
              </h1>

              <p className="text-gray-600 leading-relaxed mb-6">
                {product.Description || product.description}
              </p>

              {/* Product Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                  <Recycle className="w-3 h-3 inline mr-1" />
                  Tái chế 100%
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 rounded-lg text-sm font-medium border border-amber-100">
                  <Star className="w-3 h-3 inline mr-1" />
                  Chất lượng cao
                </span>
                <span className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-700 rounded-lg text-sm font-medium border border-blue-100">
                  <Clock className="w-3 h-3 inline mr-1" />
                  Giao hàng nhanh
                </span>
              </div>

              {/* Product Specifications */}
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Loại sản phẩm</span>
                  <span className="font-medium">Tái chế thân thiện</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-gray-500">Xuất xứ</span>
                  <span className="font-medium">Việt Nam</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-500">Bảo hành</span>
                  <span className="font-medium text-emerald-600">12 tháng</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Form */}
          <div className="space-y-6">
            {/* Price Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl shadow-xl p-6"
            >
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-emerald-100 text-sm font-medium mb-1">
                    Giá sản phẩm
                  </p>
                  <p className="text-4xl font-bold text-white">
                    {parseFloat(product.Price || product.price).toLocaleString(
                      "vi-VN"
                    )}
                    <span className="text-xl ml-1">đ</span>
                  </p>
                </div>
                <Sparkles className="w-8 h-8 text-white opacity-90" />
              </div>
            </motion.div>

            {/* Quantity Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-gray-900 flex items-center gap-2">
                  <Package className="w-5 h-5 text-teal-500" />
                  Số lượng
                </h3>
                <div className="text-sm text-gray-500">Còn hàng</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center group"
                  >
                    <Minus className="w-4 h-4 text-gray-500 group-hover:text-teal-600" />
                  </button>
                  <span className="text-3xl font-bold text-gray-900 w-16 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 rounded-xl border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-all flex items-center justify-center group"
                  >
                    <Plus className="w-4 h-4 text-gray-500 group-hover:text-teal-600" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-sm text-gray-500 mb-1">Tổng cộng</p>
                  <p className="text-2xl font-bold text-teal-600">
                    {(
                      parseFloat(product.Price || product.price) * quantity
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Shipping Address */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <label className="block">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-5 h-5 text-teal-500" />
                  <span className="font-bold text-lg text-gray-900">
                    Địa chỉ giao hàng
                  </span>
                  <span className="text-red-500">*</span>

                  {/* NÚT LẤY VỊ TRÍ */}
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    disabled={loadingLocation}
                    className="ml-auto text-sm text-teal-600 hover:underline disabled:opacity-50"
                  >
                    {loadingLocation
                      ? "Đang lấy vị trí..."
                      : "📍 Lấy vị trí hiện tại"}
                  </button>
                </div>

                <textarea
                  value={shippingAddress}
                  onChange={(e) => {
                    setShippingAddress(e.target.value);
                    setErrorMessage("");
                  }}
                  placeholder="Nhập địa chỉ đầy đủ (số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố)"
                  className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100 transition text-gray-700 placeholder-gray-400 resize-none"
                  rows="3"
                />
              </label>
            </motion.div>

            {/* Payment Method */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-teal-500" />
                Phương thức thanh toán
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-xl hover:border-teal-500 hover:bg-teal-50 transition-all cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    checked={paymentMethod === "COD"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-5 h-5 text-teal-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Nhận hàng trước, thanh toán sau
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </label>
              </div>
            </motion.div>

            {/* Security & Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl border border-teal-100 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Leaf className="w-5 h-5 text-teal-600" />
                <h4 className="font-bold text-lg text-gray-900">
                  Lợi ích môi trường
                </h4>
              </div>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Giảm 2kg rác thải nhựa
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Hỗ trợ trồng 1 cây xanh
                </li>
                <li className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  Tiết kiệm năng lượng tái chế
                </li>
              </ul>
            </motion.div>

            {/* Error Message */}
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-red-700 font-medium">
                    {errorMessage}
                  </span>
                </div>
              </motion.div>
            )}

            {/* Success Message */}
            {orderSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-50 border border-emerald-200 rounded-xl p-6"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      Đặt hàng thành công! 🎉
                    </p>
                    <p className="text-gray-600 mt-1">
                      Cảm ơn bạn đã lựa chọn sản phẩm thân thiện môi trường
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Buy Now Button */}
            <motion.button
              onClick={handleBuyNow}
              disabled={loading || orderSuccess}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="w-full py-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white font-bold rounded-xl text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-teal-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                    Đang xử lý đơn hàng...
                  </>
                ) : orderSuccess ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Đặt hàng thành công!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    MUA NGAY
                  </>
                )}
              </div>
            </motion.button>

            {/* Security Badges */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Bảo mật</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Truck className="w-4 h-4 text-amber-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Giao nhanh</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm text-center">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <Star className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-xs font-medium text-gray-600">Chất lượng</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

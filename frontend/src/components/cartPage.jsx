import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trash2,
  ShoppingBag,
  Leaf,
  Recycle,
  CreditCard,
  Plus,
  Minus,
  Package,
  Truck,
  Shield,
  Menu,
  Sparkles,
  Heart,
  X,
  ArrowLeft,
} from "lucide-react";
import axios from "axios";

const API_URL = "http://localhost:3000";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const getImageUrl = (imgPath) => {
    if (!imgPath) return null;
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}/${imgPath}`;
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setCartItems([]);
        return;
      }
      const res = await fetch(`${API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCartItems(Array.isArray(data.items) ? data.items : []);
    } catch (err) {
      console.error("Lỗi lấy giỏ hàng:", err.message);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        alert("Bạn chưa đăng nhập");
        return;
      }

      const res = await axios.post(
        `${API_URL}/cart/checkout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Thanh toán thành công!");

      // Clear UI cart
      setCartItems([]);
    } catch (err) {
      console.error("CHECKOUT ERROR:", err);
      alert(err.response?.data?.error || "Thanh toán thất bại");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId, color, quantity) => {
    if (quantity < 1) return;
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${API_URL}/cart/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, color, quantity }),
      });
      fetchCart();
    } catch (err) {
      console.error("Lỗi cập nhật số lượng:", err.message);
    }
  };

  const removeItem = async (productId, color) => {
    setRemoving(`${productId}-${color}`);
    try {
      const token = localStorage.getItem("accessToken");
      await fetch(`${API_URL}/cart/remove`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, color }),
      });
      setTimeout(() => {
        fetchCart();
        setRemoving(null);
      }, 300);
    } catch (err) {
      console.error("Lỗi xóa sản phẩm:", err.message);
      setRemoving(null);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity * item.price, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Recycle
                  className="text-teal-900"
                  size={26}
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-2xl font-black text-gray-900">EcoShop</span>
            </div>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="relative w-24 h-24">
              <motion.div
                className="absolute inset-0 border-4 border-teal-200 border-t-teal-400 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Recycle className="text-teal-400" size={40} />
              </div>
            </div>
            <p className="mt-6 text-xl font-bold text-gray-900">
              Đang tải giỏ hàng...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Recycle
                  className="text-teal-900"
                  size={26}
                  strokeWidth={2.5}
                />
              </div>
              <span className="text-2xl font-black text-gray-900">EcoShop</span>
            </div>
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all">
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div
            className="text-center max-w-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center justify-center w-40 h-40 mb-8 bg-gradient-to-br from-teal-50 to-amber-50 rounded-full">
              <ShoppingBag
                className="text-gray-700"
                size={80}
                strokeWidth={1.5}
              />
            </div>
            <h2 className="text-4xl font-black text-gray-900 mb-3">
              Giỏ hàng trống
            </h2>
            <p className="text-lg text-gray-600 mb-8 flex items-center justify-center gap-2">
              <Leaf className="text-teal-500" size={20} />
              Hãy khám phá các sản phẩm tái chế tuyệt vời!
            </p>
            <button className="px-8 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white font-bold rounded-xl hover:shadow-lg transition-all">
              Khám phá ngay
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-white via-gray-50 to-white flex flex-col">
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 w-full">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all mr-2">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Recycle className="text-teal-900" size={26} strokeWidth={2.5} />
            </div>
            <span className="text-2xl font-black text-gray-900">EcoShop</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-teal-200 shadow-sm">
              <Package className="text-teal-500" size={20} strokeWidth={2.5} />
              <span className="text-sm font-bold text-gray-900">
                {getTotalItems()} sản phẩm
              </span>
            </div>
            <button className="p-2.5 hover:bg-gray-100 rounded-xl transition-all">
              <Menu size={24} className="text-gray-700" />
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center py-6">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {/* Left Column - Product List */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                  <ShoppingBag size={32} className="text-teal-500" />
                  Giỏ Hàng Của Bạn
                </h2>
                <p className="text-gray-600 mt-2 flex items-center gap-2">
                  <Leaf size={16} className="text-teal-500" />
                  Bạn đang có {getTotalItems()} sản phẩm thân thiện môi trường
                </p>
              </div>

              {/* Product List with Scroll */}
              <div className="max-h-[500px] overflow-y-auto pr-2 -mr-2">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, idx) => (
                    <motion.div
                      key={`${item.productId}-${item.color}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -50, height: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-all mb-4 ${
                        removing === `${item.productId}-${item.color}`
                          ? "opacity-50"
                          : ""
                      }`}
                    >
                      <div className="p-4 flex gap-4">
                        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gradient-to-br from-teal-50 to-amber-50 flex-shrink-0 border border-teal-100">
                          <img
                            src={getImageUrl(item.img)}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-black text-gray-900 mb-1 truncate">
                                {item.name}
                              </h3>
                              <div className="flex gap-2 flex-wrap">
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-white border border-teal-400 text-teal-600">
                                  {item.color}
                                </span>
                                <span className="px-2 py-1 rounded-full text-xs font-bold bg-amber-100 text-gray-900 flex items-center gap-1">
                                  <Recycle size={10} /> Tái chế
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.color)
                              }
                              className="p-2 text-gray-400 hover:text-white hover:bg-red-500 rounded-lg transition-all flex-shrink-0"
                            >
                              <X size={16} strokeWidth={2.5} />
                            </button>
                          </div>

                          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.color,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                                className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                                  item.quantity <= 1
                                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                                    : "bg-white hover:bg-teal-400 hover:text-white text-gray-900 border border-gray-200 shadow-sm"
                                }`}
                              >
                                <Minus size={12} strokeWidth={2.5} />
                              </button>
                              <span className="text-base font-black text-gray-900 min-w-6 text-center mx-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.color,
                                    item.quantity + 1
                                  )
                                }
                                className="w-6 h-6 rounded-md bg-white hover:bg-teal-400 hover:text-white text-gray-900 flex items-center justify-center transition-all border border-gray-200 shadow-sm"
                              >
                                <Plus size={12} strokeWidth={2.5} />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-lg font-black text-teal-500">
                                {new Intl.NumberFormat("vi-VN", {
                                  style: "currency",
                                  currency: "VND",
                                }).format(item.quantity * item.price)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className="lg:sticky lg:top-28">
              <motion.div
                className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="bg-gradient-to-r from-teal-400 to-teal-500 p-4">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Package size={20} strokeWidth={2.5} />
                    Tổng Đơn Hàng
                  </h3>
                </div>

                <div className="p-4 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Tạm tính:
                    </span>
                    <span className="text-base font-bold text-gray-900">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(getTotal())}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Truck size={16} className="text-teal-500" />
                      <span className="text-sm font-medium text-gray-600">
                        Vận chuyển:
                      </span>
                    </div>
                    <span className="text-base font-bold text-teal-500">
                      Miễn phí
                    </span>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                    <span className="text-base font-black text-gray-900">
                      Tổng cộng:
                    </span>
                    <span className="text-xl font-black text-teal-500">
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(getTotal())}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-amber-50 rounded-lg p-2 border border-teal-100 mt-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Leaf size={14} className="text-teal-500" />
                      <span className="text-xs font-bold text-gray-900">
                        Đóng góp xanh
                      </span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Giảm 2kg rác thải nhựa & hỗ trợ trồng 1 cây xanh
                    </p>
                  </div>

                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 bg-gradient-to-r from-gray-900 to-gray-800 
             text-white font-bold rounded-xl text-sm 
             flex items-center justify-center gap-2 
             shadow-lg hover:shadow-xl transition-all mt-3"
                  >
                    <CreditCard size={18} strokeWidth={2.5} />
                    Thanh Toán Ngay
                  </button>

                  <div className="grid grid-cols-3 gap-1 pt-3 border-t border-gray-100 mt-3">
                    <div className="flex flex-col items-center gap-1 p-1">
                      <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center">
                        <Shield size={14} className="text-teal-600" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 text-center">
                        Bảo mật
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-1">
                      <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center">
                        <Truck size={14} className="text-gray-900" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 text-center">
                        Nhanh
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-1">
                      <div className="w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                        <Heart size={14} className="text-red-500" />
                      </div>
                      <span className="text-[10px] font-bold text-gray-600 text-center">
                        Uy tín
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

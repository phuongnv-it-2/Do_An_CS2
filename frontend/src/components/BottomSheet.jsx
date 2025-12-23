import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ShoppingCart, Check, Sparkles, Leaf } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BottomSheet({ open, onClose, product, fetchReviews }) {
  const [tempRating, setTempRating] = useState(0);
  const [tempComment, setTempComment] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    setTempRating(0);
    setTempComment("");
    setQuantity(1);
    setSelectedColor(null);
    setShowSuccess(false);
  }, [product]);

  const apiCall = async (apiFunction) => {
    let token = localStorage.getItem("accessToken");

    try {
      return await apiFunction(token);
    } catch (err) {
      if (err.response?.status === 401) {
        const refreshRes = await axios.post(
          "http://localhost:3000/user/refresh",
          {},
          { withCredentials: true }
        );
        token = refreshRes.data.accessToken;
        localStorage.setItem("accessToken", token);
        return await apiFunction(token);
      }
      throw err;
    }
  };

  const addToCart = async () => {
    if (!selectedColor && product?.colors?.length > 0) {
      alert("⚠️ Vui lòng chọn tùy chọn");
      return;
    }

    setLoading(true);
    try {
      const response = await apiCall((token) =>
        axios.post(
          "http://localhost:3000/cart/add",
          {
            productId: product.id,
            quantity: quantity,
            color: selectedColor || "default",
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      console.log("CART RESPONSE:", response.data);

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      setQuantity(1);
      setSelectedColor(null);
    } catch (error) {
      console.error("ADD TO CART ERROR:", error);
      alert(
        "❌ " + (error.response?.data?.error || "Lỗi khi thêm vào giỏ hàng")
      );
    } finally {
      setLoading(false);
    }
  };
  const buyNow = () => {
    navigate(`/products/${product.id}`); // plural "products", phải khớp với route
  };

  const createReview = async () => {
    if (tempRating === 0) {
      alert("⚠️ Vui lòng chọn số sao đánh giá");
      return;
    }

    try {
      await apiCall((token) =>
        axios.post(
          "http://localhost:3000/review/create",
          {
            productId: product.id,
            rating: tempRating,
            comment: tempComment,
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );

      setTempRating(0);
      setTempComment("");
      fetchReviews();
      alert("✅ Đã gửi đánh giá!");
    } catch (error) {
      console.error(error);
      alert("❌ Lỗi khi gửi đánh giá");
    }
  };

  const reviews = product?.reviewList || [];

  const getSafeString = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "object") {
      return value.value || value.text || value.name || String(value);
    }
    return String(value);
  };

  const getSafeNumber = (value) => {
    if (typeof value === "number") return value;
    if (typeof value === "object" && value !== null) {
      return Number(value.value || value.Rating || value.rating || 0);
    }
    return Number(value) || 0;
  };

  const getColorName = (color) => {
    if (typeof color === "string") return color;
    if (typeof color === "object" && color !== null) {
      return color.ColorName || color.name || color.value || "Tùy chọn";
    }
    return String(color);
  };

  const getUserName = (user) => {
    if (!user) return "Khách hàng";
    if (typeof user === "string") return user;
    if (typeof user === "object") {
      return user.UserName || user.username || user.name || "Khách hàng";
    }
    return "Khách hàng";
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop với hiệu ứng blur mạnh */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-[#00214d]/70 via-[#00214d]/60 to-[#00214d]/80 backdrop-blur-md"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          {/* Floating particles effect */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-[#00ebc7] rounded-full opacity-30"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: window.innerHeight + 20,
                }}
                animate={{
                  y: -20,
                  x: Math.random() * window.innerWidth,
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gradient-to-b from-[#fffffe] to-[#f8fffe] rounded-t-[2rem] p-8 shadow-2xl max-h-[85vh] overflow-y-auto w-full max-w-2xl"
            style={{
              borderTop: "5px solid #00ebc7",
              boxShadow:
                "0 -20px 60px rgba(0, 235, 199, 0.3), 0 -5px 15px rgba(0, 33, 77, 0.2)",
            }}
          >
            {/* Decorative top bar */}
            <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-1.5 bg-gradient-to-r from-[#00ebc7] via-[#fde24f] to-[#00ebc7] rounded-full opacity-40" />

            {/* SUCCESS ANIMATION */}
            <AnimatePresence>
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5, y: -30 }}
                  className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-[#00ebc7] to-[#00d4b3] text-[#00214d] px-10 py-6 rounded-3xl shadow-2xl flex items-center gap-4 z-[60]"
                  style={{ boxShadow: "0 10px 40px rgba(0, 235, 199, 0.5)" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Check className="w-8 h-8" strokeWidth={3.5} />
                  </motion.div>
                  <div>
                    <div className="font-bold text-xl">Thành công!</div>
                    <div className="text-sm opacity-90">
                      Đã thêm vào giỏ hàng
                    </div>
                  </div>
                  <Sparkles className="w-6 h-6 text-[#fde24f]" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* HEADER với gradient và animation */}
            <motion.div
              className="flex items-start gap-5 mb-8 p-5 rounded-2xl bg-gradient-to-br from-white to-[#00ebc7]/5 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              {/* Background pattern */}
              <div className="absolute inset-0 opacity-5">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, #00ebc7 1px, transparent 1px)`,
                    backgroundSize: "24px 24px",
                  }}
                />
              </div>

              <div className="relative">
                <motion.img
                  src={getSafeString(product?.img)}
                  alt={getSafeString(product?.name)}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                  style={{ border: "4px solid #00ebc7" }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
                <motion.div
                  className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-br from-[#00ebc7] to-[#00d4b3] rounded-2xl shadow-lg flex items-center justify-center text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  ♻️
                </motion.div>
                <motion.div
                  className="absolute -bottom-2 -right-2 bg-[#fde24f] rounded-full p-2 shadow-md"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Leaf className="w-5 h-5 text-[#00214d]" />
                </motion.div>
              </div>

              <div className="flex-1 relative z-10">
                <motion.h2
                  className="text-3xl font-black text-[#00214d] leading-tight mb-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {getSafeString(product?.name)}
                </motion.h2>

                <motion.div
                  className="inline-block"
                  whileHover={{ scale: 1.05 }}
                >
                  <p className="text-4xl font-black bg-gradient-to-r from-[#ff5470] to-[#ff3d5f] bg-clip-text text-transparent">
                    {getSafeString(product?.price)}
                  </p>
                </motion.div>

                <div className="flex items-center gap-2 mt-3 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 w-fit">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 + i * 0.05 }}
                    >
                      <Star
                        className={`w-5 h-5 ${
                          i < getSafeNumber(product?.rating)
                            ? "text-[#fde24f] fill-[#fde24f]"
                            : "text-gray-300"
                        }`}
                      />
                    </motion.div>
                  ))}
                  <span className="text-sm text-[#1b2d45] ml-1 font-bold">
                    {getSafeNumber(product?.reviews)} đánh giá
                  </span>
                </div>
              </div>
            </motion.div>

            {/* COLORS/OPTIONS với animation mượt */}
            {product?.colors?.length > 0 && (
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-black text-[#00214d] mb-4 text-xl flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#00ebc7]" />
                  Tùy chọn{" "}
                  {selectedColor && (
                    <motion.span
                      className="text-[#00ebc7] ml-2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓ {selectedColor}
                    </motion.span>
                  )}
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {product.colors.map((c, idx) => {
                    const colorName = getColorName(c);
                    return (
                      <motion.button
                        key={idx}
                        onClick={() => setSelectedColor(colorName)}
                        className={`px-6 py-3 rounded-2xl font-bold transition-all ${
                          selectedColor === colorName
                            ? "bg-gradient-to-r from-[#00ebc7] to-[#00d4b3] text-[#00214d] shadow-xl"
                            : "bg-white text-[#1b2d45] hover:bg-[#00ebc7]/10 shadow-md"
                        }`}
                        style={{
                          border:
                            selectedColor === colorName
                              ? "3px solid #00214d"
                              : "2px solid #e5e5e5",
                        }}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                      >
                        {colorName}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* QUANTITY với gradient và glow */}
            <motion.div
              className="flex justify-between items-center mb-8 p-6 rounded-2xl bg-gradient-to-br from-[#00ebc7]/10 via-[#fde24f]/10 to-[#ff5470]/5 shadow-lg relative overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#00ebc7]/5 to-transparent" />

              <span className="font-black text-[#00214d] text-xl relative z-10">
                Số lượng
              </span>
              <div className="flex items-center gap-5 relative z-10">
                <motion.button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={loading}
                  className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-[#00214d] hover:bg-[#00ebc7] hover:text-white transition-all disabled:opacity-50 shadow-lg"
                  style={{ border: "3px solid #00ebc7" }}
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  −
                </motion.button>
                <motion.span
                  className="text-3xl font-black w-16 text-center text-[#00214d]"
                  key={quantity}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                >
                  {quantity}
                </motion.span>
                <motion.button
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={loading}
                  className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-2xl text-[#00214d] hover:bg-[#00ebc7] hover:text-white transition-all disabled:opacity-50 shadow-lg"
                  style={{ border: "3px solid #00ebc7" }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  +
                </motion.button>
              </div>
            </motion.div>

            {/* REVIEWS với animation stagger */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-black text-[#00214d] mb-5 flex items-center gap-3">
                <div className="bg-gradient-to-r from-[#fde24f] to-[#fcd520] p-2 rounded-xl">
                  <Star className="w-6 h-6 text-[#00214d] fill-[#00214d]" />
                </div>
                Đánh giá & Bình luận
              </h3>

              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {reviews.length > 0 ? (
                  reviews.map((r, index) => {
                    const ratingValue = getSafeNumber(r.Rating);
                    const commentText = getSafeString(r.Comment);
                    const userName = getUserName(r.user);

                    return (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-5 rounded-2xl bg-white shadow-md hover:shadow-xl transition-all relative overflow-hidden group"
                        style={{ border: "2px solid #f0f0f0" }}
                        whileHover={{ scale: 1.01, x: 5 }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#00ebc7]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="flex items-center justify-between mb-3 relative z-10">
                          <div className="font-black text-[#00214d] text-lg">
                            {userName}
                          </div>
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < ratingValue
                                    ? "text-[#fde24f] fill-[#fde24f]"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-[#1b2d45] leading-relaxed relative z-10">
                          {commentText}
                        </p>
                        <div className="text-xs text-gray-400 mt-3 relative z-10">
                          {r.createdAt
                            ? new Date(r.createdAt).toLocaleDateString("vi-VN")
                            : ""}
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <p className="text-[#1b2d45] text-center py-8 font-medium">
                    Chưa có đánh giá nào. Hãy là người đầu tiên! 🌟
                  </p>
                )}
              </div>

              {/* ADD REVIEW với gradient border */}
              <motion.div
                className="p-6 rounded-2xl bg-gradient-to-br from-white to-[#00ebc7]/5 shadow-xl relative overflow-hidden"
                style={{ border: "3px solid #00ebc7" }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fde24f]/20 to-transparent rounded-full blur-3xl" />

                <h4 className="font-black text-[#00214d] mb-4 text-xl relative z-10">
                  ✨ Viết đánh giá của bạn
                </h4>
                <div className="flex items-center gap-3 mb-5 relative z-10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.div
                      key={star}
                      whileHover={{ scale: 1.3, rotate: 15 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Star
                        className="w-8 h-8 cursor-pointer transition-all"
                        color="#fde24f"
                        fill={star <= tempRating ? "#fde24f" : "none"}
                        strokeWidth={2.5}
                        onClick={() => setTempRating(star)}
                      />
                    </motion.div>
                  ))}
                </div>
                <textarea
                  className="w-full rounded-2xl p-5 focus:ring-4 focus:ring-[#00ebc7]/30 outline-none text-[#1b2d45] font-medium transition-all relative z-10 bg-white"
                  style={{ border: "2px solid #e5e5e5" }}
                  rows={3}
                  placeholder="Chia sẻ trải nghiệm tuyệt vời của bạn..."
                  value={tempComment}
                  onChange={(e) => setTempComment(e.target.value)}
                />
                <motion.button
                  onClick={createReview}
                  className="w-full mt-5 py-5 bg-gradient-to-r from-[#00ebc7] to-[#00d4b3] text-[#00214d] rounded-2xl font-black text-lg shadow-xl relative z-10 overflow-hidden group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10">Gửi đánh giá</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-[#00d4b3] to-[#00ebc7] opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </motion.div>
            </motion.div>

            {/* BUTTONS với gradient và glow effects */}
            <motion.div
              className="flex gap-4 mt-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <motion.button
                onClick={addToCart}
                disabled={loading}
                className="flex-1 py-6 bg-gradient-to-r from-[#00ebc7] to-[#00d4b3] text-[#00214d] rounded-2xl font-black text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden group"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{ boxShadow: "0 8px 32px rgba(0, 235, 199, 0.4)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#00d4b3] to-[#00ebc7] opacity-0 group-hover:opacity-100 transition-opacity" />
                <ShoppingCart
                  className="w-7 h-7 relative z-10"
                  strokeWidth={2.5}
                />
                <span className="relative z-10">
                  {loading ? "Đang thêm..." : "Thêm vào giỏ"}
                </span>
              </motion.button>

              <motion.button
                onClick={buyNow}
                disabled={loading}
                className="flex-1 py-6 bg-gradient-to-r from-[#00214d] to-[#001a3d] text-[#fffffe] rounded-2xl font-black text-lg shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                style={{ boxShadow: "0 8px 32px rgba(0, 33, 77, 0.5)" }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-[#001a3d] to-[#00214d] opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {loading ? "Đang xử lý..." : "Mua ngay"}
                  <Sparkles className="w-5 h-5" />
                </span>
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

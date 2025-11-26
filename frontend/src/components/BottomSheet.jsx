import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

export default function BottomSheet({ open, onClose, product }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 shadow-xl max-h-[85vh] overflow-y-auto"
          >
            {/* HEADER */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={product?.img}
                alt="product"
                className="w-24 h-24 rounded-xl object-cover border"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold">{product?.name}</h2>

                <p className="text-[#ff3b3b] font-bold text-2xl mt-1">
                  {product?.price}
                </p>

                {/* RATING */}
                <div className="flex items-center gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < product.rating
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">
                    ({product.reviews} đánh giá)
                  </span>
                </div>
              </div>
            </div>

            {/* OPTIONS */}
            <div className="mb-5">
              <h3 className="font-semibold mb-2">Chọn màu</h3>
              <div className="flex gap-2 flex-wrap">
                {product?.colors?.map((c) => (
                  <button
                    key={c}
                    className="px-4 py-2 rounded-xl border hover:bg-gray-100 transition"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* QUANTITY */}
            <div className="flex justify-between items-center mb-6">
              <span className="font-semibold text-lg">Số lượng</span>
              <div className="flex items-center gap-3">
                <button className="w-10 h-10 border rounded-lg flex items-center justify-center">
                  −
                </button>
                <span className="text-lg font-semibold">1</span>
                <button className="w-10 h-10 border rounded-lg flex items-center justify-center">
                  +
                </button>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-4 mt-4">
              {/* Add to Cart */}
              <button className="flex-1 py-4 bg-yellow-400 text-black rounded-xl font-bold text-lg shadow hover:bg-yellow-300 transition">
                Thêm vào giỏ hàng
              </button>

              {/* Buy Now */}
              <button className="flex-1 py-4 bg-[#ff5722] text-white rounded-xl font-bold text-lg shadow hover:bg-[#e64a19] transition">
                Mua ngay
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

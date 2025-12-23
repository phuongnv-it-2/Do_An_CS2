import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Package,
  CheckCircle,
  Truck,
  XCircle,
  Clock,
  ArrowRight,
  MapPin,
  Calendar,
  User,
  Phone,
} from "lucide-react";
import axios from "axios";
import NavBar_Seller from "./NavBar_Seller";

const SellerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Thêm API_URL
  const API_URL = "https://do-an-cs2.onrender.com";

  // Hàm xử lý đường dẫn ảnh
  const getImageUrl = (imgPath) => {
    if (!imgPath) return "/placeholder.png";
    if (imgPath.startsWith("http")) return imgPath;
    return `${API_URL}/${imgPath.replace(/^\/+/, "")}`;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const response = await axios.get(`${API_URL}/orders/seller/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(response.data.orders);
      // Tự động chọn đơn hàng đầu tiên khi load xong
      if (response.data.orders.length > 0) {
        setSelectedOrder(response.data.orders[0]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `${API_URL}/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Cập nhật UI
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);

      // Cập nhật selectedOrder nếu đang được chọn
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      alert("Cập nhật trạng thái thành công!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Có lỗi xảy ra khi cập nhật trạng thái");
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "confirmed":
        return <CheckCircle className="w-5 h-5 text-blue-600" />;
      case "shipping":
        return <Truck className="w-5 h-5 text-purple-600" />;
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "canceled":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Package className="w-5 h-5" />;
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      pending: "Chờ xác nhận",
      confirmed: "Đã xác nhận",
      shipping: "Đang giao hàng",
      completed: "Hoàn thành",
      canceled: "Đã hủy",
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "bg-yellow-100 text-yellow-800",
      confirmed: "bg-blue-100 text-blue-800",
      shipping: "bg-purple-100 text-purple-800",
      completed: "bg-green-100 text-green-800",
      canceled: "bg-red-100 text-red-800",
    };
    return map[status] || "bg-gray-100 text-gray-800";
  };

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#fffffe]">
        <div className="animate-spin h-12 w-12 rounded-full border-b-2 border-[#00ebc7]"></div>
      </div>
    );
  }

  return (
    <>
      {/* NAVBAR FIXED */}
      <div className="w-full fixed top-0 left-0 z-20">
        <NavBar_Seller />
      </div>

      {/* FULL PAGE WRAPPER */}
      <div className="pt-24 bg-[#fffffe] h-screen w-full overflow-hidden">
        <div className="flex h-full w-full px-6 gap-6">
          {/* ==== LEFT COLUMN: FILTERS ==== */}
          <div className="w-64 flex-shrink-0 h-full">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 p-6 h-full">
              <h2 className="text-xl font-black text-[#00214d] mb-4">
                Lọc đơn hàng
              </h2>

              <div className="flex flex-col gap-3">
                {[
                  "all",
                  "pending",
                  "confirmed",
                  "shipping",
                  "completed",
                  "canceled",
                ].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilter(status)}
                    className={`w-full px-4 py-2 rounded-xl font-bold text-left transition ${
                      filter === status
                        ? "bg-[#00ebc7] text-[#00214d]"
                        : "bg-gray-200 hover:bg-[#00ebc7]/30"
                    }`}
                  >
                    {status === "all" ? "Tất cả" : getStatusText(status)}
                    {status === "pending" &&
                      ` (${
                        orders.filter((o) => o.status === "pending").length
                      })`}
                  </button>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-[#00214d] mb-3">Thống kê</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1b2d45]">
                      Tổng đơn hàng:
                    </span>
                    <span className="font-bold">{orders.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1b2d45]">
                      Chờ xác nhận:
                    </span>
                    <span className="font-bold">
                      {orders.filter((o) => o.status === "pending").length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1b2d45]">Đang xử lý:</span>
                    <span className="font-bold">
                      {
                        orders.filter((o) =>
                          ["confirmed", "shipping"].includes(o.status)
                        ).length
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#1b2d45]">Hoàn thành:</span>
                    <span className="font-bold">
                      {orders.filter((o) => o.status === "completed").length}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ==== MIDDLE COLUMN: ORDERS LIST ==== */}
          <div className="flex-1 min-w-0">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 h-full overflow-hidden flex flex-col">
              <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-black text-[#00214d]">
                  Quản lý đơn hàng ({filteredOrders.length})
                </h1>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p className="text-[#1b2d45] text-lg font-medium">
                      Không có đơn hàng nào
                    </p>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredOrders.map((order) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => setSelectedOrder(order)}
                          className={`
                            bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:shadow-lg
                            flex flex-col h-full
                            ${
                              selectedOrder?.id === order.id
                                ? "border-[#00ebc7] bg-[#00ebc7]/5"
                                : "border-gray-200 hover:border-[#00ebc7]/40"
                            }
                          `}
                        >
                          {/* Header */}
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-bold text-[#00214d] truncate text-sm">
                                #{order.id}
                              </h3>
                              <div className="flex items-center gap-1 mt-1 flex-wrap">
                                <div
                                  className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {getStatusIcon(order.status)}
                                  <span className="whitespace-nowrap">
                                    {getStatusText(order.status)}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="text-right ml-2">
                              <p className="text-base font-black text-[#00214d] whitespace-nowrap">
                                {parseFloat(order.totalPrice).toLocaleString(
                                  "vi-VN"
                                )}{" "}
                                đ
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(order.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>
                          </div>

                          {/* Customer Info */}
                          <div className="mb-3">
                            <p className="text-sm font-medium text-[#1b2d45]">
                              Khách hàng:
                            </p>
                            <p className="text-sm text-[#00214d] font-bold truncate">
                              {order.buyer?.UserName || "Không rõ"}
                            </p>
                          </div>

                          {/* Product Images */}
                          <div className="flex gap-1 mb-3 overflow-x-auto pb-2 flex-grow">
                            {order.items.slice(0, 5).map((item, index) => (
                              <div
                                key={index}
                                className="flex-shrink-0 relative"
                              >
                                <img
                                  src={getImageUrl(item.product.ImgPath)}
                                  className="w-9 h-9 rounded-lg object-cover border border-gray-200"
                                  alt={item.product.Name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = "/placeholder.png";
                                  }}
                                />
                                {item.quantity > 1 && (
                                  <div className="absolute -top-1 -right-1 bg-[#00ebc7] text-[#00214d] text-[10px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                                    {item.quantity}
                                  </div>
                                )}
                              </div>
                            ))}
                            {order.items.length > 5 && (
                              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-[#1b2d45]">
                                +{order.items.length - 5}
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div className="flex justify-between items-center text-xs text-[#1b2d45] pt-2 border-t border-gray-100">
                            <div className="flex items-center gap-1">
                              <Package className="w-3 h-3" />
                              <span className="truncate">
                                {order.items.length} sản phẩm •{" "}
                                {order.paymentMethod}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 text-[#00ebc7] font-medium">
                              <span>Xem chi tiết</span>
                              <ArrowRight className="w-3 h-3" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==== RIGHT COLUMN: ORDER DETAILS ==== */}
          <div className="w-96 flex-shrink-0 h-full">
            <div className="bg-white shadow-xl rounded-2xl border border-gray-200 h-full overflow-hidden flex flex-col">
              {selectedOrder ? (
                <>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-black text-[#00214d] mb-2">
                      Chi tiết đơn hàng
                    </h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-[#1b2d45]">Mã đơn hàng</p>
                        <p className="font-bold text-[#00214d]">
                          #{selectedOrder.id}
                        </p>
                      </div>
                      <div
                        className={`px-4 py-2 rounded-full flex items-center gap-2 ${getStatusColor(
                          selectedOrder.status
                        )}`}
                      >
                        {getStatusIcon(selectedOrder.status)}
                        <span className="font-bold">
                          {getStatusText(selectedOrder.status)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto p-6">
                    {/* Customer Info */}
                    <div className="mb-6">
                      <h3 className="font-bold text-[#00214d] mb-3 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Thông tin khách hàng
                      </h3>
                      <div className="space-y-2 text-sm p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span className="font-medium">
                            {selectedOrder.buyer?.UserName || "Không rõ"}
                          </span>
                        </div>
                        {selectedOrder.buyer?.Email && (
                          <div className="flex items-center gap-2">
                            <span className="text-[#1b2d45]">Email:</span>
                            <span className="font-medium">
                              {selectedOrder.buyer.Email}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Order Info */}
                    <div className="mb-6">
                      <h3 className="font-bold text-[#00214d] mb-3 flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        Thông tin đơn hàng
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-[#1b2d45]">Ngày đặt:</span>
                          <span className="font-medium">
                            {new Date(selectedOrder.createdAt).toLocaleString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#1b2d45]">
                            Phương thức thanh toán:
                          </span>
                          <span className="font-medium">
                            {selectedOrder.paymentMethod}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-[#1b2d45]">Tổng tiền:</span>
                          <span className="font-bold text-lg text-[#00214d]">
                            {parseFloat(
                              selectedOrder.totalPrice
                            ).toLocaleString("vi-VN")}{" "}
                            đ
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="mb-6">
                      <h3 className="font-bold text-[#00214d] mb-3">
                        Sản phẩm ({selectedOrder.items.length})
                      </h3>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex gap-3 p-3 bg-gray-50 rounded-xl"
                          >
                            <img
                              src={getImageUrl(item.product.ImgPath)}
                              className="w-16 h-16 rounded-lg object-cover"
                              alt={item.product.Name}
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "/placeholder.png";
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-[#00214d] truncate">
                                {item.product.Name}
                              </p>
                              <div className="flex justify-between items-center mt-2">
                                <div className="text-sm text-[#1b2d45]">
                                  {item.color && `Màu: ${item.color} • `}
                                  SL: {item.quantity}
                                </div>
                                <p className="font-bold text-[#00214d] whitespace-nowrap">
                                  {parseFloat(item.subtotal).toLocaleString(
                                    "vi-VN"
                                  )}{" "}
                                  đ
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="mb-6">
                      <h3 className="font-bold text-[#00214d] mb-3 flex items-center gap-2">
                        <MapPin className="w-5 h-5" />
                        Địa chỉ giao hàng
                      </h3>
                      <div className="p-4 bg-[#fffffe] border border-[#00ebc7]/40 rounded-xl">
                        <p className="text-[#1b2d45] whitespace-pre-line">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 border-t border-gray-200">
                    <div className="space-y-3">
                      {selectedOrder.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, "confirmed")
                            }
                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition"
                          >
                            Xác nhận đơn hàng
                          </button>
                          <button
                            onClick={() =>
                              updateOrderStatus(selectedOrder.id, "canceled")
                            }
                            className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                          >
                            Từ chối đơn hàng
                          </button>
                        </>
                      )}

                      {selectedOrder.status === "confirmed" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(selectedOrder.id, "shipping")
                          }
                          className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition"
                        >
                          Bắt đầu giao hàng
                        </button>
                      )}

                      {selectedOrder.status === "shipping" && (
                        <button
                          onClick={() =>
                            updateOrderStatus(selectedOrder.id, "completed")
                          }
                          className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition"
                        >
                          Hoàn thành đơn hàng
                        </button>
                      )}

                      {(selectedOrder.status === "completed" ||
                        selectedOrder.status === "canceled") && (
                        <div className="text-center text-gray-500 py-2">
                          Đơn hàng đã được{" "}
                          {selectedOrder.status === "completed"
                            ? "hoàn thành"
                            : "hủy"}
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <Package className="w-20 h-20 mb-4 opacity-30" />
                  <p className="text-[#1b2d45] text-lg font-medium">
                    Chọn một đơn hàng để xem chi tiết
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Nhấn vào đơn hàng trong danh sách để xem thông tin chi tiết
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SellerOrders;

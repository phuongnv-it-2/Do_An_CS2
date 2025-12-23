const express = require("express");
const router = express.Router();
const { Orders, OrderItem, Product, User, Cart, CartItem } = require("../models");
const { sequelize } = require("../models");
const authenticateToken = require("../middleware/auth");
const { Op } = require("sequelize");
router.post("/create", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { productId, quantity, color, paymentMethod, shippingAddress } = req.body;
        const userId = req.user.id;

        // Kiểm tra sản phẩm tồn tại
        const product = await Product.findByPk(productId, {
            include: [{ model: User, as: "creator" }]
        });

        if (!product) {
            await transaction.rollback();
            return res.status(404).json({ message: "Sản phẩm không tồn tại" });
        }

        // Tính tổng tiền
        const itemPrice = parseFloat(product.Price);
        const totalPrice = itemPrice * quantity;

        // Tạo Order
        const order = await Orders.create({
            UserID: userId,
            status: "pending",
            totalPrice: totalPrice,
            paymentMethod: paymentMethod || "COD",
            shippingAddress: shippingAddress
        }, { transaction });

        // Tạo OrderItem
        await OrderItem.create({
            OrderID: order.id,
            ProductID: productId,
            quantity: quantity,
            price: itemPrice,
            color: color || null,
            subtotal: totalPrice
        }, { transaction });

        await transaction.commit();

        // Trả về order với thông tin đầy đủ
        const orderWithDetails = await Orders.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                },
                { model: User, as: "buyer" }
            ]
        });

        res.status(201).json({
            message: "Đơn hàng đã được tạo và gửi đến người bán",
            order: orderWithDetails,
            sellerId: product.creator.id,
            sellerName: product.creator.UserName
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error creating order:", error);
        res.status(500).json({
            message: "Lỗi khi tạo đơn hàng",
            error: error.message
        });
    }
});

// Đặt hàng từ giỏ
router.post("/create-from-cart", authenticateToken, async (req, res) => {
    const transaction = await sequelize.transaction();

    try {
        const { paymentMethod, shippingAddress } = req.body;
        const userId = req.user.id;

        // Lấy giỏ hàng
        const cart = await Cart.findOne({
            where: { UserID: userId },
            include: [{
                model: CartItem,
                as: "items",
                include: [{ model: Product, as: "product" }]
            }]
        });

        if (!cart || !cart.items || cart.items.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ message: "Giỏ hàng trống" });
        }

        // Tính tổng tiền
        let totalPrice = 0;
        cart.items.forEach(item => {
            totalPrice += parseFloat(item.product.Price) * item.quantity;
        });

        // Tạo Order
        const order = await Orders.create({
            UserID: userId,
            status: "pending",
            totalPrice: totalPrice,
            paymentMethod: paymentMethod || "COD",
            shippingAddress: shippingAddress
        }, { transaction });

        // Tạo OrderItems từ CartItems
        for (const cartItem of cart.items) {
            await OrderItem.create({
                OrderID: order.id,
                ProductID: cartItem.ProductID,
                quantity: cartItem.quantity,
                price: parseFloat(cartItem.product.Price),
                color: cartItem.color,
                subtotal: parseFloat(cartItem.product.Price) * cartItem.quantity
            }, { transaction });
        }

        // Xóa giỏ hàng sau khi đặt hàng
        await CartItem.destroy({
            where: { CartID: cart.id },
            transaction
        });

        await transaction.commit();

        // Trả về order với thông tin đầy đủ
        const orderWithDetails = await Orders.findByPk(order.id, {
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                },
                { model: User, as: "buyer" }
            ]
        });

        res.status(201).json({
            message: "Đơn hàng đã được tạo thành công",
            order: orderWithDetails
        });

    } catch (error) {
        await transaction.rollback();
        console.error("Error creating order from cart:", error);
        res.status(500).json({
            message: "Lỗi khi tạo đơn hàng",
            error: error.message
        });
    }
});

// Lấy đơn hàng của mình
router.get("/my-orders", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id;

        const orders = await Orders.findAll({
            where: { UserID: userId },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error getting user orders:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
});

// Hủy đơn hàng
router.put("/:orderId/cancel", authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Orders.findByPk(orderId);

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        if (order.UserID !== userId) {
            return res.status(403).json({
                message: "Bạn không có quyền hủy đơn hàng này"
            });
        }

        if (order.status !== "pending") {
            return res.status(400).json({
                message: "Chỉ có thể hủy đơn hàng đang chờ xử lý"
            });
        }

        order.status = "canceled";
        await order.save();

        res.status(200).json({
            message: "Hủy đơn hàng thành công",
            order
        });
    } catch (error) {
        console.error("Error canceling order:", error);
        res.status(500).json({
            message: "Lỗi khi hủy đơn hàng",
            error: error.message
        });
    }
});

// Lấy danh sách đơn hàng của seller
router.get("/seller/orders", authenticateToken, async (req, res) => {
    try {
        const sellerId = req.user.id;

        const orders = await Orders.findAll({
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    required: true,
                    include: [
                        {
                            model: Product,
                            as: "product",
                            where: { UserID: sellerId }, // 🔥 Lọc sản phẩm thuộc seller
                            required: true
                        }
                    ]
                },
                {
                    model: User,
                    as: "buyer",
                    attributes: ["UserID", "UserName", "Email"]
                }
            ],
            order: [["createdAt", "DESC"]],
            distinct: true
        });

        return res.status(200).json({ orders });

    } catch (error) {
        console.error("Error getting seller orders:", error);
        return res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng",
            error: error.message
        });
    }
});
// Lấy danh sách đơn hàng của customer (người mua)
router.get("/customer/orders", authenticateToken, async (req, res) => {
    try {
        const userId = req.user.id; // ID người mua

        const orders = await Orders.findAll({
            where: { UserID: userId },
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [
                        {
                            model: Product,
                            as: "product",
                            attributes: ["id", "Name", "Price", "ImgPath", "UserID"]
                        }
                    ]
                }
            ],
            order: [["createdAt", "DESC"]]
        });

        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching customer orders:", error);
        res.status(500).json({
            message: "Lỗi khi lấy danh sách đơn hàng của khách hàng",
            error: error.message
        });
    }
});


// Cập nhật trạng thái đơn hàng
router.put("/:orderId/status", authenticateToken, async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const sellerId = req.user.id;

        const order = await Orders.findByPk(orderId, {
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    include: [{ model: Product, as: "product" }]
                }
            ]
        });

        if (!order) {
            return res.status(404).json({ message: "Đơn hàng không tồn tại" });
        }

        // Kiểm tra seller có sản phẩm trong đơn không
        const hasProduct = order.items.some(
            item => item.product.UserID === sellerId
        );

        if (!hasProduct) {
            return res.status(403).json({
                message: "Bạn không có quyền cập nhật đơn hàng này"
            });
        }

        // Valid status
        const validStatuses = ["pending", "confirmed", "shipping", "completed", "canceled"];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Trạng thái không hợp lệ" });
        }

        // Cập nhật
        order.status = status;
        await order.save();

        return res.status(200).json({
            message: "Cập nhật trạng thái đơn hàng thành công",
            order
        });
    } catch (error) {
        console.error("Error updating order status:", error);
        return res.status(500).json({
            message: "Lỗi khi cập nhật đơn hàng",
            error: error.message
        });
    }
});
// ==================== THỐNG KÊ DOANH THU ====================

/**
 * @route   GET /orders/revenue-statistics
 * @desc    Lấy thống kê doanh thu theo tháng từ đơn hàng đã hoàn thành
 * @access  Private
 */
router.get("/revenue-statistics", authenticateToken, async (req, res) => {
    try {
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        // Lấy dữ liệu doanh thu theo tháng cho các đơn đã hoàn thành
        const revenueData = await Orders.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('createdAt')), 'month'],
                [sequelize.fn('YEAR', sequelize.col('createdAt')), 'year'],
                [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'orderCount']
            ],
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${targetYear}-01-01`),
                    [Op.lt]: new Date(`${targetYear + 1}-01-01`)
                }
            },
            group: [
                sequelize.fn('MONTH', sequelize.col('createdAt')),
                sequelize.fn('YEAR', sequelize.col('createdAt'))
            ],
            order: [[sequelize.fn('MONTH', sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        // Format dữ liệu trả về
        const formattedData = revenueData.map(item => ({
            month: parseInt(item.month),
            year: parseInt(item.year),
            totalRevenue: parseFloat(item.totalRevenue) || 0,
            orderCount: parseInt(item.orderCount) || 0
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching revenue statistics:', error);
        res.status(500).json({
            message: 'Không thể tải thống kê doanh thu',
            error: error.message
        });
    }
});

/**
 * @route   GET /orders/revenue-summary
 * @desc    Lấy tổng quan doanh thu
 * @access  Private
 */
router.get("/revenue-summary", authenticateToken, async (req, res) => {
    try {
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;
        const lastMonth = currentMonth === 1 ? 12 : currentMonth - 1;
        const lastMonthYear = currentMonth === 1 ? currentYear - 1 : currentYear;

        // Tổng doanh thu năm nay
        const yearRevenue = await Orders.sum('totalPrice', {
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${currentYear}-01-01`)
                }
            }
        });

        // Tổng doanh thu tháng này
        const monthRevenue = await Orders.sum('totalPrice', {
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`),
                    [Op.lt]: currentMonth === 12
                        ? new Date(`${currentYear + 1}-01-01`)
                        : new Date(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
                }
            }
        });

        // Doanh thu tháng trước
        const lastMonthRevenue = await Orders.sum('totalPrice', {
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${lastMonthYear}-${String(lastMonth).padStart(2, '0')}-01`),
                    [Op.lt]: new Date(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`)
                }
            }
        });

        // Tổng số đơn hàng đã hoàn thành
        const totalCompletedOrders = await Orders.count({
            where: { status: 'completed' }
        });

        // Số đơn hàng tháng này
        const monthOrders = await Orders.count({
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${currentYear}-${String(currentMonth).padStart(2, '0')}-01`),
                    [Op.lt]: currentMonth === 12
                        ? new Date(`${currentYear + 1}-01-01`)
                        : new Date(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`)
                }
            }
        });

        // Doanh thu trung bình mỗi đơn
        const avgOrderValue = totalCompletedOrders > 0
            ? (await Orders.sum('totalPrice', { where: { status: 'completed' } })) / totalCompletedOrders
            : 0;

        // Tính phần trăm tăng trưởng
        const growthRate = lastMonthRevenue > 0
            ? ((monthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(2)
            : 0;

        res.json({
            yearRevenue: parseFloat(yearRevenue) || 0,
            monthRevenue: parseFloat(monthRevenue) || 0,
            lastMonthRevenue: parseFloat(lastMonthRevenue) || 0,
            totalCompletedOrders,
            monthOrders,
            avgOrderValue: parseFloat(avgOrderValue.toFixed(2)) || 0,
            growthRate: parseFloat(growthRate),
            year: currentYear,
            month: currentMonth
        });
    } catch (error) {
        console.error('Error fetching revenue summary:', error);
        res.status(500).json({
            message: 'Không thể tải tổng quan doanh thu',
            error: error.message
        });
    }
});

/**
 * @route   GET /orders/seller/revenue-statistics
 * @desc    Lấy thống kê doanh thu của seller theo tháng
 * @access  Private (Seller only)
 */
router.get("/seller/revenue-statistics", authenticateToken, async (req, res) => {
    try {
        const sellerId = req.user.id;
        const { year } = req.query;
        const targetYear = year ? parseInt(year) : new Date().getFullYear();

        const revenueData = await Orders.findAll({
            attributes: [
                [sequelize.fn('MONTH', sequelize.col('Orders.createdAt')), 'month'],
                [sequelize.fn('YEAR', sequelize.col('Orders.createdAt')), 'year'],
                [sequelize.fn('SUM', sequelize.col('items.subtotal')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('Orders.id'))), 'orderCount']
            ],
            include: [
                {
                    model: OrderItem,
                    as: "items",
                    required: true,
                    attributes: [],
                    include: [
                        {
                            model: Product,
                            as: "product",
                            where: { UserID: sellerId },
                            required: true,
                            attributes: []
                        }
                    ]
                }
            ],
            where: {
                status: 'completed',
                createdAt: {
                    [Op.gte]: new Date(`${targetYear}-01-01`),
                    [Op.lt]: new Date(`${targetYear + 1}-01-01`)
                }
            },
            group: [
                sequelize.fn('MONTH', sequelize.col('Orders.createdAt')),
                sequelize.fn('YEAR', sequelize.col('Orders.createdAt'))
            ],
            order: [[sequelize.fn('MONTH', sequelize.col('Orders.createdAt')), 'ASC']],
            raw: true
        });

        const formattedData = revenueData.map(item => ({
            month: parseInt(item.month),
            year: parseInt(item.year),
            totalRevenue: parseFloat(item.totalRevenue) || 0,
            orderCount: parseInt(item.orderCount) || 0
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Error fetching seller revenue statistics:', error);
        res.status(500).json({
            message: 'Không thể tải thống kê doanh thu',
            error: error.message
        });
    }
});

/**
 * @route   GET /orders/top-products
 * @desc    Lấy sản phẩm bán chạy nhất
 * @access  Private
 */
router.get("/top-products", authenticateToken, async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        const topProducts = await OrderItem.findAll({
            attributes: [
                'ProductID',
                [sequelize.fn('SUM', sequelize.col('quantity')), 'totalQuantity'],
                [sequelize.fn('SUM', sequelize.col('subtotal')), 'totalRevenue'],
                [sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('OrderID'))), 'orderCount']
            ],
            include: [
                {
                    model: Orders,
                    as: 'order',
                    attributes: [],
                    where: { status: 'completed' },
                    required: true
                },
                {
                    model: Product,
                    as: 'product',
                    attributes: ['id', 'Name', 'Price', 'ImgPath']
                }
            ],
            group: ['ProductID', 'product.id'],
            order: [[sequelize.literal('totalRevenue'), 'DESC']],
            limit: parseInt(limit),
            subQuery: false
        });

        const formattedProducts = topProducts.map(item => ({
            productId: item.ProductID,
            productName: item.product?.Name,
            productPrice: item.product?.Price,
            productImage: item.product?.ImgPath,
            totalQuantity: parseInt(item.get('totalQuantity')),
            totalRevenue: parseFloat(item.get('totalRevenue')),
            orderCount: parseInt(item.get('orderCount'))
        }));

        res.json(formattedProducts);
    } catch (error) {
        console.error('Error fetching top products:', error);
        res.status(500).json({
            message: 'Không thể tải sản phẩm bán chạy',
            error: error.message
        });
    }
});


module.exports = router;
// routes/cart.js
const express = require('express');
const router = express.Router();
const { Cart, CartItem, Product, User } = require('../models');
const authenticate = require('../middleware/auth'); // Middleware của bạn

// Hàm tính tổng giá trị giỏ hàng
const calculateCartTotal = async (cartId) => {
    const items = await CartItem.findAll({ where: { CartID: cartId } });
    const total = items.reduce((sum, item) => sum + parseFloat(item.Subtotal), 0);
    await Cart.update({ TotalPrice: total }, { where: { id: cartId } });
    return total;
};

// 1. LẤY GIỎ HÀNG
router.get('/', authenticate, async (req, res) => {
    try {
        const userId = req.user.id; // Từ JWT decoded

        let cart = await Cart.findOne({
            where: { UserID: userId },
            include: [
                {
                    model: CartItem,
                    as: 'items',
                    include: [
                        {
                            model: Product,
                            as: 'product',
                            attributes: ['id', 'Name', 'ImgPath', 'Price']
                        }
                    ]
                }
            ]
        });

        // Tạo giỏ hàng mới nếu chưa có
        if (!cart) {
            cart = await Cart.create({ UserID: userId, TotalPrice: 0 });
            cart.items = [];
        }

        res.json({
            items: cart.items.map(item => ({
                id: item.id,
                productId: item.ProductID,
                name: item.product.Name,
                img: item.product.ImgPath,
                price: parseFloat(item.Price),
                quantity: item.Quantity,
                color: item.ColorName,
                subtotal: parseFloat(item.Subtotal)
            })),
            totalPrice: parseFloat(cart.TotalPrice)
        });
    } catch (error) {
        console.error('GET CART ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi lấy giỏ hàng' });
    }
});

// 2. THÊM SẢN PHẨM VÀO GIỎ HÀNG
router.post('/add', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, quantity = 1, color = 'default' } = req.body;

        console.log('ADD TO CART:', { userId, productId, quantity, color });

        if (!productId) {
            return res.status(400).json({ error: 'Thiếu ProductID' });
        }

        // Kiểm tra sản phẩm có tồn tại không
        const product = await Product.findByPk(productId);
        if (!product) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        // Tìm hoặc tạo giỏ hàng
        let cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) {
            cart = await Cart.create({ UserID: userId, TotalPrice: 0 });
        }

        // Kiểm tra sản phẩm đã có trong giỏ chưa (cùng màu)
        let cartItem = await CartItem.findOne({
            where: {
                CartID: cart.id,
                ProductID: productId,
                ColorName: color
            }
        });

        if (cartItem) {
            // Cập nhật số lượng
            cartItem.Quantity += quantity;
            cartItem.Subtotal = cartItem.Price * cartItem.Quantity;
            await cartItem.save();
        } else {
            // Thêm mới
            cartItem = await CartItem.create({
                CartID: cart.id,
                ProductID: productId,
                Quantity: quantity,
                ColorName: color,
                Price: product.Price,
                Subtotal: product.Price * quantity
            });
        }

        // Cập nhật tổng giá
        await calculateCartTotal(cart.id);

        // Lấy lại giỏ hàng đầy đủ
        cart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        res.json({
            message: 'Thêm vào giỏ hàng thành công',
            cart: {
                items: cart.items.map(item => ({
                    id: item.id,
                    productId: item.ProductID,
                    name: item.product.Name,
                    img: item.product.ImgPath,
                    price: parseFloat(item.Price),
                    quantity: item.Quantity,
                    color: item.ColorName,
                    subtotal: parseFloat(item.Subtotal)
                })),
                totalPrice: parseFloat(cart.TotalPrice)
            }
        });
    } catch (error) {
        console.error('ADD TO CART ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi thêm vào giỏ hàng', details: error.message });
    }
});

// 3. CẬP NHẬT SỐ LƯỢNG
router.put('/update', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color = 'default', quantity } = req.body;

        if (!productId || quantity === undefined) {
            return res.status(400).json({ error: 'Thiếu thông tin' });
        }

        const cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Giỏ hàng không tồn tại' });
        }

        const cartItem = await CartItem.findOne({
            where: {
                CartID: cart.id,
                ProductID: productId,
                ColorName: color
            }
        });

        if (!cartItem) {
            return res.status(404).json({ error: 'Sản phẩm không có trong giỏ' });
        }

        if (quantity <= 0) {
            // Xóa nếu số lượng <= 0
            await cartItem.destroy();
        } else {
            // Cập nhật
            cartItem.Quantity = quantity;
            cartItem.Subtotal = cartItem.Price * quantity;
            await cartItem.save();
        }

        // Cập nhật tổng giá
        await calculateCartTotal(cart.id);

        // Lấy lại giỏ hàng
        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        res.json({
            message: 'Cập nhật thành công',
            cart: {
                items: updatedCart.items.map(item => ({
                    id: item.id,
                    productId: item.ProductID,
                    name: item.product.Name,
                    img: item.product.ImgPath,
                    price: parseFloat(item.Price),
                    quantity: item.Quantity,
                    color: item.ColorName,
                    subtotal: parseFloat(item.Subtotal)
                })),
                totalPrice: parseFloat(updatedCart.TotalPrice)
            }
        });
    } catch (error) {
        console.error('UPDATE CART ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi cập nhật' });
    }
});

// 4. XÓA SẢN PHẨM
router.delete('/remove', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;
        const { productId, color = 'default' } = req.body;

        const cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Giỏ hàng không tồn tại' });
        }

        const deleted = await CartItem.destroy({
            where: {
                CartID: cart.id,
                ProductID: productId,
                ColorName: color
            }
        });

        if (deleted === 0) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại' });
        }

        // Cập nhật tổng giá
        await calculateCartTotal(cart.id);

        // Lấy lại giỏ hàng
        const updatedCart = await Cart.findOne({
            where: { id: cart.id },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        res.json({
            message: 'Xóa sản phẩm thành công',
            cart: {
                items: updatedCart.items.map(item => ({
                    id: item.id,
                    productId: item.ProductID,
                    name: item.product.Name,
                    img: item.product.ImgPath,
                    price: parseFloat(item.Price),
                    quantity: item.Quantity,
                    color: item.ColorName,
                    subtotal: parseFloat(item.Subtotal)
                })),
                totalPrice: parseFloat(updatedCart.TotalPrice)
            }
        });
    } catch (error) {
        console.error('REMOVE CART ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi xóa sản phẩm' });
    }
});

// 5. XÓA TOÀN BỘ GIỎ HÀNG
router.delete('/clear', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({ where: { UserID: userId } });
        if (!cart) {
            return res.status(404).json({ error: 'Giỏ hàng không tồn tại' });
        }

        // Xóa tất cả items
        await CartItem.destroy({ where: { CartID: cart.id } });

        // Cập nhật tổng giá về 0
        cart.TotalPrice = 0;
        await cart.save();

        res.json({
            message: 'Đã xóa giỏ hàng',
            cart: { items: [], totalPrice: 0 }
        });
    } catch (error) {
        console.error('CLEAR CART ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi xóa giỏ hàng' });
    }
});
// 6. THANH TOÁN TOÀN BỘ GIỎ HÀNG
router.post('/checkout', authenticate, async (req, res) => {
    try {
        const userId = req.user.id;

        const cart = await Cart.findOne({
            where: { UserID: userId },
            include: [{
                model: CartItem,
                as: 'items',
                include: [{
                    model: Product,
                    as: 'product'
                }]
            }]
        });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ error: 'Giỏ hàng trống' });
        }

        // 👉 DỮ LIỆU THANH TOÁN
        const orderItems = cart.items.map(item => ({
            productId: item.ProductID,
            name: item.product.Name,
            price: parseFloat(item.Price),
            quantity: item.Quantity,
            color: item.ColorName,
            subtotal: parseFloat(item.Subtotal)
        }));

        const totalPrice = parseFloat(cart.TotalPrice);

        // 👉 XÓA GIỎ HÀNG SAU KHI THANH TOÁN
        await CartItem.destroy({ where: { CartID: cart.id } });
        cart.TotalPrice = 0;
        await cart.save();

        res.json({
            message: 'Thanh toán thành công',
            order: {
                items: orderItems,
                totalPrice
            }
        });

    } catch (error) {
        console.error('CHECKOUT ERROR:', error);
        res.status(500).json({ error: 'Lỗi khi thanh toán' });
    }
});


module.exports = router;
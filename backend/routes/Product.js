const express = require('express');
const router = express.Router();
const { Product, User, ProductColor, ProductReview } = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// Tạo thư mục uploads nếu chưa có
const uploadDir = 'uploads/products';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Config multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filter chỉ cho phép upload ảnh
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        cb(null, true);
    } else {
        cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: fileFilter
});

// Middleware xác thực JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Chưa đăng nhập' });

    const token = authHeader.split(' ')[1]; // Bearer <token>
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || 'access_secret_key', (err, user) => {
        if (err) return res.status(403).json({ message: 'Token không hợp lệ' });
        req.userID = user.id; // lưu userID từ payload token
        next();
    });
}

// Get all products (kèm user tạo)
router.get('/', async (req, res) => {
    try {
        const products = await Product.findAll({
            include: [
                { model: User, as: 'creator', attributes: ['UserID', 'UserName'] },
                { model: ProductColor, as: 'colors', attributes: ['ColorName'] },
                {
                    model: ProductReview,
                    as: 'reviews',
                    attributes: ['Rating'] // chỉ lấy rating để tính trung bình
                }
            ]
        });

        // Tính rating trung bình cho mỗi sản phẩm
        const productsWithRating = products.map(p => {
            const ratings = p.reviews.map(r => r.Rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : null;
            return {
                ...p.toJSON(),
                avgRating
            };
        });

        res.json(productsWithRating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { Name, Description, Price, colors } = req.body;

        if (!Name || !Description || !Price) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const parsedPrice = Number(Price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Price phải là số lớn hơn 0' });
        }

        const user = await User.findByPk(req.userID);
        if (!user) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'User không tồn tại' });
        }

        const product = await Product.create({
            Name: Name.trim(),
            Description: Description.trim(),
            Price: parsedPrice,
            ImgPath: req.file ? req.file.path : null,
            UserID: req.userID
        });

        // Lưu colors nếu có
        if (colors) {
            let colorsArray = Array.isArray(colors) ? colors : [colors];
            await Promise.all(colorsArray.map(c => ProductColor.create({
                ProductID: product.id,
                ColorName: c
            })));
        }

        res.status(201).json({ message: 'Tạo sản phẩm thành công', product });
    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
});

// ================= UPDATE PRODUCT =================
router.put('/:id', authenticateToken, upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const { Name, Description, Price, colors } = req.body;
        const product = await Product.findByPk(id);

        if (!product) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        if (!Name || !Description || !Price) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
        }

        const parsedPrice = Number(Price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Price phải là số lớn hơn 0' });
        }

        // Xóa ảnh cũ nếu có
        if (req.file && product.ImgPath && fs.existsSync(product.ImgPath)) {
            fs.unlinkSync(product.ImgPath);
        }

        await product.update({
            Name: Name.trim(),
            Description: Description.trim(),
            Price: parsedPrice,
            ImgPath: req.file ? req.file.path : product.ImgPath
        });

        // Cập nhật colors
        if (colors) {
            let colorsArray = Array.isArray(colors) ? colors : [colors];
            await ProductColor.destroy({ where: { ProductID: product.id } });
            await Promise.all(colorsArray.map(c => ProductColor.create({
                ProductID: product.id,
                ColorName: c
            })));
        }

        res.json({ message: 'Cập nhật sản phẩm thành công', product });
    } catch (err) {
        console.error(err);
        if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
});

// ================= DELETE PRODUCT =================
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) return res.status(404).json({ message: 'Sản phẩm không tồn tại' });

        if (product.ImgPath && fs.existsSync(product.ImgPath)) fs.unlinkSync(product.ImgPath);

        // Xóa màu liên quan
        await ProductColor.destroy({ where: { ProductID: product.id } });
        await product.destroy();

        res.json({ message: 'Xóa sản phẩm thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
});

// GET product theo ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: User, as: 'creator', attributes: ['UserID', 'UserName'] },
                { model: ProductColor, as: 'colors', attributes: ['ColorName'] },
                { model: ProductReview, as: 'reviews', attributes: ['Rating', 'Comment'] }
            ]
        });

        if (!product) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        const ratings = product.reviews.map(r => r.Rating);
        const avgRating = ratings.length > 0
            ? ratings.reduce((a, b) => a + b, 0) / ratings.length
            : null;

        res.json({
            ...product.toJSON(),
            avgRating
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
});


module.exports = router;
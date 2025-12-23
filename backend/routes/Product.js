const express = require('express');
const router = express.Router();
const { Product, User, ProductColor, ProductReview, sequelize } = require('../models'); // ✅ Thêm sequelize
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require("sequelize");
const auth = require('../middleware/auth');

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


const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB cho mod3D
    fileFilter: (req, file, cb) => {
        if (file.fieldname === 'image') {
            const allowedTypes = /jpeg|jpg|png|gif|webp/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) return cb(null, true);
            return cb(new Error('Chỉ chấp nhận file ảnh (jpeg, jpg, png, gif, webp)'));
        }
        cb(null, true);
    }
});

const uploadFiles = upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'mod3D', maxCount: 1 }
]);

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

// ============= QUAN TRỌNG: ĐẶT ROUTES CỤ THỂ TRƯỚC ROUTES ĐỘNG =============

// 📊 GET METRICS - ✅ ĐẶT TRƯỚC /:id
router.get("/metrics", async (req, res) => {
    try {
        // Đếm tổng số sản phẩm
        const totalProducts = await Product.count();

        // Tính tổng số reviews và rating trung bình
        const reviewStats = await ProductReview.findOne({
            attributes: [
                [sequelize.fn('COUNT', sequelize.col('id')), 'totalReviews'],
                [sequelize.fn('AVG', sequelize.col('Rating')), 'avgRating']
            ],
            raw: true
        });

        res.json({
            totalProducts: totalProducts || 0,
            totalReviews: parseInt(reviewStats?.totalReviews) || 0,
            avgRating: parseFloat(reviewStats?.avgRating || 0).toFixed(1)
        });
    } catch (error) {
        console.error('Error fetching metrics:', error);
        res.status(500).json({
            message: 'Lỗi khi lấy metrics',
            error: error.message
        });
    }
});

// GET MY PRODUCTS - ✅ ĐẶT TRƯỚC /:id
router.get('/myproducts', auth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Chưa đăng nhập' });
        }

        const products = await Product.findAll({
            where: { UserID: req.user.id },
            include: [
                { model: User, as: 'creator', attributes: ['UserID', 'UserName'] },
                { model: ProductColor, as: 'colors', attributes: ['ColorName'] },
                { model: ProductReview, as: 'reviews', attributes: ['Rating', 'Comment'] }
            ],
            order: [['createdAt', 'DESC']]
        });

        const productsWithRating = products.map(product => {
            const ratings = product.reviews.map(r => r.Rating);
            const avgRating = ratings.length > 0
                ? ratings.reduce((a, b) => a + b, 0) / ratings.length
                : 0;
            return {
                ...product.toJSON(),
                avgRating,
                reviewCount: ratings.length
            };
        });

        res.json(productsWithRating);

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error', detail: err.message });
    }
});

// GET OTHERS PRODUCTS - ✅ ĐẶT TRƯỚC /:id
router.get("/others", async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        let userId = null;
        if (token) {
            const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access_secret_key");
            userId = decoded.id;
        } else {
            console.log("Không có token, sẽ trả về tất cả sản phẩm");
        }

        const products = await Product.findAll({
            where: userId ? { UserID: { [Op.ne]: userId } } : {},
            include: [
                { model: User, as: 'creator', attributes: ['UserID', 'UserName'] },
                { model: ProductColor, as: 'colors', attributes: ['ColorName'] },
                {
                    model: ProductReview,
                    as: 'reviews',
                    attributes: ['Rating', 'Comment', 'createdAt'],
                    include: [{ model: User, as: 'user', attributes: ['UserName'] }]
                }
            ]
        });

        const productsWithRating = products.map(p => {
            const productJson = p.toJSON();
            const reviews = productJson.reviews || [];
            const ratings = reviews.map(r => r.Rating);
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : 0;

            return {
                ...productJson,
                rating: avgRating,
                reviewCount: reviews.length
            };
        });
        res.json(productsWithRating);

    } catch (err) {
        console.error("Lỗi khi xử lý API /products/others:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

// Get all products (kèm user tạo)
router.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const lastId = parseInt(req.query.lastId) || 0;

        const products = await Product.findAll({
            where: lastId > 0 ? { id: { [Op.gt]: lastId } } : {}, // keyset pagination
            include: [
                { model: User, as: 'creator', attributes: ['UserID', 'UserName'] },
                { model: ProductColor, as: 'colors', attributes: ['ColorName'] },
                {
                    model: ProductReview,
                    as: 'reviews',
                    attributes: ['Rating', 'Comment', 'createdAt'],
                    include: [
                        { model: User, as: 'user', attributes: ['UserName'] }
                    ]
                }
            ],
            order: [['id', 'ASC']], // sắp xếp theo id tăng dần
            limit: limit
        });

        const productsWithRating = products.map(p => {
            const productJson = p.toJSON();
            const reviews = productJson.reviews || [];
            const ratings = reviews.map(r => r.Rating);
            const avgRating = ratings.length > 0
                ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
                : 0;

            return {
                ...productJson,
                rating: avgRating,
                reviewCount: reviews.length,
                mod3D: productJson.mod3D ? `${req.protocol}://${req.get('host')}/${productJson.mod3D}` : null
            };
        });

        res.json(productsWithRating);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Chấp nhận 2 file: image và mod3D
router.post(
    '/',
    authenticateToken,
    upload.fields([
        { name: 'image', maxCount: 1 },
        { name: 'mod3D', maxCount: 1 }
    ]),
    async (req, res) => {
        try {
            const { Name, Description, Price, colors } = req.body;

            if (!Name || !Description || !Price) {
                // Xóa file nếu có
                if (req.files?.image) fs.unlinkSync(req.files.image[0].path);
                if (req.files?.mod3D) fs.unlinkSync(req.files.mod3D[0].path);
                return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
            }

            const parsedPrice = Number(Price);
            if (isNaN(parsedPrice) || parsedPrice <= 0) {
                if (req.files?.image) fs.unlinkSync(req.files.image[0].path);
                if (req.files?.mod3D) fs.unlinkSync(req.files.mod3D[0].path);
                return res.status(400).json({ message: 'Price phải là số lớn hơn 0' });
            }

            const user = await User.findByPk(req.userID);
            if (!user) {
                if (req.files?.image) fs.unlinkSync(req.files.image[0].path);
                if (req.files?.mod3D) fs.unlinkSync(req.files.mod3D[0].path);
                return res.status(400).json({ message: 'User không tồn tại' });
            }

            const product = await Product.create({
                Name: Name.trim(),
                Description: Description.trim(),
                Price: parsedPrice,
                ImgPath: req.files?.image ? req.files.image[0].path : null,
                mod3D: req.files?.mod3D ? req.files.mod3D[0].path : null,
                UserID: req.userID
            });

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
            if (req.files?.image && fs.existsSync(req.files.image[0].path)) fs.unlinkSync(req.files.image[0].path);
            if (req.files?.mod3D && fs.existsSync(req.files.mod3D[0].path)) fs.unlinkSync(req.files.mod3D[0].path);
            res.status(500).json({ message: 'Internal server error', detail: err.message });
        }
    }
);

// UPDATE PRODUCT
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

// DELETE PRODUCT
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

// ============= GET PRODUCT BY ID - ✅ ĐẶT CUỐI CÙNG =============
router.get("/:id", async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        let userId = null;

        if (authHeader) {
            const token = authHeader.split(" ")[1]; // Bearer <token>
            try {
                const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "access_secret_key");
                userId = decoded.id;
            } catch (err) {
                console.log("Token không hợp lệ, bỏ qua");
            }
        }

        const product = await Product.findByPk(req.params.id, {
            include: [
                { model: User, as: "creator", attributes: ["UserID", "UserName"] },
                { model: ProductColor, as: "colors", attributes: ["ColorName"] },
                { model: ProductReview, as: "reviews", attributes: ["Rating", "Comment"] }
            ]
        });

        if (!product) return res.status(404).json({ message: "Sản phẩm không tồn tại" });

        const ratings = product.reviews.map(r => r.Rating);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        res.json({
            ...product.toJSON(),
            avgRating,
            reviewCount: ratings.length,
            viewerId: userId // nếu có token thì gửi id người xem
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", detail: err.message });
    }
});

module.exports = router;
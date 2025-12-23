const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = db.User;

const avatarDir = path.join(__dirname, "..", "uploads", "avatars");
if (!fs.existsSync(avatarDir)) {
    fs.mkdirSync(avatarDir, { recursive: true });
}

// Cấu hình multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, avatarDir);
    },
    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });
// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser)
            return res.status(400).json({ message: 'Email đã tồn tại' });

        const hashedPassword = password;

        const userRole = role || "CUSTOMER";
        const prefix = userRole === "SELLER" ? "SEL" : "CUS";

        // Lấy user cuối cùng để tăng số thứ tự
        const lastUser = await User.findOne({
            where: { Role: userRole },
            order: [['UserID', 'DESC']]
        });

        let newNumber = 1;
        if (lastUser && lastUser.UserID) {
            newNumber = parseInt(lastUser.UserID.slice(3)) + 1;
        }

        const newUserID = `${prefix}${String(newNumber).padStart(5, '0')}`;

        // Tạo user mới
        const newUser = await User.create({
            UserID: newUserID,
            UserName: username,
            Email: email,
            Password: hashedPassword,
            Role: userRole,
            ImgPath: null
        });

        res.json({ message: 'Đăng ký thành công ✅', user: newUser });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== LOGIN =====================
router.post('/login', async (req, res) => {
    const { user, password } = req.body;

    try {
        const foundUser = await User.findOne({
            where: {
                [db.Sequelize.Op.or]: [
                    { Email: user },
                    { UserName: user }
                ]
            }
        });

        if (!foundUser)
            return res.status(400).json({ message: 'Email hoặc tài khoản không đúng' });
        const match = await bcrypt.compare(password, foundUser.Password);
        if (!match)
            return res.status(400).json({ message: 'Mật khẩu không đúng' });

        const accessToken = jwt.sign(
            {
                id: foundUser.UserID,
                role: foundUser.Role,
                email: foundUser.Email
            },
            process.env.ACCESS_TOKEN_SECRET || 'access_secret_key',
            { expiresIn: '15m' }
        );

        // Tạo refresh token
        const refreshToken = jwt.sign(
            {
                id: foundUser.UserID,
                email: foundUser.Email
            },
            process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key',
            { expiresIn: '7d' }
        );

        // Lưu refresh token vào cookie
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Chỉ secure trong production
            sameSite: 'strict',
            path: '/',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
        });

        // Xử lý đường dẫn ảnh
        let imgUrl = null;
        if (foundUser.ImgPath) {
            if (foundUser.ImgPath.startsWith('http')) {
                imgUrl = foundUser.ImgPath;
            } else {
                imgUrl = `${req.protocol}://${req.get('host')}${foundUser.ImgPath}`;
            }
        }

        // Xác định trang chuyển hướng
        let redirectUrl = '/';
        switch (foundUser.Role) {
            case "ADMIN":
                redirectUrl = "/dashboard";
                break;
            case "SELLER":
                redirectUrl = "/seller";
                break;
            case "CUSTOMER":
                redirectUrl = "/customer";
                break;
            default:
                redirectUrl = "/";
        }

        // Trả response
        res.json({
            message: "Đăng nhập thành công",
            accessToken,
            user: {
                id: foundUser.UserID,
                email: foundUser.Email,
                name: foundUser.UserName,
                role: foundUser.Role,
                img: imgUrl,
                redirect: redirectUrl
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            message: "Lỗi server",
            error: process.env.NODE_ENV === 'development' ? err.message : null
        });
    }
});
// ===================== METRICS - Tổng số user =====================
router.get('/metrics', async (req, res) => {
    try {
        // Đếm tất cả user trừ admin
        const totalUsers = await User.count({
            where: {
                Role: ["CUSTOMER", "SELLER"]
            }
        });

        const customers = await User.count({ where: { Role: "CUSTOMER" } });
        const sellers = await User.count({ where: { Role: "SELLER" } });

        res.json({
            totalUsers,
            customers,
            sellers
        });

    } catch (error) {
        console.error('User metrics error:', error);
        res.status(500).json({
            message: 'Lỗi server',
            error: error.message
        });
    }
});


// ===================== REFRESH TOKEN =====================
router.post('/refresh', (req, res) => {
    const token = req.cookies.refreshToken;
    if (!token)
        return res.status(401).json({ message: 'Chưa đăng nhập' });

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key', (err, user) => {
        if (err)
            return res.status(403).json({ message: 'Token không hợp lệ' });

        const newAccessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET || 'access_secret_key',
            { expiresIn: '15m' }
        );

        res.json({ accessToken: newAccessToken });
    });
});


// ===================== LOGOUT =====================
router.post('/logout', (req, res) => {
    res.clearCookie('refreshToken');
    res.json({ message: 'Đăng xuất thành công' });
});


// GET - Lấy thông tin profile
router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findOne({
            where: { UserID: req.user.id },
            attributes: ['UserID', 'UserName', 'Email', 'ImgPath', 'Role']
        });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// PUT - Cập nhật profile
router.put('/profile', auth, upload.single('avatar'), async (req, res) => {
    try {
        const { UserName, Email } = req.body;
        const userId = req.user.id;

        // Tìm user
        const user = await User.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Kiểm tra email đã tồn tại chưa (nếu thay đổi email)
        if (Email && Email !== user.Email) {
            const existingUser = await User.findOne({ where: { Email } });
            if (existingUser) {
                return res.status(400).json({ message: 'Email đã được sử dụng' });
            }
        }

        // Chuẩn bị dữ liệu cập nhật
        const updateData = {};

        if (UserName) updateData.UserName = UserName;
        if (Email) updateData.Email = Email;

        // Xử lý upload ảnh mới
        if (req.file) {
            // Xóa ảnh cũ nếu có
            if (user.ImgPath) {
                const oldImagePath = path.join(__dirname, '..', user.ImgPath);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            // Lưu đường dẫn ảnh mới (relative path)
            updateData.ImgPath = `/uploads/avatars/${req.file.filename}`;
        }

        // Cập nhật user
        await user.update(updateData);

        // Trả về user đã cập nhật
        const updatedUser = await User.findOne({
            where: { UserID: userId },
            attributes: ['UserID', 'UserName', 'Email', 'ImgPath', 'Role']
        });

        res.json({
            message: 'Cập nhật thông tin thành công',
            user: updatedUser
        });

    } catch (error) {
        console.error('Update profile error:', error);

        // Xóa file đã upload nếu có lỗi
        if (req.file) {
            const filePath = path.join(__dirname, '..', 'uploads', 'avatars', req.file.filename);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

// DELETE - Xóa avatar
router.delete('/profile/avatar', auth, async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Xóa file ảnh
        if (user.ImgPath) {
            const imagePath = path.join(__dirname, '..', user.ImgPath);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        // Cập nhật database
        await user.update({ ImgPath: null });

        res.json({ message: 'Đã xóa avatar thành công' });

    } catch (error) {
        console.error('Delete avatar error:', error);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});
// ===================== CHANGE PASSWORD =====================
router.put('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Validate input
        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: 'Vui lòng nhập đầy đủ mật khẩu hiện tại và mật khẩu mới'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: 'Mật khẩu mới phải có ít nhất 6 ký tự'
            });
        }

        // Tìm user
        const user = await User.findOne({ where: { UserID: userId } });

        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
        const isPasswordValid = await bcrypt.compare(currentPassword, user.Password);
        const match = await bcrypt.compare(currentPassword, user.Password);

        if (!match) {
            return res.status(400).json({
                message: 'Mật khẩu hiện tại không đúng'
            });
        }

        // Kiểm tra mật khẩu mới không trùng với mật khẩu cũ
        const isSamePassword = await bcrypt.compare(newPassword, user.Password);
        if (isSamePassword) {
            return res.status(400).json({
                message: 'Mật khẩu mới không được trùng với mật khẩu cũ'
            });
        }

        // Mã hóa mật khẩu mới
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Cập nhật mật khẩu
        await user.update({ Password: hashedPassword });

        res.json({
            message: 'Đổi mật khẩu thành công'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({
            message: 'Đổi mật khẩu thất bại',
            error: error.message
        });
    }
});


module.exports = router;

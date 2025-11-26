const express = require('express');
const router = express.Router();
const db = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
router.use(cookieParser());

const User = db.User;

// ===================== REGISTER =====================
router.post('/register', async (req, res) => {
    const { username, email, password, role } = req.body;

    try {
        // Kiểm tra email đã tồn tại
        const existingUser = await User.findOne({ where: { Email: email } });
        if (existingUser)
            return res.status(400).json({ message: 'Email đã tồn tại' });

        // Hash mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

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
            where: { Email: user }
        });

        if (!foundUser)
            return res.status(400).json({ message: 'Không tìm thấy người dùng' });

        const match = await bcrypt.compare(password, foundUser.Password);
        if (!match)
            return res.status(400).json({ message: 'Sai mật khẩu' });

        // ✅ Tạo Access Token và Refresh Token
        const accessToken = jwt.sign(
            { id: foundUser.UserID, role: foundUser.Role },
            process.env.ACCESS_TOKEN_SECRET || 'access_secret_key',
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { id: foundUser.UserID },
            process.env.REFRESH_TOKEN_SECRET || 'refresh_secret_key',
            { expiresIn: '7d' }
        );

        // ✅ Lưu refresh token vào cookie HTTP-only
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            path: '/'
        });

        // ✅ Gửi access token và user info
        res.json({
            message: 'Đăng nhập thành công',
            accessToken,
            user: {
                id: foundUser.UserID,
                email: foundUser.Email,
                role: foundUser.Role,
                name: foundUser.UserName
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
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

module.exports = router;

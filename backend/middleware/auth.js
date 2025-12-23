const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        console.log("=== AUTH MIDDLEWARE DEBUG ===");
        console.log("Authorization Header:", authHeader);

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                error: "Thiếu token",
                message: "Vui lòng đăng nhập"
            });
        }

        const token = authHeader.split(" ")[1];
        console.log("Token:", token);

        if (!token) {
            return res.status(401).json({ error: "Token không hợp lệ" });
        }

        // ✅ Dùng đúng secret key giống trong login
        const SECRET_KEY = process.env.ACCESS_TOKEN_SECRET || "access_secret_key";

        const decoded = jwt.verify(token, SECRET_KEY);
        console.log("✅ Token decoded:", decoded);
        req.user = {
            id: decoded.id,
            role: decoded.role
        };

        console.log("✅ req.user:", req.user);
        next();

    } catch (err) {
        console.error("❌ JWT ERROR:", err.message);

        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                error: "Token đã hết hạn",
                message: "Vui lòng đăng nhập lại"
            });
        }

        return res.status(401).json({
            error: "Token không hợp lệ",
            message: err.message
        });
    }
};

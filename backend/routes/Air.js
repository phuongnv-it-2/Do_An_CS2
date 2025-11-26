const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

// TOKEN AQICN — nhớ đổi token thật của bạn
const API_TOKEN = "0704956c4644894353c4371932d555f2cddd2ae1"; // thay bằng token của bạn

// GET /air?city=da-nang
router.get("/", async (req, res) => {
    try {
        const city = req.query.city || "quang-tri";

        const url = `https://api.waqi.info/feed/${city}/?token=${API_TOKEN}`;

        const response = await fetch(url);
        const data = await response.json();

        if (!data || data.status !== "ok") {
            return res.status(400).json({ message: "Không lấy được dữ liệu AQI" });
        }

        res.json({
            city: data.data.city.name,
            aqi: data.data.aqi,
            detail: data.data
        });

    } catch (error) {
        console.error("Lỗi gọi API:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;

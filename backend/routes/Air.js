const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");

const API_TOKEN = "0704956c4644894353c4371932d555f2cddd2ae1";

router.get("/", async (req, res) => {
    try {
        const city = req.query.city;

        const url = `https://api.waqi.info/feed/${city}/?token=${API_TOKEN}`;

        const response = await fetch(url);
        const data = await response.json();
        if (!data || data.status !== "ok") {
            return res.status(400).json({ message: "Không lấy được dữ liệu AQI" });
        }
        console.log(JSON.stringify(data.data.iaqi, null, 2));



        res.json({
            city: data.data.city.name,
            geo: data.data.city.geo,
            aqi: data.data.aqi,
            iaqi: {
                pm25: data.data.iaqi?.pm25 ?? null,
                pm10: data.data.iaqi?.pm10 ?? null,
                no2: data.data.iaqi?.no2 ?? null,
                co: data.data.iaqi?.co ?? null,
                so2: data.data.iaqi?.so2 ?? null,
                o3: data.data.iaqi?.o3 ?? null,
                t: data.data.iaqi?.t ?? null,
                h: data.data.iaqi?.h ?? null,
                w: data.data.iaqi?.w ?? null,
                p: data.data.iaqi?.p ?? null,
                dew: data.data.iaqi?.dew ?? null
            },
            dominentpol: data.data.dominentpol,
            time: data.data.time,
            forecast: {
                daily: {
                    pm25: data.data.forecast?.daily?.pm25 ?? [],
                    pm10: data.data.forecast?.daily?.pm10 ?? [],
                    o3: data.data.forecast?.daily?.o3 ?? [],
                    no2: data.data.forecast?.daily?.no2 ?? [],
                    so2: data.data.forecast?.daily?.so2 ?? [],
                    co: data.data.forecast?.daily?.co ?? []
                }
            },
            attributions: data.data.attributions
        });


    } catch (error) {
        console.error("Lỗi gọi API:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
});

module.exports = router;

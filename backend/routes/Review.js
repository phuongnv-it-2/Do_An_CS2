const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
module.exports = (db) => {
    const ProductReview = db.ProductReview;

    // Tạo đánh giá
    router.post("/create", auth, async (req, res) => {
        try {
            const { productId, rating, comment } = req.body;

            if (!productId) return res.status(400).json({ message: "Thiếu productId" });
            if (!rating || rating < 1 || rating > 5)
                return res.status(400).json({ message: "Rating không hợp lệ" });

            const newReview = await ProductReview.create({
                ProductID: productId,
                UserID: req.user.id,
                Rating: rating,
                Comment: comment || ""
            });

            console.log("USER:", req.user); // fix dòng log lỗi

            res.json({
                message: "Đánh giá thành công!",
                review: newReview
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server", error: err.message });
        }
    });


    router.get("/product/:id", async (req, res) => {
        try {
            const reviews = await ProductReview.findAll({
                where: { ProductID: req.params.id },
                include: [
                    {
                        model: db.User,
                        as: "user",
                        attributes: ["UserName"]
                    }
                ],
                order: [["createdAt", "DESC"]]
            });

            res.json({ reviews });

        } catch (err) {
            console.error(err);
            res.status(500).json({ message: "Lỗi server" });
        }
    });



    return router;
};

const express = require("express");
const router = express.Router();
const db = require("../models");
const auth = require("../middleware/auth");
const Comment = db.Comment;
const User = db.User;


router.post("/", auth, async (req, res) => {
    try {
        const { Content, PostID } = req.body;
        const UserID = req.user.id; // ✅ LẤY TỪ TOKEN

        if (!Content || !PostID) {
            return res.status(400).json({
                message: "Thiếu nội dung hoặc bài viết"
            });
        }

        const lastComment = await Comment.findOne({
            order: [["createdAt", "DESC"]]
        });

        const number = lastComment
            ? parseInt(lastComment.CommentID.slice(7)) + 1
            : 1;

        const commentID = `COMMENT${String(number).padStart(5, "0")}`;

        const comment = await Comment.create({
            CommentID: commentID,
            Content,
            PostID,
            UserID
        });

        const result = await Comment.findOne({
            where: { CommentID: commentID },
            include: {
                model: User,
                as: "user",
                attributes: ["UserID", "UserName", "ImgPath"]
            }
        });

        res.status(201).json({
            message: "Thêm bình luận thành công",
            comment: result
        });

    } catch (err) {
        console.error("Create comment error:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});


router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const comments = await Comment.findAll({
            where: { PostID: postId },
            include: {
                model: User,
                as: "user",
                attributes: ["UserID", "UserName", "ImgPath"]
            },
            order: [["createdAt", "ASC"]]
        });

        res.json(comments);

    } catch (err) {
        console.error("Get comments error:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
});

module.exports = router;

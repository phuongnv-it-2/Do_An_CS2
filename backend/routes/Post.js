const express = require('express');
const router = express.Router();
const db = require('../models');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Post = db.Post;
const User = db.User;

// ===================== MULTER CONFIG =====================
const uploadDir = path.join(__dirname, '..', 'uploads', 'posts');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });


// ===================== CREATE POST =====================
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const { Title, Content, Status } = req.body;
        const userId = req.user.id;

        if (!Title || !Content) {
            return res.status(400).json({ message: 'Thiếu tiêu đề hoặc nội dung' });
        }

        // Sinh PostID
        const lastPost = await Post.findOne({ order: [['createdAt', 'DESC']] });
        const number = lastPost ? parseInt(lastPost.PostID.slice(4)) + 1 : 1;
        const postID = `POST${String(number).padStart(5, '0')}`;

        const post = await Post.create({
            PostID: postID,
            Title,
            Content,
            Status: Status || 'DRAFT',
            UserID: userId,
            ImagePath: req.file ? `/uploads/posts/${req.file.filename}` : null
        });

        res.status(201).json({
            message: 'Tạo bài viết thành công',
            post
        });

    } catch (err) {
        console.error('Create post error:', err);

        if (req.file) {
            const p = path.join(uploadDir, req.file.filename);
            if (fs.existsSync(p)) fs.unlinkSync(p);
        }

        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== GET ALL PUBLISHED POSTS =====================
router.get('/', async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { Status: 'PUBLISHED' },
            include: {
                model: User,
                as: 'author',
                attributes: ['UserID', 'UserName', 'ImgPath']
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== GET MY POSTS =====================
router.get('/my-posts', auth, async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { UserID: req.user.id },
            order: [['createdAt', 'DESC']]
        });

        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== GET POST DETAIL =====================
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findOne({
            where: { PostID: req.params.id },
            include: {
                model: User,
                as: 'author',
                attributes: ['UserID', 'UserName', 'ImgPath']
            }
        });

        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }

        res.json(post);
    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== UPDATE POST =====================
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        const post = await Post.findOne({ where: { PostID: req.params.id } });

        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }

        // ✅ check quyền
        if (post.UserID !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Không có quyền chỉnh sửa' });
        }

        const updateData = {};
        if (req.body.Title) updateData.Title = req.body.Title;
        if (req.body.Content) updateData.Content = req.body.Content;
        if (req.body.Status) updateData.Status = req.body.Status;

        if (req.file) {
            if (post.ImagePath) {
                const old = path.join(__dirname, '..', post.ImagePath);
                if (fs.existsSync(old)) fs.unlinkSync(old);
            }
            updateData.ImagePath = `/uploads/posts/${req.file.filename}`;
        }

        await post.update(updateData);

        res.json({
            message: 'Cập nhật bài viết thành công',
            post
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});


// ===================== DELETE POST =====================
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findOne({ where: { PostID: req.params.id } });

        if (!post) {
            return res.status(404).json({ message: 'Không tìm thấy bài viết' });
        }

        if (post.UserID !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ message: 'Không có quyền xóa' });
        }

        if (post.ImagePath) {
            const img = path.join(__dirname, '..', post.ImagePath);
            if (fs.existsSync(img)) fs.unlinkSync(img);
        }

        await post.destroy();

        res.json({ message: 'Xóa bài viết thành công' });

    } catch (err) {
        res.status(500).json({ message: 'Lỗi server' });
    }
});

module.exports = router;

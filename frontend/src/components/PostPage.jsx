import React, { useState, useEffect } from "react";
import {
  Send,
  X,
  BookOpen,
  User,
  ImagePlus,
  Home,
  Users,
  Bell,
  MessageCircle,
  Search,
  ThumbsUp,
  Share2,
  MoreHorizontal,
  Globe,
} from "lucide-react";

function PostPage() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [user, setUser] = useState(null);

  const API_URL = "https://do-an-cs2.onrender.com/post";
  const token = localStorage.getItem("accessToken");

  const styles = {
    colorBackground: "#ffffff",
    colorHeadline: "#1c1e21",
    colorParagraph: "#65676b",
    colorButton: "#1b74e4",
    colorButtonText: "#ffffff",
    colorHighlight: "#1b74e4",
    colorSecondary: "#42b72a",
    colorTertiary: "#f0f2f5",
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const getAvatarUrl = (user) => {
    if (!user) return "/placeholder.png";

    const path = user.ImgPath || user.avatar || user.img;
    if (!path) return "/placeholder.png";

    if (path.startsWith("http")) return path;
    if (path.startsWith("/")) return `https://do-an-cs2.onrender.com${path}`;
    return `https://do-an-cs2.onrender.com/uploads/avatars/${path}`;
  };
  const fetchComments = async (postId) => {
    try {
      const res = await fetch(
        `https://do-an-cs2.onrender.comcomment/${postId}`
      );
      const data = await res.json();
      setComments((prev) => ({ ...prev, [postId]: data }));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setPosts(data);

      // Fetch comments for each post
      data.forEach((post) => {
        fetchComments(post.PostID);
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file ảnh!");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File ảnh tối đa 5MB!");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSendComment = async (postId) => {
    if (!commentText[postId]) return;

    try {
      const res = await fetch("https://do-an-cs2.onrender.com/comment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          PostID: postId,
          Content: commentText[postId],
          UserID: JSON.parse(localStorage.getItem("user"))?.UserID,
        }),
      });

      if (res.ok) {
        setCommentText((prev) => ({ ...prev, [postId]: "" }));
        fetchComments(postId);
      } else {
        alert("Không thể gửi bình luận");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("Title", title);
      formData.append("Content", content);
      formData.append("Status", "PUBLISHED");
      if (image) formData.append("image", image);

      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setTitle("");
        setContent("");
        setImage(null);
        setImagePreview(null);
        setShowCreatePost(false);
        fetchPosts();
      } else {
        alert(data.message || "❌ Lỗi tạo bài viết");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Lỗi khi tạo bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: styles.colorTertiary }}
    >
      {/* Facebook-style Header */}
      <div
        className="sticky top-0 z-50 shadow-sm"
        style={{ backgroundColor: styles.colorBackground }}
      >
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left - Logo & Search */}
            <div className="flex items-center gap-2">
              <div
                className="text-2xl font-bold px-3 py-1 rounded-lg"
                style={{ color: styles.colorHighlight }}
              >
                🌱 EcoBook
              </div>
              <div
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ backgroundColor: styles.colorTertiary }}
              >
                <Search
                  className="w-4 h-4"
                  style={{ color: styles.colorParagraph }}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm"
                  className="bg-transparent outline-none text-sm w-48"
                  style={{ color: styles.colorHeadline }}
                />
              </div>
            </div>

            {/* Center - Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <button
                className="px-8 py-2 rounded-lg transition-all relative"
                style={{
                  color: styles.colorHighlight,
                  borderBottom: `3px solid ${styles.colorHighlight}`,
                }}
              >
                <Home className="w-6 h-6" />
              </button>
              <button
                className="px-8 py-2 rounded-lg hover:bg-gray-100 transition-all"
                style={{ color: styles.colorParagraph }}
              >
                <Users className="w-6 h-6" />
              </button>
            </div>

            {/* Right - Icons & Profile */}
            <div className="flex items-center gap-2">
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                style={{ backgroundColor: styles.colorTertiary }}
              >
                <Bell
                  className="w-5 h-5"
                  style={{ color: styles.colorHeadline }}
                />
              </button>
              <button
                className="p-2 rounded-full hover:bg-gray-100 transition-all"
                style={{ backgroundColor: styles.colorTertiary }}
              >
                <MessageCircle
                  className="w-5 h-5"
                  style={{ color: styles.colorHeadline }}
                />
              </button>
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: `${styles.colorHighlight}20` }}
              >
                <User
                  className="w-5 h-5"
                  style={{ color: styles.colorHighlight }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full px-4 py-4">
        <div className="grid grid-cols-12 gap-4">
          {/* Left Sidebar */}
          <div className="col-span-3 hidden lg:block">
            <div className="sticky top-16 space-y-1">
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${styles.colorHighlight}20` }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: styles.colorHighlight }}
                  />
                </div>
                <span
                  className="font-semibold"
                  style={{ color: styles.colorHeadline }}
                >
                  {JSON.parse(localStorage.getItem("user") || "{}")?.UserName ||
                    "Người dùng"}
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${styles.colorSecondary}20` }}
                >
                  <Users
                    className="w-5 h-5"
                    style={{ color: styles.colorSecondary }}
                  />
                </div>
                <span
                  className="font-semibold"
                  style={{ color: styles.colorHeadline }}
                >
                  Nhóm môi trường
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all">
                <span className="text-2xl ml-0.5">📚</span>
                <span
                  className="font-semibold"
                  style={{ color: styles.colorHeadline }}
                >
                  Đã lưu
                </span>
              </button>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-all">
                <span className="text-2xl ml-0.5">♻️</span>
                <span
                  className="font-semibold"
                  style={{ color: styles.colorHeadline }}
                >
                  Tái chế xanh
                </span>
              </button>
            </div>
          </div>

          {/* Center Feed */}
          <div className="col-span-12 lg:col-span-6 space-y-4">
            <div className="w-full space-y-4">
              {/* Create Post Card */}
              <div
                className="rounded-lg p-4 shadow"
                style={{ backgroundColor: styles.colorBackground }}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: `${styles.colorHighlight}20` }}
                  >
                    <img
                      src={getAvatarUrl(user)}
                      alt={user?.Name || user?.name || user?.UserName || "User"}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        (e.currentTarget.src = "/placeholder.png")
                      }
                      ref={(el) => {
                        if (el) {
                          console.log("User object:", user);
                          console.log("Avatar URL:", el.src);
                        }
                      }}
                    />

                    {/* Nếu muốn giữ icon làm placeholder */}
                    {!user?.ImgPath && !user?.avatar && !user?.img && (
                      <User
                        className="w-5 h-5 absolute"
                        style={{ color: styles.colorHighlight }}
                      />
                    )}
                  </div>

                  <button
                    onClick={() => setShowCreatePost(!showCreatePost)}
                    className="flex-1 text-left px-4 py-2 rounded-full hover:bg-gray-100 transition-all"
                    style={{
                      backgroundColor: styles.colorTertiary,
                      color: styles.colorParagraph,
                    }}
                  >
                    Bạn đang nghĩ gì?
                  </button>
                </div>

                {showCreatePost && (
                  <div
                    className="space-y-3 mt-4 pt-4"
                    style={{ borderTop: `1px solid ${styles.colorTertiary}` }}
                  >
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Tiêu đề bài viết"
                      className="w-full px-3 py-2 rounded-lg outline-none"
                      style={{
                        backgroundColor: styles.colorTertiary,
                        color: styles.colorHeadline,
                      }}
                    />
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Nội dung..."
                      rows="4"
                      className="w-full px-3 py-2 rounded-lg outline-none resize-none"
                      style={{
                        backgroundColor: styles.colorTertiary,
                        color: styles.colorHeadline,
                      }}
                    />

                    {imagePreview && (
                      <div className="relative rounded-lg overflow-hidden">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover"
                        />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-2 rounded-full bg-white shadow-lg hover:scale-110 transition-all"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <label className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition-all">
                        <ImagePlus
                          className="w-5 h-5"
                          style={{ color: styles.colorSecondary }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: styles.colorParagraph }}
                        >
                          Ảnh
                        </span>
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                    </div>

                    <button
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="w-full py-2 rounded-lg font-bold transition-all disabled:opacity-50"
                      style={{
                        backgroundColor: styles.colorButton,
                        color: styles.colorButtonText,
                      }}
                    >
                      {isSubmitting ? "Đang đăng..." : "Đăng bài"}
                    </button>
                  </div>
                )}

                {!showCreatePost && (
                  <div
                    className="flex items-center gap-1 pt-3"
                    style={{ borderTop: `1px solid ${styles.colorTertiary}` }}
                  >
                    <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
                      <ImagePlus
                        className="w-5 h-5"
                        style={{ color: styles.colorSecondary }}
                      />
                      <span
                        className="font-semibold text-sm"
                        style={{ color: styles.colorParagraph }}
                      >
                        Ảnh
                      </span>
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* Posts Feed */}
            {posts.length === 0 ? (
              <div
                className="text-center py-12 rounded-lg"
                style={{ backgroundColor: styles.colorBackground }}
              >
                <BookOpen
                  className="w-16 h-16 mx-auto mb-4 opacity-50"
                  style={{ color: styles.colorHighlight }}
                />
                <p style={{ color: styles.colorParagraph }}>
                  Chưa có bài viết nào
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.PostID}
                  className="rounded-lg shadow"
                  style={{ backgroundColor: styles.colorBackground }}
                >
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden"
                        style={{
                          backgroundColor: `${styles.colorHighlight}20`,
                        }}
                      >
                        {post.author?.ImgPath ? (
                          <img
                            src={`https://do-an-cs2.onrender.com${post.author.ImgPath}`}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User
                              className="w-5 h-5"
                              style={{ color: styles.colorHighlight }}
                            />
                          </div>
                        )}
                      </div>
                      <div>
                        <p
                          className="font-semibold"
                          style={{ color: styles.colorHeadline }}
                        >
                          {post.author?.UserName || "Anonymous"}
                        </p>
                        <div
                          className="flex items-center gap-1 text-xs"
                          style={{ color: styles.colorParagraph }}
                        >
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                          <span>·</span>
                          <Globe className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-full transition-all">
                      <MoreHorizontal
                        className="w-5 h-5"
                        style={{ color: styles.colorParagraph }}
                      />
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="px-4 pb-3">
                    <h3
                      className="font-bold text-lg mb-1"
                      style={{ color: styles.colorHeadline }}
                    >
                      {post.Title}
                    </h3>
                    <p style={{ color: styles.colorHeadline }}>
                      {post.Content}
                    </p>
                  </div>

                  {/* Post Image */}
                  {post.ImagePath && (
                    <div className="w-full">
                      <img
                        src={`https://do-an-cs2.onrender.com${post.ImagePath}`}
                        className="w-full max-h-96 object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="px-4 py-2">
                    <div
                      className="flex items-center justify-between py-2"
                      style={{
                        borderTop: `1px solid ${styles.colorTertiary}`,
                        borderBottom: `1px solid ${styles.colorTertiary}`,
                      }}
                    >
                      <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
                        <ThumbsUp
                          className="w-5 h-5"
                          style={{ color: styles.colorParagraph }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: styles.colorParagraph }}
                        >
                          Thích
                        </span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
                        <MessageCircle
                          className="w-5 h-5"
                          style={{ color: styles.colorParagraph }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: styles.colorParagraph }}
                        >
                          Bình luận
                        </span>
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-all">
                        <Share2
                          className="w-5 h-5"
                          style={{ color: styles.colorParagraph }}
                        />
                        <span
                          className="font-semibold"
                          style={{ color: styles.colorParagraph }}
                        >
                          Chia sẻ
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="px-4 pb-4">
                    {(comments[post.PostID] || []).map((cmt) => (
                      <div key={cmt.CommentID} className="flex gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0"
                          style={{
                            backgroundColor: `${styles.colorHighlight}20`,
                          }}
                        >
                          {cmt.user ? (
                            <img
                              src={getAvatarUrl(cmt.user)}
                              alt={cmt.user?.UserName || "User"}
                              className="w-full h-full object-cover"
                              onError={(e) =>
                                (e.currentTarget.src = "/placeholder.png")
                              }
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User
                                className="w-4 h-4"
                                style={{ color: styles.colorHighlight }}
                              />
                            </div>
                          )}
                        </div>

                        <div
                          className="flex-1 px-3 py-2 rounded-2xl"
                          style={{ backgroundColor: styles.colorTertiary }}
                        >
                          <p
                            className="font-semibold text-sm"
                            style={{ color: styles.colorHeadline }}
                          >
                            {cmt.user?.UserName || "Ẩn danh"}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: styles.colorHeadline }}
                          >
                            {cmt.Content}
                          </p>
                        </div>
                      </div>
                    ))}

                    {/* Comment Input */}

                    <div className="flex gap-2 mt-3">
                      <div
                        className="w-8 h-8 rounded-full flex-shrink-0 overflow-hidden"
                        style={{
                          backgroundColor: `${styles.colorHighlight}20`,
                        }}
                      >
                        {user ? (
                          <img
                            src={getAvatarUrl(user)}
                            alt={user?.UserName || "User"}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.currentTarget.src = "/placeholder.png")
                            }
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User
                              className="w-4 h-4"
                              style={{ color: styles.colorHighlight }}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 flex gap-2">
                        <input
                          type="text"
                          placeholder="Viết bình luận..."
                          value={commentText[post.PostID] || ""}
                          onChange={(e) =>
                            setCommentText((prev) => ({
                              ...prev,
                              [post.PostID]: e.target.value,
                            }))
                          }
                          className="flex-1 px-4 py-2 rounded-full outline-none"
                          style={{
                            backgroundColor: styles.colorTertiary,
                            color: styles.colorHeadline,
                          }}
                          onKeyPress={(e) =>
                            e.key === "Enter" && handleSendComment(post.PostID)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Right Sidebar */}
          <div className="col-span-3 hidden lg:block">
            <div className="sticky top-16">
              {/* <div
                className="rounded-lg p-3"
                style={{ backgroundColor: styles.colorBackground }}
              >
                <h3
                  className="font-semibold mb-3 px-2"
                  style={{ color: styles.colorParagraph }}
                >
                  Được tài trợ
                </h3>
                <div className="space-y-3">
                  <div className="flex gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all">
                    <div
                      className="w-20 h-20 rounded-lg"
                      style={{ backgroundColor: `${styles.colorSecondary}20` }}
                    >
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🌳
                      </div>
                    </div>
                    <div className="flex-1">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: styles.colorHeadline }}
                      >
                        Trồng cây xanh
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: styles.colorParagraph }}
                      >
                        earth.org
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

              <div
                className="rounded-lg p-3 mt-4"
                style={{ backgroundColor: styles.colorBackground }}
              >
                <h3
                  className="font-semibold mb-3 px-2"
                  style={{ color: styles.colorParagraph }}
                >
                  Người liên hệ
                </h3>
                <div className="space-y-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-all"
                    >
                      <div className="relative">
                        <div
                          className="w-9 h-9 rounded-full"
                          style={{
                            backgroundColor: `${styles.colorHighlight}20`,
                          }}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <User
                              className="w-4 h-4"
                              style={{ color: styles.colorHighlight }}
                            />
                          </div>
                        </div>
                        <div
                          className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white"
                          style={{ backgroundColor: styles.colorSecondary }}
                        ></div>
                      </div>
                      <span
                        className="font-semibold text-sm"
                        style={{ color: styles.colorHeadline }}
                      >
                        Người dùng {i}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostPage;

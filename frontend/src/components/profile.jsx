import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  Camera,
  Save,
  X,
  ShoppingBag,
  Star,
  Package,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false); // Thêm state cho chỉnh sửa mật khẩu
  const [loading, setLoading] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false); // Loading riêng cho đổi mật khẩu
  const [message, setMessage] = useState({ type: "", text: "" });
  const [passwordMessage, setPasswordMessage] = useState({
    type: "",
    text: "",
  }); // Message riêng cho mật khẩu

  const [formData, setFormData] = useState({
    UserName: "",
    Email: "",
    ImgPath: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          "https://do-an-cs2.onrender.com/user/profile",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          navigate("/login");
          return;
        }

        const data = await response.json();
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);

        setFormData({
          UserName: data.user.UserName || "",
          Email: data.user.Email || "",
          ImgPath: data.user.ImgPath || "",
        });
      } catch (error) {
        console.error("Profile load error:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: "error", text: "Ảnh phải nhỏ hơn 5MB" });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("UserName", formData.UserName);
      formDataToSend.append("Email", formData.Email);

      if (selectedFile) {
        formDataToSend.append("avatar", selectedFile);
      }

      const response = await fetch(
        "https://do-an-cs2.onrender.com/user/profile",
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSend,
        }
      );

      const data = await response.json();

      if (response.ok) {
        const updatedUser = { ...user, ...data.user };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setMessage({ type: "success", text: "Cập nhật thông tin thành công!" });
        setIsEditing(false);
        setSelectedFile(null);
        setPreviewImage(null);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Cập nhật thất bại",
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      setMessage({ type: "error", text: "Đã xảy ra lỗi. Vui lòng thử lại." });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage({ type: "", text: "" });

    // Validate mật khẩu
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: "error", text: "Mật khẩu mới không khớp!" });
      setLoadingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự!",
      });
      setLoadingPassword(false);
      return;
    }

    try {
      const response = await fetch(
        "https://do-an-cs2.onrender.com/user/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({
          type: "success",
          text: "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.",
        });

        // Reset form
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });

        // Tự động logout sau 3 giây
        setTimeout(() => {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("user");
          navigate("/login");
        }, 3000);

        setIsEditingPassword(false);
      } else {
        setPasswordMessage({
          type: "error",
          text: data.message || "Đổi mật khẩu thất bại",
        });
      }
    } catch (error) {
      console.error("Change password error:", error);
      setPasswordMessage({
        type: "error",
        text: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    } finally {
      setLoadingPassword(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      UserName: user.UserName || "",
      Email: user.Email || "",
      ImgPath: user.ImgPath || "",
    });
    setPreviewImage(null);
    setSelectedFile(null);
    setMessage({ type: "", text: "" });
  };

  const handleCancelPassword = () => {
    setIsEditingPassword(false);
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setPasswordMessage({ type: "", text: "" });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const currentAvatar = previewImage
    ? previewImage
    : user.ImgPath
    ? `https://do-an-cs2.onrender.com${user.ImgPath}`
    : null;

  return (
    <div
      className="min-h-screen py-20 px-4"
      style={{ background: "var(--color-background)" }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1
            className="text-4xl font-bold mb-2"
            style={{ color: "var(--color-headline)" }}
          >
            Hồ Sơ Của Tôi
          </h1>
          <p style={{ color: "var(--color-paragraph)" }}>
            Quản lý thông tin cá nhân và bảo mật tài khoản
          </p>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-50 text-green-800"
                : "bg-red-50 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {/* Avatar Section */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="relative mx-auto w-48 h-48 mb-4">
                {currentAvatar ? (
                  <img
                    src={currentAvatar}
                    alt={user.UserName}
                    className="w-full h-full rounded-full object-cover ring-4 ring-blue-100"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-full flex items-center justify-center text-white text-6xl font-bold ring-4 ring-blue-100"
                    style={{
                      background: "var(--color-illustration-highlight)",
                    }}
                  >
                    {user.UserName?.charAt(0).toUpperCase()}
                  </div>
                )}

                {isEditing && (
                  <label
                    htmlFor="avatar-upload"
                    className="absolute bottom-2 right-2 w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg"
                  >
                    <Camera size={20} />
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="text-center">
                <h2
                  className="text-xl font-bold mb-1"
                  style={{ color: "var(--color-headline)" }}
                >
                  {user.UserName}
                </h2>
                <span
                  className="inline-block px-3 py-1 rounded-full text-sm font-medium"
                  style={{
                    background:
                      user.Role === "SELLER"
                        ? "var(--color-illustration-secondary)"
                        : "var(--color-illustration-highlight)",
                    color: "white",
                  }}
                >
                  {user.Role === "SELLER" ? "Người Bán" : "Khách Hàng"}
                </span>
              </div>

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      <ShoppingBag size={16} />
                      Đơn hàng
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-headline)" }}
                    >
                      0
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      className="flex items-center gap-2 text-sm"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      <Star size={16} />
                      Đánh giá
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: "var(--color-headline)" }}
                    >
                      0
                    </span>
                  </div>
                  {user.Role === "SELLER" && (
                    <div className="flex items-center justify-between">
                      <span
                        className="flex items-center gap-2 text-sm"
                        style={{ color: "var(--color-paragraph)" }}
                      >
                        <Package size={16} />
                        Sản phẩm
                      </span>
                      <span
                        className="font-semibold"
                        style={{ color: "var(--color-headline)" }}
                      >
                        0
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Change Password Button */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setIsEditingPassword(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-300 hover:shadow-md"
                  style={{
                    background: "var(--color-button)",
                    color: "var(--color-button-text)",
                  }}
                >
                  <Lock size={18} />
                  Đổi Mật Khẩu
                </button>
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="md:col-span-2 space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="text-2xl font-bold"
                  style={{ color: "var(--color-headline)" }}
                >
                  Thông Tin Cá Nhân
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300"
                    style={{
                      background: "var(--color-button)",
                      color: "var(--color-button-text)",
                    }}
                  >
                    Chỉnh Sửa
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* User ID (Read-only) */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-paragraph)" }}
                  >
                    Mã Người Dùng
                  </label>
                  <div
                    className="px-4 py-3 bg-gray-50 rounded-lg font-mono text-sm"
                    style={{ color: "var(--color-headline)" }}
                  >
                    {user.UserID}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-paragraph)" }}
                  >
                    <User size={16} className="inline mr-2" />
                    Tên Người Dùng
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      name="UserName"
                      value={formData.UserName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  ) : (
                    <div
                      className="px-4 py-3 bg-gray-50 rounded-lg"
                      style={{ color: "var(--color-headline)" }}
                    >
                      {user.UserName}
                    </div>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-paragraph)" }}
                  >
                    <Mail size={16} className="inline mr-2" />
                    Email
                  </label>
                  {isEditing ? (
                    <input
                      type="email"
                      name="Email"
                      value={formData.Email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                      required
                    />
                  ) : (
                    <div
                      className="px-4 py-3 bg-gray-50 rounded-lg"
                      style={{ color: "var(--color-headline)" }}
                    >
                      {user.Email}
                    </div>
                  )}
                </div>

                {/* Role (Read-only) */}
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "var(--color-paragraph)" }}
                  >
                    Vai Trò
                  </label>
                  <div
                    className="px-4 py-3 bg-gray-50 rounded-lg"
                    style={{ color: "var(--color-headline)" }}
                  >
                    {user.Role === "SELLER" ? "Người Bán Hàng" : "Khách Hàng"}
                  </div>
                </div>

                {/* Action Buttons */}
                {isEditing && (
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{
                        background: "var(--color-button)",
                        color: "var(--color-button-text)",
                      }}
                    >
                      <Save size={18} />
                      {loading ? "Đang lưu..." : "Lưu Thay Đổi"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-6 py-3 rounded-lg font-medium border-2 transition-all duration-300"
                      style={{
                        borderColor: "var(--color-button)",
                        color: "var(--color-headline)",
                      }}
                    >
                      <X size={18} className="inline mr-2" />
                      Hủy
                    </button>
                  </div>
                )}
              </form>
            </div>

            {/* Change Password Section */}
            {isEditingPassword && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3
                    className="text-2xl font-bold flex items-center gap-2"
                    style={{ color: "var(--color-headline)" }}
                  >
                    <Lock size={24} />
                    Đổi Mật Khẩu
                  </h3>
                  <button
                    onClick={handleCancelPassword}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={24} />
                  </button>
                </div>

                {/* Password Message Alert */}
                {passwordMessage.text && (
                  <div
                    className={`mb-6 p-4 rounded-lg ${
                      passwordMessage.type === "success"
                        ? "bg-green-50 text-green-800"
                        : "bg-red-50 text-red-800"
                    }`}
                  >
                    {passwordMessage.text}
                    {passwordMessage.type === "success" && (
                      <div className="text-sm mt-1">
                        Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
                      </div>
                    )}
                  </div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                  {/* Current Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.current ? "text" : "password"}
                        name="currentPassword"
                        value={passwordData.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                        required
                        placeholder="Nhập mật khẩu hiện tại"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("current")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.current ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.new ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                        required
                        placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("new")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.new ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Mật khẩu phải có ít nhất 6 ký tự
                    </p>
                  </div>

                  {/* Confirm New Password */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword.confirm ? "text" : "password"}
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full px-4 py-3 pr-10 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
                        required
                        placeholder="Nhập lại mật khẩu mới"
                        minLength="6"
                      />
                      <button
                        type="button"
                        onClick={() => togglePasswordVisibility("confirm")}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword.confirm ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">
                        Độ mạnh mật khẩu:
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          passwordData.newPassword.length === 0
                            ? "text-gray-400"
                            : passwordData.newPassword.length < 6
                            ? "text-red-500"
                            : passwordData.newPassword.length < 8
                            ? "text-yellow-500"
                            : "text-green-500"
                        }`}
                      >
                        {passwordData.newPassword.length === 0
                          ? "Chưa có"
                          : passwordData.newPassword.length < 6
                          ? "Yếu"
                          : passwordData.newPassword.length < 8
                          ? "Trung bình"
                          : "Mạnh"}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${
                          passwordData.newPassword.length === 0
                            ? "w-0"
                            : passwordData.newPassword.length < 6
                            ? "w-1/3 bg-red-500"
                            : passwordData.newPassword.length < 8
                            ? "w-2/3 bg-yellow-500"
                            : "w-full bg-green-500"
                        }`}
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={loadingPassword}
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 disabled:opacity-50"
                      style={{
                        background: "var(--color-button)",
                        color: "var(--color-button-text)",
                      }}
                    >
                      <Lock size={18} />
                      {loadingPassword ? "Đang xử lý..." : "Đổi Mật Khẩu"}
                    </button>
                    <button
                      type="button"
                      onClick={handleCancelPassword}
                      className="px-6 py-3 rounded-lg font-medium border-2 transition-all duration-300"
                      style={{
                        borderColor: "var(--color-button)",
                        color: "var(--color-headline)",
                      }}
                    >
                      Hủy
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

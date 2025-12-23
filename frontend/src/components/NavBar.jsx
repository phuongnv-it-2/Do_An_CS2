import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const API_URL = "https://do-an-cs2.onrender.com";
  // Lấy thông tin user từ localStorage hoặc context/redux
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy user data từ localStorage khi component mount
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    let scrollTimeout;

    const controlNavbar = () => {
      clearTimeout(scrollTimeout);
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
        setShowDropdown(false);
      } else if (currentScrollY < lastScrollY) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);

      scrollTimeout = setTimeout(() => {
        if (window.scrollY > 100) {
          setIsVisible(false);
        }
      }, 2000);
    };

    window.addEventListener("scroll", controlNavbar);
    return () => {
      window.removeEventListener("scroll", controlNavbar);
      clearTimeout(scrollTimeout);
    };
  }, [lastScrollY]);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      // Gọi API logout để xóa refreshToken cookie trên server
      const response = await fetch(
        "https://do-an-cs2.onrender.com/user/logout",
        {
          method: "POST",
          credentials: "include", // Quan trọng: gửi cookie cùng request
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.ok) {
        // Xóa token và user info từ localStorage
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setUser(null);
        setShowDropdown(false);
        navigate("/login");
      } else {
        console.error("Logout failed");
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        setUser(null);
        setShowDropdown(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa dữ liệu local nếu có lỗi
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
      setShowDropdown(false);
      navigate("/login");
    }
  };
  const navLinks = [
    { id: "home", label: "Shop", path: "/customer" },
    { id: "explore", label: "Explore", path: "/explore" },
    { id: "CustomerOrders", label: "CustomerOrders", path: "/customerorders" },
    { id: "post", label: "PostPage", path: "/postpage" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="px-6 py-4 backdrop-blur-md bg-white/10 shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 group cursor-pointer">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transform transition-all duration-300 group-hover:rotate-12 group-hover:scale-110"
                style={{ background: "var(--color-illustration-highlight)" }}
              >
                <ShoppingBag
                  size={22}
                  style={{ color: "var(--color-headline)" }}
                  strokeWidth={2.5}
                />
              </div>
              <span
                className="text-2xl font-bold tracking-tight"
                style={{ color: "var(--color-headline)" }}
              >
                MyShop
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.id}
                  to={link.path}
                  className="relative text-base font-medium transition-all duration-300 group"
                  style={{
                    color:
                      location.pathname === link.path
                        ? "var(--color-headline)"
                        : "var(--color-paragraph)",
                  }}
                >
                  {link.label}
                  <span
                    className="absolute -bottom-1 left-0 h-0.5 transition-all duration-300"
                    style={{
                      width: location.pathname === link.path ? "100%" : "0%",
                      background: "var(--color-illustration-highlight)",
                    }}
                  />
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                    style={{
                      background: "var(--color-illustration-highlight)",
                    }}
                  />
                </Link>
              ))}
            </div>

            {/* Right Side - Avatar hoặc Login/Register */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                // Avatar với Dropdown
                <div div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[var(--color-illustration-highlight)] transition-all duration-300 cursor-pointer">
                      {user.ImgPath || user.avatar || user.img ? (
                        <img
                          src={
                            // Kiểm tra user.ImgPath trước (có thể là field trong database)
                            user.ImgPath
                              ? user.ImgPath.startsWith("http")
                                ? user.ImgPath
                                : user.ImgPath.startsWith("/")
                                ? `https://do-an-cs2.onrender.com${user.ImgPath}`
                                : `https://do-an-cs2.onrender.com/uploads/avatars/${user.ImgPath}`
                              : // Kiểm tra user.avatar (có thể từ response khác)
                              user.avatar
                              ? user.avatar.startsWith("http")
                                ? user.avatar
                                : `https://do-an-cs2.onrender.com${user.avatar}`
                              : // Kiểm tra user.img (thường từ login response)
                              user.img
                              ? user.img.startsWith("http")
                                ? user.img
                                : `https://do-an-cs2.onrender.com${user.img}`
                              : "/placeholder.png"
                          }
                          alt={
                            user.Name || user.name || user.UserName || "User"
                          }
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Khi ảnh không tải được, ẩn img và hiện placeholder
                            e.target.style.display = "none";
                            const placeholder =
                              e.target.parentElement.querySelector(
                                ".avatar-placeholder"
                              );
                            if (placeholder) placeholder.style.display = "flex";
                          }}
                        />
                      ) : null}

                      {/* Placeholder luôn tồn tại trong DOM nhưng ẩn khi có ảnh */}
                      <div
                        className="w-full h-full flex items-center justify-center text-white font-semibold text-lg avatar-placeholder"
                        style={{
                          background: "var(--color-illustration-highlight)",
                          display:
                            user.ImgPath || user.avatar || user.img
                              ? "none"
                              : "flex",
                        }}
                      >
                        {(
                          user.Name ||
                          user.name ||
                          user.UserName ||
                          user.email?.charAt(0).toUpperCase() ||
                          "U"
                        )
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    </div>
                    {/* Indicator online */}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white"></div>
                  </button>

                  {/* Dropdown Menu */}
                  {showDropdown && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl shadow-lg overflow-hidden backdrop-blur-md bg-white/95 border border-gray-200">
                      {/* User Info Section */}
                      <div className="px-4 py-3 border-b border-gray-200">
                        <p
                          className="text-sm font-semibold truncate"
                          style={{ color: "var(--color-headline)" }}
                        >
                          {user.Name || user.name || "User Name"}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--color-paragraph)" }}
                        >
                          {user.Email || user.email || "user@example.com"}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-100 transition-colors"
                          style={{ color: "var(--color-paragraph)" }}
                          onClick={() => setShowDropdown(false)}
                        >
                          <User size={18} />
                          <span>Hồ sơ của tôi</span>
                        </Link>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut size={18} />
                          <span>Đăng xuất</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Login/Register buttons khi chưa đăng nhập
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:opacity-90"
                    style={{
                      background: "var(--color-button)",
                      color: "var(--color-button-text)",
                    }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-lg font-medium border-2 transition-all duration-300 hover:bg-opacity-10"
                    style={{
                      borderColor: "var(--color-button)",
                      color: "var(--color-headline)",
                    }}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg transition-all duration-300"
              style={{ color: "var(--color-headline)" }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Line */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, var(--color-illustration-highlight) 0%, var(--color-illustration-secondary) 50%, var(--color-illustration-tertiary) 100%)`,
        }}
      />

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96" : "max-h-0"
        } backdrop-blur-md bg-white/10`}
      >
        <div className="px-6 py-4 space-y-3">
          {navLinks.map((link) => (
            <Link
              key={link.id}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block py-2 px-4 rounded-lg font-medium transition-all duration-300"
              style={{
                background:
                  location.pathname === link.path
                    ? "var(--color-illustration-highlight)"
                    : "transparent",
                color:
                  location.pathname === link.path
                    ? "var(--color-button-text)"
                    : "var(--color-paragraph)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <div className="pt-4 space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-300"
                  style={{
                    background: "var(--color-button)",
                    color: "var(--color-button-text)",
                  }}
                >
                  <User size={18} />
                  <span>Hồ sơ</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium border-2 transition-all duration-300 text-red-600 border-red-600"
                >
                  <LogOut size={18} />
                  <span>Đăng xuất</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-center py-2 px-4 rounded-lg font-medium transition-all duration-300"
                  style={{
                    background: "var(--color-button)",
                    color: "var(--color-button-text)",
                  }}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-center py-2 px-4 rounded-lg font-medium border-2 transition-all duration-300"
                  style={{
                    borderColor: "var(--color-button)",
                    color: "var(--color-headline)",
                  }}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ShoppingBag, User, LogOut, Search } from "lucide-react";

function NavBar_Seller() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const API_URL = "http://localhost:3000";

  // Lấy thông tin user từ localStorage
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const getAvatarUrl = (user) => {
    const img = user?.ImgPath || user?.avatar || user?.img;
    if (!img) return "/placeholder.png";
    if (img.startsWith("http")) return img;
    if (img.startsWith("/")) return `${API_URL}${img}`;
    return `${API_URL}/uploads/avatars/${img}`;
  };

  const fetchUserProfile = async () => {
    try {
      const token =
        localStorage.getItem("accessToken") ||
        sessionStorage.getItem("accessToken");
      if (!token) {
        console.log("No token found");
        setIsLoading(false);
        return;
      }

      const response = await fetch("http://localhost:3000/user/profile", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API Response:", data);

        const userData = data.user || data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData)); // Lưu user object trực tiếp
        console.log("User data extracted:", userData);
      } else {
        console.error("Failed to fetch user profile:", response.status);
        localStorage.removeItem("accessToken");
        sessionStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const token =
      localStorage.getItem("accessToken") ||
      sessionStorage.getItem("accessToken");

    console.log("Saved User raw:", savedUser);

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        console.log("Parsed user:", parsedUser);

        if (parsedUser.user) {
          setUser(parsedUser.user); // Lấy user từ trong object
          console.log("Loaded nested user:", parsedUser.user);
        } else {
          setUser(parsedUser); // User object trực tiếp
          console.log("Loaded direct user:", parsedUser);
        }

        fetchUserProfile();
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
        // Nếu có token, vẫn thử fetch từ API
        if (token) {
          fetchUserProfile();
        } else {
          setIsLoading(false);
        }
      }
    } else if (token) {
      // Nếu có token nhưng không có user, fetch từ API
      fetchUserProfile();
    } else {
      setIsLoading(false);
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
      const response = await fetch("http://localhost:3000/user/logout", {
        method: "POST",
        credentials: "include", // Quan trọng: gửi cookie cùng request
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (response.ok) {
        console.log("Logout successful");
      }

      // Xóa token và user info từ localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      setUser(null);
      setShowDropdown(false);
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Vẫn xóa dữ liệu local nếu có lỗi
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      sessionStorage.removeItem("accessToken");
      setUser(null);
      setShowDropdown(false);
      navigate("/login");
    }
  };

  const navLinks = [
    { id: "home", label: "Shop", path: "/seller" },
    { id: "explore", label: "Explore", path: "/explore_seller" },
    { id: "about", label: "Manager", path: "/productsmanager" },
    { id: "contact", label: "Create", path: "/createproducts" },
    { id: "order", label: "Orders", path: "/sellerorders" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-transform duration-500 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Main Navbar */}
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
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="relative group focus:outline-none"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent group-hover:ring-[var(--color-illustration-highlight)] transition-all duration-300 cursor-pointer">
                      {user.ImgPath || user.avatar || user.img ? (
                        <img
                          src={getAvatarUrl(user)}
                          alt={
                            user.Name || user.name || user.UserName || "Seller"
                          }
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = "/placeholder.png";
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
                          "S"
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
                          {user.Name || user.name || "Seller Name"}
                        </p>
                        <p
                          className="text-xs truncate"
                          style={{ color: "var(--color-paragraph)" }}
                        >
                          {user.Email || user.email || "seller@example.com"}
                        </p>
                        <p className="text-xs text-green-600 font-medium mt-1">
                          ⭐ Seller Account
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
                          <span>Seller Profile</span>
                        </Link>

                        <div className="border-t border-gray-200 my-1"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-red-50 transition-colors text-red-600"
                        >
                          <LogOut size={18} />
                          <span>Logout</span>
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
          background: `linear-gradient(90deg, 
            var(--color-illustration-highlight) 0%, 
            var(--color-illustration-secondary) 50%, 
            var(--color-illustration-tertiary) 100%)`,
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
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200/50">
                  <div className="w-8 h-8 rounded-full overflow-hidden">
                    {user.ImgPath || user.avatar || user.img ? (
                      <img
                        src={
                          user.ImgPath
                            ? user.ImgPath.startsWith("http")
                              ? user.ImgPath
                              : `${API_URL}${user.ImgPath}`
                            : user.avatar
                            ? user.avatar.startsWith("http")
                              ? user.avatar
                              : `${API_URL}${user.avatar}`
                            : `${API_URL}${user.img}`
                        }
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center text-white text-sm font-semibold"
                        style={{
                          background: "var(--color-illustration-highlight)",
                        }}
                      >
                        {(user.Name || user.name || "S")
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "var(--color-headline)" }}
                    >
                      {user.Name || user.name || "Seller"}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-paragraph)" }}
                    >
                      Seller Account
                    </p>
                  </div>
                </div>

                <Link
                  to="/seller/profile"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2 py-2 px-4 rounded-lg font-medium transition-all duration-300"
                  style={{
                    color: "var(--color-paragraph)",
                    background: "rgba(0,0,0,0.05)",
                  }}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium border-2 transition-all duration-300 text-red-600 border-red-600"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
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
                    background: "transparent",
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

export default NavBar_Seller;

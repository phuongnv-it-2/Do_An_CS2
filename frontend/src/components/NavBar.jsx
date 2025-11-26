import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ShoppingBag, User, Search } from "lucide-react";

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  useEffect(() => {
    let scrollTimeout;

    const controlNavbar = () => {
      clearTimeout(scrollTimeout);

      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false);
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

  const navLinks = [
    { id: "home", label: "Shop", path: "/productlists" },
    { id: "explore", label: "Explore", path: "/explore" },
    { id: "about", label: "About", path: "/about" },
    { id: "contact", label: "Contact", path: "/contact" },
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

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center gap-4">
              {/* Search Button */}
              <button
                className="p-2 rounded-lg transition-all duration-300 hover:scale-110"
                style={{
                  color: "var(--color-paragraph)",
                  background: "transparent",
                }}
              >
                <Search size={20} />
              </button>

              {/* Login Button */}
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg font-medium transition-all duration-300 hover:shadow-lg hover:scale-105 flex items-center gap-2"
                style={{
                  background: "var(--color-button)",
                  color: "var(--color-button-text)",
                }}
              >
                <User size={18} />
                Login
              </Link>

              {/* Register Button */}
              <Link
                to="/register"
                className="px-4 py-2 rounded-lg font-medium border-2 transition-all duration-300 hover:shadow-lg hover:scale-105"
                style={{
                  borderColor: "var(--color-button)",
                  color: "var(--color-headline)",
                  background: "transparent",
                }}
              >
                Register
              </Link>
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
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

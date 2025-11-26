import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EarthImg from "../assets/earth.png";
import NavBar from "./NavBar.jsx";
import hero_shape from "../assets/hero-shape.svg";
import shopimg from "../assets/shopimg.png";
import Person from "../assets/Person.png";
import bottle from "../assets/bottle.png";
import recycling from "../assets/recycling.png";
import AboutUs from "./AboutUs.jsx";
import Example from "./Example.jsx";

function First() {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 20 + 15,
      delay: Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);
  return (
    <div className="container-first min-h-screen w-screen">
      <section className="section h-screen flex items-center justify-center relative overflow-hidden">
        {/*  Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a5f4f] via-[#00214d] to-[#0a3d5c] z-0">
          {/* Overlay gradient animation */}
          <div className="absolute inset-0 opacity-40">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00ebc7]/30 via-transparent to-[#fde24f]/20 animate-gradient"></div>
          </div>
        </div>
        {/* Animated Particles */}
        <div className="absolute inset-0 z-0">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute rounded-full bg-[#00ebc7]/80"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${particle.duration}s infinite ease-in-out ${particle.delay}s`,
              }}
            />
          ))}
        </div>
        {/* Geometric Shapes Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#00ebc7]/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#fde24f]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-[#ff5470]/10 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        {/* Grid Pattern Overlay */}
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage: `
            linear-gradient(rgba(0, 235, 199, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 235, 199, 0.3) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
            animation: "moveGrid 20s linear infinite",
          }}
        ></div>
        {/* Wave Effect at Top */}
        <div className="absolute top-0 left-0 right-0 z-0">
          <svg
            className="w-full h-32"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C150,100 350,0 600,50 C850,100 1050,0 1200,50 L1200,0 L0,0 Z"
              fill="rgba(0, 235, 199, 0.1)"
              className="animate-wave"
            />
          </svg>
        </div>
        {/* Nội dung chính */}
        <h1 className="absolute top-20 text-4xl md:text-5xl lg:text-6xl font-bold z-10 text-white drop-shadow-2xl px-4 text-center">
          Dự án môi trường xanh
        </h1>
        {/* Globe with enhanced styling */}
        <div className="relative z-10 mb-32">
          <div className="absolute inset-0 bg-[#00ebc7]/20 rounded-full blur-3xl animate-pulse"></div>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Globe.svg/900px-Globe.svg.png"
            alt="Earth Globe"
            className="relative w-80 h-80 md:w-96 md:h-96 object-contain drop-shadow-2xl"
            style={{
              animation: "spin 30s linear infinite",
              filter: "drop-shadow(0 0 30px rgba(0, 235, 199, 0.5))",
            }}
          />
        </div>
        <div
          className="absolute bottom-0 w-full h-48 md:h-64 z-10"
          style={{
            backgroundColor: "#00ebc7",
            borderTopLeftRadius: "50% 100px",
            borderTopRightRadius: "50% 100px",
            boxShadow: "0 -10px 50px rgba(0, 235, 199, 0.3)",
          }}
        >
          {/* Decorative elements on curve */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-white/50 animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-white/50 animate-bounce delay-100"></div>
              <div className="w-3 h-3 rounded-full bg-white/50 animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </section>

      <section
        className=" section relative h-screen px-16 flex items-center"
        style={{ backgroundColor: "#00ebc7" }}
      >
        <div className="flex justify-between w-full relative z-10">
          <div className="md:w-1/2 space-y-6">
            <h1
              className="text-4xl md:text-5xl font-bold"
              style={{ color: "var(--color-headline)" }}
            >
              Marketplace Sản Phẩm Tái Chế – Chung Tay Bảo Vệ Môi Trường
            </h1>
            <p style={{ color: "var(--color-paragraph)" }}>
              Nền tảng mua bán các sản phẩm được tạo từ rác tái chế, kết nối
              người sáng tạo xanh với cộng đồng tiêu dùng bền vững. Tại đây, mỗi
              món đồ đều góp phần giảm lượng chất thải ra môi trường, khuyến
              khích tái sử dụng và lan tỏa lối sống thân thiện với thiên nhiên.
              Cùng nhau xây dựng một hệ sinh thái xanh, nơi sản phẩm tái chế
              không chỉ có giá trị sử dụng mà còn mang ý nghĩa bảo vệ Trái Đất.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/productlists">
                <button
                  className="px-8 py-3.5 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                  style={{
                    backgroundColor: "var(--color-button)",
                    color: "var(--color-button-text)",
                  }}
                >
                  Khám phá ngay
                </button>
              </Link>
              <button
                className="px-8 py-3.5 rounded-lg font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: "var(--color-button)",
                  color: "var(--color-button-text)",
                }}
              >
                Đăng tải sản phẩm
              </button>
            </div>
          </div>
          <div className="img-area w-1/2 relative">
            <img src={shopimg} alt="Example" className="w-7/8 h-15/16" />

            <div className="img">
              {/* h2-move-1 */}
              <img
                src={bottle}
                alt="Example"
                className="absolute w-1/5 h-1/4 left-[5%] top-[10%] animate-bounce3s"
              />

              {/* h2-move-2 */}
              <img
                src={Person}
                alt="Example"
                className="absolute w-1/5 h-1/4 left-[30%] top-[60%] animate-bounce4s"
              />

              {/* h2-move-3 */}
              <img
                src={recycling}
                alt="Example"
                className="absolute w-1/5 h-1/4  left-[68%] top-[26%] z-10 spin-and-bounce"
              />
            </div>
          </div>
        </div>

        {/* Ảnh dưới */}
        <img
          src={hero_shape}
          alt=""
          className="absolute bottom-0 left-0 w-full h-auto pointer-events-none"
        />
      </section>

      <section
        className="section relative overflow-hidden h-screen flex flex-col md:flex-row items-center justify-between px-8 md:px-20"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="md:w-1/2 space-y-6">
          <h1
            className="text-4xl md:text-5xl font-bold"
            style={{ color: "var(--color-headline)" }}
          >
            Marketplace Sản Phẩm Tái Chế – Chung Tay Bảo Vệ Môi Trường
          </h1>
          <p style={{ color: "var(--color-paragraph)" }}>
            Nền tảng mua bán các sản phẩm được tạo từ rác tái chế, kết nối người
            sáng tạo xanh với cộng đồng tiêu dùng bền vững. Tại đây, mỗi món đồ
            đều góp phần giảm lượng chất thải ra môi trường, khuyến khích tái sử
            dụng và lan tỏa lối sống thân thiện với thiên nhiên. Cùng nhau xây
            dựng một hệ sinh thái xanh, nơi sản phẩm tái chế không chỉ có giá
            trị sử dụng mà còn mang ý nghĩa bảo vệ Trái Đất.
          </p>
          <div className="flex space-x-4">
            <button
              className="px-6 py-3 rounded-lg transition hover:opacity-90"
              style={{
                backgroundColor: "var(--color-button)",
                color: "var(--color-button-text)",
              }}
            >
              Khám phá ngay
            </button>
            <button
              className="px-6 py-3 rounded-lg border transition hover:bg-[var(--color-button)] hover:text-[var(--color-background)]"
              style={{
                borderColor: "var(--color-button-text)",
                color: "var(--color-button-text)",
              }}
            >
              Đăng tải sản phẩm
            </button>
          </div>
        </div>

        <div className="md:w-1/2 flex justify-center md:justify-end mt-10 md:mt-0">
          <img
            src={EarthImg}
            alt="Example"
            className="w-3/4 h-3/4 object-contain animate-spin-slow"
            style={{
              borderColor: "var(--color-illustration-stroke)",
            }}
          />
        </div>
      </section>

      <div className="section relative">
        <AboutUs />
      </div>
      <section className="section relative">
        <Example />
      </section>
    </div>
  );
}

export default First;

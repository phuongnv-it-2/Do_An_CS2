import React, { useState, useEffect } from "react";
import { Users, Target, Award, Heart, TrendingUp, Zap } from "lucide-react";

export default function AboutUs() {
  function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const stats = [
    { number: "10K+", label: "Khách Hàng", icon: Users },
    { number: "50+", label: "Dự Án", icon: Target },
    { number: "15+", label: "Giải Thưởng", icon: Award },
    { number: "99%", label: "Hài Lòng", icon: Heart },
  ];

  const team = [
    {
      name: "Nguyễn Văn A",
      role: "CEO & Founder",
      img: "https://i.pravatar.cc/300?img=12",
    },
    {
      name: "Trần Thị B",
      role: "CTO",
      img: "https://i.pravatar.cc/300?img=47",
    },
    {
      name: "Lê Văn C",
      role: "Creative Director",
      img: "https://i.pravatar.cc/300?img=33",
    },
  ];

  const values = [
    {
      icon: TrendingUp,
      title: "Đổi Mới Liên Tục",
      desc: "Chúng tôi luôn tiên phong trong việc áp dụng công nghệ mới nhất để mang đến giải pháp tốt nhất",
      color: "#00ebc7",
    },
    {
      icon: Zap,
      title: "Hiệu Quả Tối Đa",
      desc: "Tối ưu hóa mọi quy trình để mang lại giá trị cao nhất cho khách hàng",
      color: "#fde24f",
    },
    {
      icon: Heart,
      title: "Tận Tâm Phục Vụ",
      desc: "Khách hàng là trung tâm của mọi hoạt động và quyết định của chúng tôi",
      color: "#ff5470",
    },
  ];

  return (
    // <div className="bg-[#fffffe] text-[#1b2d45] overflow-hidden">
    <>
      {/* Hero Section */}
      <section className="section relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#00ebc7] to-[#fde24f]">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                background:
                  i % 3 === 0 ? "#00ebc7" : i % 3 === 1 ? "#fde24f" : "#ff5470",
                width: Math.random() * 80 + 40 + "px",
                height: Math.random() * 80 + 40 + "px",
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
                opacity: 0.1,
                animation: `float ${
                  Math.random() * 15 + 10
                }s infinite ease-in-out`,
                animationDelay: Math.random() * 5 + "s",
              }}
            ></div>
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 text-[#00214d] drop-shadow-lg">
            Về Chúng Tôi
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-[#00214d] leading-relaxed font-medium">
            Chúng tôi là đội ngũ đam mê công nghệ, cam kết mang đến những giải
            pháp sáng tạo và hiệu quả nhất cho khách hàng
          </p>
          <button
            className="bg-[#00ebc7] hover:bg-[#00d4b3] text-[#00214d] px-8 py-4 rounded-full text-lg font-bold transform hover:scale-105 transition-all duration-300 shadow-2xl border-2 border-[#00214d]"
            onClick={() => scrollToSection("TeamId")}
          >
            Khám Phá Ngay
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-4xl text-[#00214d] font-bold">↓</div>
        </div>
      </section>

      {/* Team Section */}
      <section id="TeamId" className="section py-20 px-4 bg-[#fffffe]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#00214d]">
            Đội Ngũ Của Chúng Tôi
          </h2>
          <div className="w-24 h-1 bg-[#ff5470] mx-auto mb-16"></div>

          {/* Flex container responsive */}
          <div className="flex flex-wrap justify-center gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="group text-center w-[250px] sm:w-[300px] md:w-[220px] lg:w-[250px]"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl border-4 border-[#00214d] shadow-lg">
                  <img
                    src={member.img}
                    alt={member.name}
                    className="w-full aspect-square object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-80 transition-opacity flex items-center justify-center"
                    style={{
                      background:
                        index % 3 === 0
                          ? "#00ebc7"
                          : index % 3 === 1
                          ? "#fde24f"
                          : "#ff5470",
                    }}
                  >
                    <div className="text-[#00214d] font-bold text-lg">
                      Xem Thêm
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 text-[#00214d]">
                  {member.name}
                </h3>
                <p className="text-[#1b2d45] font-semibold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className=" section h-screen py-20 px-4 bg-gradient-to-b from-[#fffffe] to-[#f0f0f0]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-4 text-[#00214d]">
            Giá Trị Cốt Lõi
          </h2>
          <div className="w-24 h-1 bg-[#00ebc7] mx-auto mb-16"></div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="group relative bg-[#fffffe] p-8 rounded-2xl hover:transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl border-4 border-[#00214d]"
              >
                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity"
                  style={{ backgroundColor: value.color }}
                ></div>
                <div
                  className="inline-block p-4 rounded-xl mb-6 border-4 border-[#00214d]"
                  style={{ backgroundColor: value.color }}
                >
                  <value.icon
                    className="w-8 h-8 text-[#00214d]"
                    strokeWidth={3}
                  />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-[#00214d]">
                  {value.title}
                </h3>
                <p className="text-[#1b2d45] leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 pt-15 pb-5">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-110 transition-all duration-300"
            >
              <div
                className="inline-block p-4 rounded-full mb-4 group-hover:rotate-12 transition-transform border-4"
                style={{
                  backgroundColor:
                    index % 3 === 0
                      ? "#00ebc7"
                      : index % 3 === 1
                      ? "#fde24f"
                      : "#ff5470",
                  borderColor: "#00214d",
                }}
              >
                <stat.icon className="w-8 h-8 text-[#00214d]" strokeWidth={3} />
              </div>
              <div className="text-4xl font-bold mb-2 text-[#00214d]">
                {stat.number}
              </div>
              <div className="text-[#1b2d45] text-lg font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

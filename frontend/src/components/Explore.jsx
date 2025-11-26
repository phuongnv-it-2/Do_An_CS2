import React, { useState } from "react";
import { useEffect, useRef } from "react";
import NavBar from "./NavBar";
import VietNamMap from "../assets/VietNamMap.svg?react";
function InfoBox({ hoveredProvince, position }) {
  return (
    <div
      style={{
        position: "absolute",
        left: position.x,
        top: position.y,
        backgroundColor: "white",
        border: "1px solid #333",
        padding: "5px 10px",
        borderRadius: "8px",
        zIndex: 1000,
        pointerEvents: "none",
        boxShadow: "0px 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <strong>{hoveredProvince.name}</strong>
      <br />
      {/* Số thứ tự: {hoveredProvince.number} */}
    </div>
  );
}

import {
  TreeDeciduous,
  MapPin,
  AlertTriangle,
  Droplets,
  Wind,
  Trash2,
  Factory,
  Fish,
  Thermometer,
  TrendingUp,
} from "lucide-react";

// Data tỉnh thành Việt Nam
const provinces = [
  { id: "HoangSa", name: "Hoàng Sa (Đà Nẵng)", number: 65 },
  { id: "TruongSa", name: "Trường Sa (Khánh Hòa)", number: 64 },
  { id: "YenBai", name: "Yên Bái", number: 63 },
  { id: "VinhPhuc", name: "Vĩnh Phúc", number: 62 },
  { id: "VinhLong", name: "Vĩnh Long", number: 61 },
  { id: "TuyenQuang", name: "Tuyên Quang", number: 60 },
  { id: "TraVinh", name: "Trà Vinh", number: 59 },
  { id: "TienGiang", name: "Tiền Giang", number: 58 },
  { id: "ThuaThienHue", name: "Thừa Thiên - Huế", number: 57 },
  { id: "ThanhHoa", name: "Thanh Hóa", number: 56 },
  { id: "ThaiNguyen", name: "Thái Nguyên", number: 55 },
  { id: "ThaiBinh", name: "Thái Bình", number: 54 },
  { id: "TayNinh", name: "Tây Ninh", number: 53 },
  { id: "SonLa", name: "Sơn La", number: 52 },
  { id: "SocTrang", name: "Sóc Trăng", number: 51 },
  { id: "QuangTri", name: "Quảng Trị", number: 50 },
  { id: "QuangNinh", name: "Quảng Ninh", number: 49 },
  { id: "QuangNgai", name: "Quảng Ngãi", number: 48 },
  { id: "QuangNam", name: "Quảng Nam", number: 47 },
  { id: "QuangBinh", name: "Quảng Bình", number: 46 },
  { id: "PhuYen", name: "Phú Yên", number: 45 },
  { id: "PhuTho", name: "Phú Thọ", number: 44 },
  { id: "NinhThuan", name: "Ninh Thuận", number: 43 },
  { id: "NinhBinh", name: "Ninh Bình", number: 42 },
  { id: "NgheAn", name: "Nghệ An", number: 41 },
  { id: "NamDinh", name: "Nam Định", number: 40 },
  { id: "LongAn", name: "Long An", number: 39 },
  { id: "LangSon", name: "Lạng Sơn", number: 38 },
  { id: "LamDong", name: "Lâm Đồng", number: 37 },
  { id: "LaoCai", name: "Lào Cai", number: 36 },
  { id: "LaiChau", name: "Lai Châu", number: 35 },
  { id: "KomTum", name: "Kom Tum", number: 34 },
  { id: "KienGiang", name: "Kiên Giang", number: 33 },
  { id: "KhanhHoa", name: "Khánh Hòa", number: 32 },
  { id: "HungYen", name: "Hưng Yên", number: 31 },
  { id: "HoaBinh", name: "Hòa Bình", number: 30 },
  { id: "HoChiMinh", name: "Hồ Chí Minh", number: 29 },
  { id: "HauGiang", name: "Hậu Giang", number: 28 },
  { id: "HaiPhong", name: "Hải Phòng", number: 27 },
  { id: "HaiDuong", name: "Hải Dương", number: 26 },
  { id: "HaTinh", name: "Hà Tĩnh", number: 25 },
  { id: "HaNoi", name: "Hà Nội", number: 24 },
  { id: "HaNam", name: "Hà Nam", number: 23 },
  { id: "HaGiang", name: "Hà Giang", number: 22 },
  { id: "GiaLai", name: "Gia Lai", number: 21 },
  { id: "DongThap", name: "Đồng Tháp", number: 20 },
  { id: "DongNai", name: "Đồng Nai", number: 19 },
  { id: "DienBien", name: "Điện Biên", number: 18 },
  { id: "DakNong", name: "Đắk Nông", number: 17 },
  { id: "DakLak", name: "Đắk Lắk", number: 16 },
  { id: "DaNang", name: "Đà Nẵng", number: 15 },
  { id: "CanTho", name: "Cần Thơ", number: 14 },
  { id: "CaoBang", name: "Cao Bằng", number: 13 },
  { id: "CaMau", name: "Cà Mau", number: 12 },
  { id: "BinhThuan", name: "Bình Thuận", number: 11 },
  { id: "BinhPhuoc", name: "Bình Phước", number: 10 },
  { id: "BinhDuong", name: "Bình Dương", number: 9 },
  { id: "BinhDinh", name: "Bình Định", number: 8 },
  { id: "BenTre", name: "Bến Tre", number: 7 },
  { id: "BacNinh", name: "Bắc Ninh", number: 6 },
  { id: "BacGiang", name: "Bắc Giang", number: 5 },
  { id: "BacCan", name: "Bắc Cạn", number: 4 },
  { id: "BacLieu", name: "Bạc Liêu", number: 3 },
  { id: "BaRiaVungTau", name: "Bà Rịa - Vũng Tàu", number: 2 },
  { id: "AnGiang", name: "An Giang", number: 1 },
];

function Explore() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredProvinceId, setHoveredProvinceId] = useState(null);

  const mapRef = useRef(null);

  const environmentalIssues = [
    { icon: AlertTriangle, label: "Ô nhiễm", color: "#ff5470" },
    { icon: Trash2, label: "Rác thải", color: "#fde24f" },
    { icon: Droplets, label: "Nước", color: "#00ebc7" },
    { icon: Wind, label: "Không khí", color: "#00214d" },
  ];
  useEffect(() => {
    const svg = mapRef.current;
    if (!svg) return;

    const handlers = provinces.map((province) => {
      const path = svg.getElementById(province.id);
      if (!path) return null;

      const originalColor = path.getAttribute("fill") || "#f0f9ff";

      const onMouseOver = () => {
        setHoveredProvince(province);
        setHoveredProvinceId(province.id);
        path.setAttribute("fill", "#ffeb3b"); // Màu highlight khi hover
      };

      const onMouseMove = (e) => {
        const rect = svg.getBoundingClientRect();
        setHoverPosition({
          x: e.clientX - rect.left + 10,
          y: e.clientY - rect.top - 40,
        });
      };

      const onMouseOut = () => {
        setHoveredProvince(null);
        setHoveredProvinceId(null);
        path.setAttribute("fill", originalColor); // Trả về màu cũ
      };

      path.addEventListener("mouseover", onMouseOver);
      path.addEventListener("mousemove", onMouseMove);
      path.addEventListener("mouseout", onMouseOut);

      return { path, onMouseOver, onMouseMove, onMouseOut };
    });

    return () => {
      handlers.forEach((h) => {
        if (!h) return;
        const { path, onMouseOver, onMouseMove, onMouseOut } = h;
        path.removeEventListener("mouseover", onMouseOver);
        path.removeEventListener("mousemove", onMouseMove);
        path.removeEventListener("mouseout", onMouseOut);
      });
    };
  }, []);

  return (
    <div
      className="w-full min-h-screen flex flex-col"
      style={{ backgroundColor: "#fffffe" }}
    >
      {/* NAVBAR */}
      <div
        className="h-16 shadow flex items-center px-6"
        style={{ backgroundColor: "#fffffe" }}
      >
        <NavBar />
      </div>

      {/* HERO SECTION */}
      <div className="px-6 py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <TreeDeciduous className="w-10 h-10" style={{ color: "#ff5470" }} />
          <h1 className="text-4xl font-bold" style={{ color: "#00214d" }}>
            Thực Trạng Môi Trường Việt Nam
          </h1>
          <AlertTriangle className="w-10 h-10" style={{ color: "#ff5470" }} />
        </div>
        <p className="text-lg mb-8" style={{ color: "#1b2d45" }}>
          Theo dõi và cập nhật tình hình ô nhiễm môi trường toàn quốc
        </p>

        {/* Environmental Issues Icons */}
        <div className="flex justify-center gap-8 mb-8">
          {environmentalIssues.map((issue, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center gap-2 cursor-pointer hover:scale-110 transition-transform"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg"
                style={{
                  backgroundColor: "#fffffe",
                  border: `3px solid ${issue.color}`,
                }}
              >
                <issue.icon
                  className="w-10 h-10"
                  style={{ color: issue.color }}
                />
              </div>
              <span
                className="text-sm font-semibold"
                style={{ color: "#1b2d45" }}
              >
                {issue.label}
              </span>
            </div>
          ))}
        </div>

        {/* Alert Banner */}
        <div
          className="max-w-3xl mx-auto p-4 rounded-xl flex items-center gap-3"
          style={{ backgroundColor: "#fff4e0", border: "2px solid #fde24f" }}
        >
          <AlertTriangle className="w-6 h-6" style={{ color: "#ff5470" }} />
          <p className="text-sm font-medium" style={{ color: "#00214d" }}>
            <strong>Cảnh báo:</strong> Chất lượng không khí tại các thành phố
            lớn đang ở mức báo động
          </p>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex flex-1 px-6 pb-6 gap-6">
        {/* Box trái - Bản đồ Việt Nam */}
        <div
          className="flex-1 rounded-xl shadow-lg p-6"
          style={{ backgroundColor: "#fffffe" }}
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "#00214d" }}
          >
            <MapPin className="w-6 h-6" style={{ color: "#00ebc7" }} />
            Bản đồ tình trạng môi trường
          </h2>

          {/* Vietnam Map Visualization */}
          <div
            className="relative w-full h-96 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: "#f0f9ff",
              border: "3px solid #00ebc7",
            }}
          >
            <div className="relative inset-0 flex items-center justify-center p-8">
              <VietNamMap ref={mapRef} />
              {hoveredProvince && (
                <InfoBox
                  hoveredProvince={hoveredProvince}
                  position={hoverPosition}
                />
              )}
            </div>
          </div>

          {/* Province Selector */}
          <div className="mt-6">
            <label
              className="block text-sm font-semibold mb-2"
              style={{ color: "#00214d" }}
            >
              Chọn tỉnh/thành phố:
            </label>
            <select
              value={selectedProvince || ""}
              onChange={(e) => setSelectedProvince(e.target.value || null)}
              className="w-full p-3 rounded-lg border-2 outline-none font-medium"
              style={{
                borderColor: "#00ebc7",
                color: "#1b2d45",
                backgroundColor: "#fffffe",
              }}
            >
              <option value="">-- Chọn khu vực --</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {selectedProvince && (
            <div
              className="mt-4 p-4 rounded-lg shadow"
              style={{ backgroundColor: "#e0f7f4" }}
            >
              <p
                className="text-base font-semibold"
                style={{ color: "#00214d" }}
              >
                📍 Đang xem:{" "}
                <span className="font-bold text-xl">
                  {provinces.find((p) => p.id === selectedProvince)?.name}
                </span>
              </p>
              <button
                onClick={() => setSelectedProvince(null)}
                className="text-sm underline mt-2 font-medium hover:opacity-70"
                style={{ color: "#1b2d45" }}
              >
                ✕ Xóa bộ lọc
              </button>
            </div>
          )}

          {/* Environmental Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: "#fef2f2" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#ff5470" }}>
                156
              </p>
              <p className="text-sm font-medium" style={{ color: "#1b2d45" }}>
                Chỉ số AQI trung bình
              </p>
            </div>
            <div
              className="p-4 rounded-lg text-center"
              style={{ backgroundColor: "#fff4e0" }}
            >
              <p className="text-3xl font-bold" style={{ color: "#fde24f" }}>
                2.3M
              </p>
              <p className="text-sm font-medium" style={{ color: "#1b2d45" }}>
                Tấn rác thải/năm
              </p>
            </div>
          </div>

          {/* Legend */}
          <div
            className="mt-4 p-4 rounded-lg"
            style={{ backgroundColor: "#f0f9ff" }}
          >
            <p
              className="text-xs font-semibold mb-2"
              style={{ color: "#00214d" }}
            >
              Chú thích:
            </p>
            <div className="flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#00ebc7" }}
                ></div>
                <span style={{ color: "#1b2d45" }}>Tốt (0-50)</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#fde24f" }}
                ></div>
                <span style={{ color: "#1b2d45" }}>TB (51-100)</span>
              </div>
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: "#ff5470" }}
                ></div>
                <span style={{ color: "#1b2d45" }}>Kém (100)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Box phải - Thực trạng môi trường */}
        <div
          className="flex-1 rounded-xl shadow-lg p-6"
          style={{ backgroundColor: "#fffffe" }}
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "#00214d" }}
          >
            <AlertTriangle className="w-6 h-6" style={{ color: "#ff5470" }} />
            Các vấn đề môi trường nghiêm trọng
          </h2>

          {/* Environmental Issues */}
          <div className="space-y-4">
            <div
              className="p-5 rounded-lg border-l-4 shadow"
              style={{ backgroundColor: "#fef2f2", borderLeftColor: "#ff5470" }}
            >
              <div className="flex items-start gap-3">
                <Wind
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: "#ff5470" }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#00214d" }}
                  >
                    Ô nhiễm không khí
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#1b2d45" }}
                  >
                    Chỉ số AQI tại các đô thị lớn thường xuyên vượt ngưỡng an
                    toàn, ảnh hưởng nghiêm trọng đến sức khỏe cộng đồng.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <TrendingUp
                      className="w-4 h-4"
                      style={{ color: "#ff5470" }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#ff5470" }}
                    >
                      Tăng 23% so với năm trước
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-5 rounded-lg border-l-4 shadow"
              style={{ backgroundColor: "#e0f7f4", borderLeftColor: "#00ebc7" }}
            >
              <div className="flex items-start gap-3">
                <Droplets
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: "#00ebc7" }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#00214d" }}
                  >
                    Ô nhiễm nguồn nước
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#1b2d45" }}
                  >
                    Hơn 60% nguồn nước mặt bị ô nhiễm do chất thải công nghiệp
                    và sinh hoạt chưa qua xử lý.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Factory className="w-4 h-4" style={{ color: "#00ebc7" }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#00ebc7" }}
                    >
                      70% do công nghiệp gây ra
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-5 rounded-lg border-l-4 shadow"
              style={{ backgroundColor: "#fffbeb", borderLeftColor: "#fde24f" }}
            >
              <div className="flex items-start gap-3">
                <Trash2
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: "#fde24f" }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#00214d" }}
                  >
                    Rác thải nhựa
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#1b2d45" }}
                  >
                    Việt Nam là một trong 5 quốc gia thải rác nhựa ra biển nhiều
                    nhất thế giới với 1.8 triệu tấn/năm.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <Fish className="w-4 h-4" style={{ color: "#fde24f" }} />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#fde24f" }}
                    >
                      Đe dọa hệ sinh thái biển
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-5 rounded-lg border-l-4 shadow"
              style={{ backgroundColor: "#fff4e0", borderLeftColor: "#ff5470" }}
            >
              <div className="flex items-start gap-3">
                <Thermometer
                  className="w-8 h-8 flex-shrink-0"
                  style={{ color: "#ff5470" }}
                />
                <div>
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: "#00214d" }}
                  >
                    Biến đổi khí hậu
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: "#1b2d45" }}
                  >
                    Nhiệt độ trung bình tăng 0.62°C trong 60 năm qua. Mực nước
                    biển dâng đe dọa vùng đồng bằng ven biển.
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <AlertTriangle
                      className="w-4 h-4"
                      style={{ color: "#ff5470" }}
                    />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "#ff5470" }}
                    >
                      Nguy cơ cao nhất khu vực
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div
            className="mt-6 p-6 rounded-xl text-center"
            style={{ backgroundColor: "#ff5470" }}
          >
            <h3 className="font-bold text-xl mb-2" style={{ color: "#fffffe" }}>
              Hành động ngay hôm nay! 🌍
            </h3>
            <p className="text-sm mb-4" style={{ color: "#fffffe" }}>
              Mỗi hành động nhỏ đều góp phần bảo vệ môi trường
            </p>
            <button
              className="px-6 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform"
              style={{
                backgroundColor: "#fffffe",
                color: "#00214d",
              }}
            >
              Tìm hiểu thêm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore;

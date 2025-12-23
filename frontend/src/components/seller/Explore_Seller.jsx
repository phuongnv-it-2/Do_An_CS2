import React, { useState } from "react";
import { useEffect, useRef } from "react";
import NavBar_Seller from "./NavBar_Seller";
import VietNamMapWrapper from "../MapWrapper";
import svgPanZoom from "svg-pan-zoom";
import {
  TreeDeciduous,
  MapPin,
  AlertTriangle,
  Droplets,
  Wind,
  Trash2,
  Thermometer,
  X,
  Eye,
} from "lucide-react";

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
    </div>
  );
}

function formatCityName(name) {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-");
}

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

function Explore_Seller() {
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [hoveredProvince, setHoveredProvince] = useState(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const [hoveredProvinceId, setHoveredProvinceId] = useState(null);
  const [airData, setAirData] = useState(null);
  const [loading, setLoading] = useState(false);

  const mapRef = useRef(null);

  const environmentalIssues = [
    { icon: Thermometer, label: "Nhiệt độ", color: "#ff5470" },
    { icon: Trash2, label: "AQI", color: "#fde24f" },
    { icon: Droplets, label: "Độ ẩm", color: "#00ebc7" },
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
        path.setAttribute("fill", "#ffeb3b");
      };

      const onMouseMove = (e) => {
        const rect = svg.getBoundingClientRect();
        setHoverPosition({
          x: e.clientX - rect.left + 10,
          y: e.clientY - rect.top + 10,
        });
      };

      const onMouseOut = () => {
        setHoveredProvince(null);
        setHoveredProvinceId(null);
        path.setAttribute("fill", originalColor);
      };

      const onClick = () => {
        const formatted = formatCityName(province.name);
        setSelectedProvince(province.id);
        fetchAirQuality(formatted);
      };

      path.addEventListener("mouseover", onMouseOver);
      path.addEventListener("mousemove", onMouseMove);
      path.addEventListener("mouseout", onMouseOut);
      path.addEventListener("click", onClick);

      return { path, onMouseOver, onMouseMove, onMouseOut, onClick };
    });

    return () => {
      handlers.forEach((h) => {
        if (!h) return;
        const { path, onMouseOver, onMouseMove, onMouseOut, onClick } = h;
        path.removeEventListener("mouseover", onMouseOver);
        path.removeEventListener("mousemove", onMouseMove);
        path.removeEventListener("mouseout", onMouseOut);
        path.removeEventListener("click", onClick);
      });
    };
  }, []);

  useEffect(() => {
    if (!mapRef.current) return;

    const panZoomInstance = svgPanZoom(mapRef.current, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      minZoom: 1,
      maxZoom: 8,
      fit: true,
      center: true,
      panEnabled: true,
    });

    return () => panZoomInstance.destroy();
  }, []);

  async function fetchAirQuality(citySlug) {
    try {
      setLoading(true);
      setAirData(null);

      const res = await fetch(
        `https://do-an-cs2.onrender.com/air?city=${citySlug}`
      );
      const data = await res.json();

      console.log("Dữ liệu API trả về:", data);
      setAirData(data);
    } catch (err) {
      console.error("Lỗi API:", err);
      setAirData({ error: "Không lấy được dữ liệu" });
    } finally {
      setLoading(false);
    }
  }

  const getAQILevel = (aqi) => {
    if (aqi <= 50) return { label: "Tốt", color: "#00ebc7" };
    if (aqi <= 100) return { label: "Trung bình", color: "#fde24f" };
    if (aqi <= 150) return { label: "Kém", color: "#ff5470" };
    if (aqi <= 200) return { label: "Xấu", color: "#c9184a" };
    if (aqi <= 300) return { label: "Rất xấu", color: "#800f2f" };
    return { label: "Nguy hại", color: "#4c0519" };
  };

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
        <NavBar_Seller />
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
        <p className="text-lg mb-8" style={{ color: "#1b2d45" }}></p>

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
          className="max-w-4xl mx-auto p-4 rounded-xl flex items-center justify-center gap-2"
          style={{ backgroundColor: "#E0FFFE", border: "2px solid #00ebc7" }}
        >
          <Eye size={24} className="text-[#00EBC7]" />
          <p className="text-center text-sm font-medium text-[#00214d]">
            Theo dõi và cập nhật tình hình ô nhiễm môi trường toàn quốc
          </p>
        </div>
      </div>

      {/* MAIN CONTENT - 2 Box Layout */}
      <div className="flex justify-center px-6 pb-8 ">
        <div className="w-full flex gap-6">
          {/* Box trái - Bản đồ Việt Nam */}
          <div
            className="flex-1 rounded-xl shadow-lg p-6 border-2 border-[#00EBC7]"
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
              className="relative w-full h-96 rounded-xl"
              style={{
                backgroundColor: "#f0f9ff",
                border: "3px solid #00ebc7",
              }}
            >
              <VietNamMapWrapper
                ref={mapRef}
                className="absolute top-0 left-0 w-full h-full"
              />

              {hoveredProvince && (
                <InfoBox
                  hoveredProvince={hoveredProvince}
                  position={hoverPosition}
                />
              )}
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
                onChange={(e) => {
                  const provinceId = e.target.value || null;
                  setSelectedProvince(provinceId);
                  if (provinceId) {
                    const province = provinces.find((p) => p.id === provinceId);
                    const formatted = formatCityName(province.name);
                    fetchAirQuality(formatted);
                  }
                }}
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

            {/* Legend */}
            <div
              className="mt-6 p-4 rounded-lg"
              style={{ backgroundColor: "#f0f9ff" }}
            >
              <p
                className="text-xs font-semibold mb-2"
                style={{ color: "#00214d" }}
              >
                Chú thích:
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
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
                  <span style={{ color: "#1b2d45" }}>Trung bình (51-100)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#ff5470" }}
                  ></div>
                  <span style={{ color: "#1b2d45" }}>Kém (101-150)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#c9184a" }}
                  ></div>
                  <span style={{ color: "#1b2d45" }}>Xấu (151-200)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#800f2f" }}
                  ></div>
                  <span style={{ color: "#1b2d45" }}>Rất xấu (201-300)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: "#4c0519" }}
                  ></div>
                  <span style={{ color: "#1b2d45" }}>Nguy hại (301-500)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Box phải - Thông tin chi tiết */}
          <div
            className="w-[700px] rounded-xl shadow-lg p-6 overflow-y-auto border-2 border-[#00EBC7]"
            style={{
              backgroundColor: "#fffffe",
              maxHeight: "800px",
            }}
          >
            {!selectedProvince ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <MapPin
                  className="w-16 h-16 mb-4 opacity-30"
                  style={{ color: "#00ebc7" }}
                />
                <p
                  className="text-lg font-semibold"
                  style={{ color: "#00214d" }}
                >
                  Chọn một tỉnh/thành phố
                </p>
                <p className="text-sm mt-2" style={{ color: "#1b2d45" }}>
                  Click vào bản đồ hoặc chọn từ danh sách để xem thông tin chi
                  tiết
                </p>
              </div>
            ) : (
              <div>
                {/* Header với nút đóng */}
                <div className="flex justify-between items-start mb-4">
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: "#00214d" }}
                  >
                    {provinces.find((p) => p.id === selectedProvince)?.name}
                  </h2>
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
                    style={{ color: "#1b2d45" }}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {loading && (
                  <div className="flex flex-col items-center justify-center py-8">
                    <div
                      className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4"
                      style={{ borderColor: "#00ebc7" }}
                    ></div>
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#1b2d45" }}
                    >
                      Đang tải dữ liệu không khí...
                    </p>
                  </div>
                )}

                {airData?.error && (
                  <div
                    className="p-4 rounded-lg"
                    style={{ backgroundColor: "#ffe0e0" }}
                  >
                    <p
                      className="text-sm font-semibold"
                      style={{ color: "#c9184a" }}
                    >
                      ❌ {airData.error}
                    </p>
                  </div>
                )}

                {airData && !airData.error && (
                  <div className="space-y-4">
                    {/* Thông tin trạm đo */}
                    {(airData.city?.name || airData.attributions) && (
                      <div
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: "#f0f9ff" }}
                      >
                        <div className="flex items-start gap-2">
                          <MapPin
                            className="w-4 h-4 mt-0.5"
                            style={{ color: "#00ebc7" }}
                          />
                          <div className="flex-1">
                            <p
                              className="text-xs font-semibold mb-1"
                              style={{ color: "#00214d" }}
                            >
                              Trạm đo:
                            </p>
                            {airData.city?.name && (
                              <p
                                className="text-sm font-medium"
                                style={{ color: "#1b2d45" }}
                              >
                                {airData.city.name}
                              </p>
                            )}
                            {airData.city?.geo && (
                              <p
                                className="text-xs mt-1"
                                style={{ color: "#1b2d45" }}
                              >
                                📍 {airData.city.geo[0]}, {airData.city.geo[1]}
                              </p>
                            )}
                            {airData.city?.url && (
                              <a
                                href={airData.city.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs mt-1 block hover:underline"
                                style={{ color: "#00ebc7" }}
                              >
                                🔗 Xem chi tiết trạm
                              </a>
                            )}
                            {airData.attributions &&
                              airData.attributions.length > 0 && (
                                <div className="mt-2 space-y-1">
                                  {airData.attributions.map((attr, idx) => (
                                    <p
                                      key={idx}
                                      className="text-xs"
                                      style={{ color: "#1b2d45" }}
                                    >
                                      {attr.name && `📊 ${attr.name}`}
                                      {attr.url && (
                                        <a
                                          href={attr.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="ml-2 hover:underline"
                                          style={{ color: "#00ebc7" }}
                                        >
                                          (nguồn)
                                        </a>
                                      )}
                                    </p>
                                  ))}
                                </div>
                              )}
                            {airData.time?.s && (
                              <p
                                className="text-xs mt-2"
                                style={{ color: "#1b2d45" }}
                              >
                                🕐 Cập nhật:{" "}
                                {new Date(airData.time.s).toLocaleString(
                                  "vi-VN"
                                )}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                    {/* Chỉ số AQI chính */}
                    {airData.aqi && (
                      <div
                        className="p-6 rounded-xl text-center"
                        style={{
                          backgroundColor:
                            getAQILevel(airData.aqi)?.color + "20",
                          border: `2px solid ${
                            getAQILevel(airData.aqi)?.color
                          }`,
                        }}
                      >
                        <p
                          className="text-sm font-semibold mb-2"
                          style={{ color: "#00214d" }}
                        >
                          Chỉ số chất lượng không khí (AQI)
                        </p>
                        <p
                          className="text-5xl font-bold mb-2"
                          style={{ color: getAQILevel(airData.aqi)?.color }}
                        >
                          {airData.aqi}
                        </p>
                        <p
                          className="text-lg font-semibold"
                          style={{ color: getAQILevel(airData.aqi)?.color }}
                        >
                          {getAQILevel(airData.aqi)?.label}
                        </p>
                      </div>
                    )}

                    {/* Các thông số chi tiết */}
                    {airData.iaqi && (
                      <div className="space-y-3">
                        <h3
                          className="text-lg font-bold"
                          style={{ color: "#00214d" }}
                        >
                          Thông số chi tiết
                        </h3>

                        {airData.iaqi.pm25 && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  PM2.5
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Bụi mịn
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.pm25.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.pm10 && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  PM10
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Bụi thô
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.pm10.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.co && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  CO
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Carbon Monoxide
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.co.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.no2 && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  NO₂
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Nitrogen Dioxide
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.no2.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.o3 && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  O₃
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Ozone
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.o3.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.so2 && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  SO₂
                                </p>
                                <p
                                  className="text-xs"
                                  style={{ color: "#1b2d45" }}
                                >
                                  Sulfur Dioxide
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.so2.v}
                            </p>
                          </div>
                        )}

                        {airData.iaqi.t && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Thermometer
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  Nhiệt độ
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.t.v}°C
                            </p>
                          </div>
                        )}

                        {airData.iaqi.h && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Droplets
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  Độ ẩm
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.h.v}%
                            </p>
                          </div>
                        )}

                        {airData.iaqi.p && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  Áp suất
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.p.v} hPa
                            </p>
                          </div>
                        )}

                        {airData.iaqi.w && (
                          <div
                            className="p-4 rounded-lg flex items-center justify-between"
                            style={{ backgroundColor: "#f0f9ff" }}
                          >
                            <div className="flex items-center gap-3">
                              <Wind
                                className="w-5 h-5"
                                style={{ color: "#00214d" }}
                              />
                              <div>
                                <p
                                  className="text-sm font-semibold"
                                  style={{ color: "#00214d" }}
                                >
                                  Tốc độ gió
                                </p>
                              </div>
                            </div>
                            <p
                              className="text-xl font-bold"
                              style={{ color: "#00214d" }}
                            >
                              {airData.iaqi.w.v} m/s
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Khuyến nghị */}
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: "#fff4e0",
                        border: "2px solid #fde24f",
                      }}
                    >
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className="w-5 h-5 mt-0.5"
                          style={{ color: "#ff5470" }}
                        />
                        <div>
                          <p
                            className="text-sm font-bold mb-1"
                            style={{ color: "#00214d" }}
                          >
                            Khuyến nghị:
                          </p>
                          <p className="text-xs" style={{ color: "#1b2d45" }}>
                            {airData.aqi <= 50 &&
                              "Chất lượng không khí tốt, hoạt động ngoài trời bình thường."}
                            {airData.aqi > 50 &&
                              airData.aqi <= 100 &&
                              "Nhóm nhạy cảm nên hạn chế hoạt động ngoài trời kéo dài."}
                            {airData.aqi > 100 &&
                              airData.aqi <= 150 &&
                              "Nhóm nhạy cảm nên tránh hoạt động ngoài trời."}
                            {airData.aqi > 150 &&
                              "Mọi người nên hạn chế ra ngoài, đeo khẩu trang khi cần thiết."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Explore_Seller;

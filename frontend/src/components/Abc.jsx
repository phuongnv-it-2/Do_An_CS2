import { useState } from "react";

export default function Abc() {
  const [token, setToken] = useState("");
  const [data, setData] = useState(null);

  const getAirQuality = async () => {
    try {
      const res = await fetch(`http://localhost:3000/air?city=hue`);
      const json = await res.json();
      setData(json);
    } catch (error) {
      console.error("Lỗi gọi API:", error);
      alert("Không thể lấy dữ liệu!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chất lượng không khí Đà Nẵng</h1>

      {/* Nhập TOKEN */}
      <input
        type="text"
        placeholder="Nhập AQICN TOKEN..."
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="border p-3 rounded w-full mb-3"
      />

      {/* Button gọi API */}
      <button
        onClick={getAirQuality}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Lấy dữ liệu
      </button>

      {/* Hiển thị kết quả */}
      {data && (
        <div className="mt-5 bg-gray-100 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Kết quả:</h2>
          <pre className="whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

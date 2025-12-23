import { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import ChartTab from "../common/ChartTab";
import React from "react";

interface RevenueData {
  month: number;
  year: number;
  totalRevenue: number;
  orderCount: number;
}

export default function StatisticsChart() {
  const [revenueData, setRevenueData] = useState<number[]>(Array(12).fill(0));
  const [orderCountData, setOrderCountData] = useState<number[]>(Array(12).fill(0));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchRevenueData();
  }, [selectedYear]);

  const fetchRevenueData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
      }

      console.log('📡 Making request to:', `https://do-an-cs2.onrender.com/orders/revenue-statistics?year=${selectedYear}`);

      const response = await fetch(
        `https://do-an-cs2.onrender.com/orders/revenue-statistics?year=${selectedYear}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // ✅ Ensure Bearer prefix
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ Error response:', errorData);
        throw new Error(errorData.message || 'Không thể tải dữ liệu doanh thu');
      }

      const data: RevenueData[] = await response.json();
      const monthlyRevenue = Array(12).fill(0);
      const monthlyOrders = Array(12).fill(0);
      // Điền dữ liệu vào đúng tháng
      data.forEach(item => {
        const monthIndex = item.month - 1; // Chuyển từ 1-12 sang 0-11
        monthlyRevenue[monthIndex] = parseFloat(item.totalRevenue.toString()) / 1000000; // Chuyển sang triệu
        monthlyOrders[monthIndex] = item.orderCount;
      });

      setRevenueData(monthlyRevenue);
      setOrderCountData(monthlyOrders);
    } catch (err) {
      console.error('❌ Error fetching revenue data:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setRevenueData([180, 190, 170, 160, 175, 165, 170, 205, 230, 210, 240, 235]);
      setOrderCountData([40, 30, 50, 40, 55, 40, 70, 100, 110, 120, 150, 140]);
    } finally {
      setLoading(false);
    }
  };

  const options: ApexOptions = {
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#465FFF", "#9CB9FF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      height: 310,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      width: [2, 2],
    },
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.55,
        opacityTo: 0,
      },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: {
        size: 6,
      },
    },
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function(value, { seriesIndex }) {
          if (seriesIndex === 0) {
            return value.toFixed(2) + ' triệu VNĐ';
          }
          return value + ' đơn';
        }
      }
    },
    xaxis: {
      type: "category",
      categories: [
        "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", 
        "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8",
        "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12",
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    yaxis: [
      {
        seriesName: 'Doanh thu',
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
          formatter: function(value) {
            return value.toFixed(0) + 'M';
          }
        },
        title: {
          text: "",
          style: {
            fontSize: "0px",
          },
        },
      },
      {
        opposite: true,
        seriesName: 'Số đơn',
        labels: {
          style: {
            fontSize: "12px",
            colors: ["#6B7280"],
          },
          formatter: function(value) {
            return value.toFixed(0);
          }
        },
        title: {
          text: "",
          style: {
            fontSize: "0px",
          },
        },
      }
    ],
  };

  const series = [
    {
      name: "Doanh thu (triệu VNĐ)",
      data: revenueData,
    },
    {
      name: "Số đơn hàng",
      data: orderCountData,
    },
  ];

  // Tạo danh sách năm (5 năm gần nhất)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div className="w-full">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Thống kê doanh thu năm {selectedYear}
          </h3>
          <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
            Doanh thu từ các đơn hàng đã hoàn thành
          </p>
        </div>
        <div className="flex items-start w-full gap-3 sm:justify-end">
          {/* Select năm */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          >
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          
          {/* Nút làm mới */}
          <button
            onClick={fetchRevenueData}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Đang tải...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Làm mới
              </>
            )}
          </button>

          <ChartTab />
        </div>
      </div>

      {/* Hiển thị lỗi */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <svg className="w-5 h-5 text-red-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Không thể tải dữ liệu</p>
            <p className="text-xs text-red-600 mt-1">{error}</p>
            {error.includes('đăng nhập') && (
              <button 
                onClick={() => window.location.href = '/login'}
                className="mt-2 text-xs text-red-700 underline hover:text-red-900"
              >
                Đi đến trang đăng nhập
              </button>
            )}
          </div>
        </div>
      )}

      {loading && !error ? (
        <div className="flex flex-col items-center justify-center h-[310px] gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <div className="max-w-full overflow-x-auto custom-scrollbar">
          <div className="min-w-[1000px] xl:min-w-full">
            <Chart options={options} series={series} type="area" height={310} />
          </div>
        </div>
      )}

      {/* Thông tin tổng quan */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Tổng doanh thu</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-1">
            {revenueData.reduce((a, b) => a + b, 0).toFixed(2)}M VNĐ
          </p>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">Tổng đơn hàng</p>
          <p className="text-lg font-bold text-green-600 dark:text-green-400 mt-1">
            {orderCountData.reduce((a, b) => a + b, 0)} đơn
          </p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">TB/tháng</p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-1">
            {(revenueData.reduce((a, b) => a + b, 0) / 12).toFixed(2)}M VNĐ
          </p>
        </div>
        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
          <p className="text-xs text-gray-600 dark:text-gray-400">TB/đơn</p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400 mt-1">
            {orderCountData.reduce((a, b) => a + b, 0) > 0
              ? ((revenueData.reduce((a, b) => a + b, 0) * 1000000) / orderCountData.reduce((a, b) => a + b, 0)).toLocaleString('vi-VN')
              : '0'} VNĐ
          </p>
        </div>
      </div>
    </div>
  );
}
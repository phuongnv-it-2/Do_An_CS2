import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { useState, useEffect } from "react";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import React from "react";

interface RevenueSummary {
  yearRevenue: number;
  monthRevenue: number;
  lastMonthRevenue: number;
  totalCompletedOrders: number;
  monthOrders: number;
  avgOrderValue: number;
  growthRate: number;
  year: number;
  month: number;
}

export default function MonthlyTarget() {
  const [data, setData] = useState<RevenueSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [monthlyTarget] = useState(20000000); // Target 20 triệu VNĐ/tháng

  useEffect(() => {
    fetchRevenueSummary();
  }, []);

  const fetchRevenueSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('accessToken');
      
      if (!token) {
        throw new Error('Token không tồn tại. Vui lòng đăng nhập lại.');
      }

      const response = await fetch(
        'http://localhost:3000/orders/revenue-summary',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('accessToken');
        throw new Error('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Không thể tải dữ liệu');
      }

      const summaryData: RevenueSummary = await response.json();
      setData(summaryData);
    } catch (err) {
      console.error('Error fetching revenue summary:', err);
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      
      // Dữ liệu mẫu khi lỗi
      setData({
        yearRevenue: 150000000,
        monthRevenue: 15000000,
        lastMonthRevenue: 13500000,
        totalCompletedOrders: 150,
        monthOrders: 45,
        avgOrderValue: 333333,
        growthRate: 11.11,
        year: 2025,
        month: 12
      });
    } finally {
      setLoading(false);
    }
  };

  // Tính phần trăm hoàn thành so với target
  const completionPercentage = data 
    ? Math.min(((data.monthRevenue / monthlyTarget) * 100), 100) 
    : 0;

  const series = [completionPercentage];
  
  const options: ApexOptions = {
    colors: [completionPercentage >= 100 ? "#039855" : "#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val.toFixed(1) + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [completionPercentage >= 100 ? "#039855" : "#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  // Format số tiền
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Tính doanh thu hôm nay (giả lập)
  const todayRevenue = data ? data.monthRevenue / 30 : 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mục tiêu tháng này
            </h3>
            <p className="mt-1 text-gray-500 text-theme-sm dark:text-gray-400">
              {data ? `Tháng ${data.month}/${data.year}` : 'Đang tải...'}
            </p>
          </div>
          <div className="relative inline-block">
            <button 
              className="dropdown-toggle p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" 
              onClick={toggleDropdown}
              disabled={loading}
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={() => {
                  fetchRevenueSummary();
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                🔄 Làm mới
              </DropdownItem>
              <DropdownItem
                onItemClick={() => {
                  console.log('Revenue Summary:', data);
                  closeDropdown();
                }}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                📊 Xem chi tiết
              </DropdownItem>
            </Dropdown>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error}</p>
          </div>
        )}

        {/* Loading or Chart */}
        {loading && !error ? (
          <div className="flex flex-col items-center justify-center h-[330px] gap-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-sm text-gray-500">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="relative">
            <div className="max-h-[330px]" id="chartDarkStyle">
              <Chart
                options={options}
                series={series}
                type="radialBar"
                height={330}
              />
            </div>

            <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${
              data && data.growthRate >= 0 
                ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500' 
                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
            }`}>
              {data && data.growthRate >= 0 ? '+' : ''}{data?.growthRate.toFixed(1)}%
            </span>
          </div>
        )}

        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {data && completionPercentage >= 100 ? (
            <>🎉 Xuất sắc! Bạn đã hoàn thành {completionPercentage.toFixed(1)}% mục tiêu tháng này!</>
          ) : data && completionPercentage >= 80 ? (
            <>👍 Tốt lắm! Bạn đã đạt {completionPercentage.toFixed(1)}% mục tiêu, hãy tiếp tục phát huy!</>
          ) : data && completionPercentage >= 50 ? (
            <>💪 Đang tiến bộ! Bạn đã hoàn thành {completionPercentage.toFixed(1)}% mục tiêu tháng này.</>
          ) : (
            <>📈 Hãy cố gắng hơn! Bạn đã đạt {completionPercentage.toFixed(1)}% mục tiêu tháng này.</>
          )}
        </p>
      </div>

      <div className="flex items-center justify-center gap-5 px-6 py-3.5 sm:gap-8 sm:py-5">
        {/* Target */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Mục tiêu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {formatCurrency(monthlyTarget)}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        {/* Revenue */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Doanh thu
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {data ? formatCurrency(data.monthRevenue) : '...'}
            {data && data.growthRate >= 0 ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.60141 2.33683C7.73885 2.18084 7.9401 2.08243 8.16435 2.08243C8.16475 2.08243 8.16516 2.08243 8.16556 2.08243C8.35773 2.08219 8.54998 2.15535 8.69664 2.30191L12.6968 6.29924C12.9898 6.59203 12.9899 7.0669 12.6971 7.3599C12.4044 7.6529 11.9295 7.65306 11.6365 7.36027L8.91435 4.64004L8.91435 13.5C8.91435 13.9142 8.57856 14.25 8.16435 14.25C7.75013 14.25 7.41435 13.9142 7.41435 13.5L7.41435 4.64442L4.69679 7.36025C4.4038 7.65305 3.92893 7.6529 3.63613 7.35992C3.34333 7.06693 3.34348 6.59206 3.63646 6.29926L7.60141 2.33683Z" fill="#039855"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M7.26816 13.6632C7.4056 13.8192 7.60686 13.9176 7.8311 13.9176C7.83148 13.9176 7.83187 13.9176 7.83226 13.9176C8.02445 13.9178 8.21671 13.8447 8.36339 13.6981L12.3635 9.70076C12.6565 9.40797 12.6567 8.9331 12.3639 8.6401C12.0711 8.34711 11.5962 8.34694 11.3032 8.63973L8.5811 11.36L8.5811 2.5C8.5811 2.08579 8.24531 1.75 7.8311 1.75C7.41688 1.75 7.0811 2.08579 7.0811 2.5L7.0811 11.3556L4.36354 8.63975C4.07055 8.34695 3.59568 8.3471 3.30288 8.64009C3.01008 8.93307 3.01023 9.40794 3.30321 9.70075L7.26816 13.6632Z" fill="#D92D20"/>
              </svg>
            )}
          </p>
        </div>

        <div className="w-px bg-gray-200 h-7 dark:bg-gray-800"></div>

        {/* Today */}
        <div>
          <p className="mb-1 text-center text-gray-500 text-theme-xs dark:text-gray-400 sm:text-sm">
            Hôm nay (TB)
          </p>
          <p className="flex items-center justify-center gap-1 text-base font-semibold text-gray-800 dark:text-white/90 sm:text-lg">
            {data ? formatCurrency(todayRevenue) : '...'}
          </p>
        </div>
      </div>
    </div>
  );
}
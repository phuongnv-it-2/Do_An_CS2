import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Star, TrendingUp, RefreshCw, AlertCircle } from 'lucide-react';

const Badge = ({ color, children }) => {
  const colors = {
    success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color] || colors.info}`}>
      {children}
    </span>
  );
};

const MetricCard = ({ icon: Icon, label, value, badge, bgColor, iconColor, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50">
        <div className="animate-pulse">
          <div className={`w-12 h-12 rounded-xl ${bgColor} opacity-50`}></div>
          <div className="mt-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded dark:bg-gray-700 w-20"></div>
            <div className="h-6 bg-gray-200 rounded dark:bg-gray-700 w-16"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] hover:border-gray-300 dark:hover:border-gray-700">
      <div className="flex items-start justify-between">
        <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${bgColor} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
        <Badge color={badge.color}>{badge.text}</Badge>
      </div>

      <div className="mt-4">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <h3 className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
          {value}
        </h3>
      </div>
    </div>
  );
};

interface MetricsState {
  totalProducts: number;
  totalUsers: number;
  avgRating: number;
  totalReviews: number;
  loading: boolean;
  error: string | null;
}

export default function EcommerceMetrics() {
  const [metrics, setMetrics] = useState<MetricsState>({
    totalProducts: 0,
    totalUsers: 0,
    avgRating: 0,
    totalReviews: 0,
    loading: true,
    error: null
  });

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setMetrics(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {
      // Gọi API metrics tổng thể
      const metricsRes = await fetch('http://localhost:3000/products/metrics');
      
      if (!metricsRes.ok) {
        throw new Error(`HTTP error! status: ${metricsRes.status}`);
      }
      
      const metricsData = await metricsRes.json();
      
    
      let totalUsers = 0;
      try {
          const usersRes = await fetch('http://localhost:3000/user/metrics');
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          totalUsers = usersData.totalUsers  || 0;
        }
      } catch (err) {
        console.warn('Could not fetch users count:', err);
      }

      setMetrics({
        totalProducts: metricsData.totalProducts || 0,
        totalReviews: metricsData.totalReviews || 0,
        avgRating: parseFloat(metricsData.avgRating) || 0,
        totalUsers: totalUsers,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetrics({
        totalProducts: 0,
        totalUsers: 0,
        avgRating: 0,
        totalReviews: 0,
        loading: false,
        error: 'Không thể tải dữ liệu. Vui lòng kiểm tra kết nối.'
      });
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchMetrics(true);
  };

  if (metrics.error) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 dark:border-red-800/50 dark:bg-red-900/10">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-red-800 dark:text-red-200">
              Lỗi tải dữ liệu
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              {metrics.error}
            </p>
            <button 
              onClick={() => fetchMetrics()}
              className="mt-3 inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-lg hover:bg-red-200 dark:text-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  const avgReviewPerProduct = metrics.totalProducts > 0 
    ? (metrics.totalReviews / metrics.totalProducts).toFixed(1) 
    : '0';

  const engagementRate = metrics.totalProducts > 0
    ? ((metrics.totalReviews / metrics.totalProducts) * 100).toFixed(0)
    : '0';

  const metricsData = [
    {
      icon: Package,
      label: 'Total Products',
      value: metrics.totalProducts,
      badge: { 
        color: 'info', 
        text: metrics.totalProducts > 0 ? 'Active' : 'Empty' 
      },
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: ShoppingBag,
      label: 'Total Users',
      value: metrics.totalUsers,
      badge: { 
        color: metrics.totalUsers > 0 ? 'success' : 'warning', 
        text: metrics.totalUsers > 0 ? 'Registered' : 'None' 
      },
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      iconColor: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Star,
      label: 'Average Rating',
      value: metrics.avgRating.toFixed(1),
      badge: { 
        color: metrics.avgRating >= 4 ? 'success' : metrics.avgRating >= 3 ? 'warning' : metrics.avgRating > 0 ? 'error' : 'info', 
        text: metrics.avgRating >= 4 ? 'Excellent' : metrics.avgRating >= 3 ? 'Good' : metrics.avgRating > 0 ? 'Fair' : 'No ratings'
      },
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      iconColor: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: TrendingUp,
      label: 'Total Reviews',
      value: metrics.totalReviews,
      badge: { 
        color: 'success', 
        text: `${avgReviewPerProduct}/product` 
      },
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      iconColor: 'text-green-600 dark:text-green-400'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            System-wide metrics and performance overview
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {metricsData.map((metric, index) => (
          <MetricCard
            key={index}
            icon={metric.icon}
            label={metric.label}
            value={metric.value}
            badge={metric.badge}
            bgColor={metric.bgColor}
            iconColor={metric.iconColor}
            isLoading={metrics.loading}
          />
        ))}
      </div>

      {!metrics.loading && (
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
          <span>Last updated: {new Date().toLocaleTimeString('vi-VN')}</span>
          <span>Engagement rate: {engagementRate}%</span>
        </div>
      )}
    </div>
  );
}
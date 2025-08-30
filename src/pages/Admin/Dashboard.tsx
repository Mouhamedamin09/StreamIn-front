import React, { useState, useEffect } from "react";
import {
  FaUsers,
  FaEye,
  FaPlay,
  FaSearch,
  FaGlobe,
  FaMobile,
  FaDesktop,
  FaTabletAlt,
  FaChartLine,
  FaClock,
  FaFire,
} from "react-icons/fa";

interface OverviewStats {
  totalViews: number;
  todayViews: number;
  totalSearches: number;
  todaySearches: number;
  uniqueUsers: number;
  todayUsers: number;
  totalVideoStarts: number;
  todayVideoStarts: number;
}

interface TopCountry {
  country: string;
  views: number;
}

interface PopularContent {
  movieId: string;
  movieTitle: string;
  category: string;
  views: number;
  searches: number;
}

interface RealtimeActivity {
  event: string;
  data: {
    movieTitle?: string;
    query?: string;
    page?: string;
  };
  location: {
    country: string;
    city: string;
  };
  timestamp: string;
}

interface RealtimeData {
  currentWatching: RealtimeActivity[];
  activeUsers: number;
}

const AdminDashboard: React.FC = () => {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [topCountries, setTopCountries] = useState<TopCountry[]>([]);
  const [popularContent, setPopularContent] = useState<PopularContent[]>([]);
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const API_BASE = "http://localhost:8080/api/admin";

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchRealtimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const [overviewRes, contentRes] = await Promise.all([
        fetch(`${API_BASE}/stats/overview`),
        fetch(`${API_BASE}/stats/popular-content`),
      ]);

      const overviewData = await overviewRes.json();
      const contentData = await contentRes.json();

      setOverview(overviewData.overview);
      setTopCountries(overviewData.topCountries);
      setPopularContent(contentData);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch(`${API_BASE}/stats/realtime`);
      const data = await response.json();
      setRealtimeData(data);
    } catch (error) {
      console.error("Failed to fetch realtime data:", error);
    }
  };

  const StatCard = ({
    title,
    value,
    icon,
    color = "blue",
  }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color?: "blue" | "green" | "purple" | "orange" | "red";
  }) => {
    const colorClasses = {
      blue: "bg-blue-500 text-white",
      green: "bg-green-500 text-white",
      purple: "bg-purple-500 text-white",
      orange: "bg-orange-500 text-white",
      red: "bg-red-500 text-white",
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div
            className={`p-3 rounded-full mr-4 ${colorClasses[color]} flex-shrink-0`}
          >
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
              {title}
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {typeof value === "number" ? value.toLocaleString() : value}
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor your streaming platform's performance and user activity
          </p>
        </div>

        {/* Overview Stats */}
        {overview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Views"
              value={overview.totalViews}
              icon={<FaEye />}
              color="blue"
            />
            <StatCard
              title="Today's Views"
              value={overview.todayViews}
              icon={<FaEye />}
              color="green"
            />
            <StatCard
              title="Video Starts"
              value={overview.totalVideoStarts}
              icon={<FaPlay />}
              color="purple"
            />
            <StatCard
              title="Today's Starts"
              value={overview.todayVideoStarts}
              icon={<FaPlay />}
              color="orange"
            />
            <StatCard
              title="Total Searches"
              value={overview.totalSearches}
              icon={<FaSearch />}
              color="blue"
            />
            <StatCard
              title="Today's Searches"
              value={overview.todaySearches}
              icon={<FaSearch />}
              color="green"
            />
            <StatCard
              title="Unique Users"
              value={overview.uniqueUsers}
              icon={<FaUsers />}
              color="purple"
            />
            <StatCard
              title="Today's Users"
              value={overview.todayUsers}
              icon={<FaUsers />}
              color="orange"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Popular Content */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaFire className="mr-2 text-orange-500" />
              Popular Content
            </h2>
            <div className="space-y-4">
              {popularContent.slice(0, 10).map((content, index) => (
                <div
                  key={content.movieId}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-blue-500 text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">
                        {content.movieTitle}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                        {content.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {content.views} views
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {content.searches} searches
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Countries */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FaGlobe className="mr-2 text-green-500" />
              Top Countries
            </h2>
            <div className="space-y-4">
              {topCountries.slice(0, 10).map((country, index) => (
                <div
                  key={country.country}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-3">
                    <span className="flex items-center justify-center w-6 h-6 bg-green-500 text-white text-xs font-bold rounded-full">
                      {index + 1}
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {country.country}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {country.views.toLocaleString()} views
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Real-time Activity */}
        {realtimeData && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                <FaClock className="mr-2 text-blue-500" />
                Real-time Activity
              </h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>{realtimeData.activeUsers} active users</span>
              </div>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {realtimeData.currentWatching
                .slice(0, 20)
                .map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {activity.event === "video_start" &&
                          activity.data.movieTitle
                            ? `Watching: ${activity.data.movieTitle}`
                            : activity.event === "search" && activity.data.query
                            ? `Searched: "${activity.data.query}"`
                            : activity.event === "page_view" &&
                              activity.data.page
                            ? `Viewing: ${activity.data.page}`
                            : activity.event}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {activity.location.city}, {activity.location.country}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

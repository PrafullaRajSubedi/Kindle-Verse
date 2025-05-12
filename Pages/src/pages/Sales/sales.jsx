import { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Calendar,
  BookOpen,
  TrendingUp,
  List,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
} from "lucide-react";
import { TbCurrencyRupeeNepalese } from "react-icons/tb";

// Sample data for the charts
const monthlySalesData = [
  { name: "Jan", sales: 4000 },
  { name: "Feb", sales: 3000 },
  { name: "Mar", sales: 5000 },
  { name: "Apr", sales: 2780 },
  { name: "May", sales: 1890 },
  { name: "Jun", sales: 6390 },
  { name: "Jul", sales: 3490 },
];

const topGenreData = [
  { name: "Fiction", value: 400 },
  { name: "Science", value: 300 },
  { name: "History", value: 300 },
  { name: "Biography", value: 200 },
  { name: "Self-help", value: 100 },
];

const topBooksData = [
  { name: "The Silent Echo", sales: 120 },
  { name: "Quantum Reality", sales: 98 },
  { name: "History of Time", sales: 86 },
  { name: "Desert Horizon", sales: 72 },
  { name: "The Last Letter", sales: 65 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function SalesAnalytics() {
  //const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("This Month");
  const [expandedSections, setExpandedSections] = useState({
    salesTrend: true,
    topGenres: true,
    topBooks: true,
  });

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const totalRevenue = monthlySalesData.reduce(
    (sum, item) => sum + item.sales,
    0
  );
  const totalSales = 783; // Sample total sales count

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
        <h2 className="text-xl font-bold dark:text-white">Sales Analytics</h2>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md dark:text-gray-200">
            <Filter size={14} />
            Filter
          </button>
          <button className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-md dark:text-gray-200">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Date Range Selector */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 flex justify-between items-center">
        <div className="flex items-center gap-2 dark:text-gray-200">
          <Calendar size={16} />
          <span className="text-sm font-medium">{dateRange}</span>
        </div>
        <select
          className="text-sm border-0 bg-transparent dark:text-gray-200 focus:ring-0 cursor-pointer"
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
          <option>This Quarter</option>
          <option>This Year</option>
        </select>
      </div>

      {/* Removed Tab Navigation */}

      {/* Content Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-4">
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Total Revenue
                </span>
                <TbCurrencyRupeeNepalese size={18} className="text-blue-500" />
              </div>
              <div className="mt-2">
                <h3 className="text-xl font-bold dark:text-white">
                  ₹{totalRevenue.toLocaleString()}
                </h3>
                <span className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp size={12} />
                  <span className="ml-1">+8.2% from last period</span>
                </span>
              </div>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Books Sold
                </span>
                <BookOpen size={18} className="text-purple-500" />
              </div>
              <div className="mt-2">
                <h3 className="text-xl font-bold dark:text-white">
                  {totalSales}
                </h3>
                <span className="text-xs text-green-500 flex items-center mt-1">
                  <TrendingUp size={12} />
                  <span className="ml-1">+5.3% from last period</span>
                </span>
              </div>
            </div>
          </div>

          {/* Sales Trend Chart */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection("salesTrend")}
            >
              <h3 className="text-sm font-medium dark:text-white">
                Sales Trend
              </h3>
              {expandedSections.salesTrend ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {expandedSections.salesTrend && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={monthlySalesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" tick={{ fill: "#9CA3AF" }} />
                    <YAxis tick={{ fill: "#9CA3AF" }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="sales"
                      stroke="#3B82F6"
                      strokeWidth={2}
                      dot={{
                        stroke: "#3B82F6",
                        strokeWidth: 2,
                        r: 4,
                        fill: "#3B82F6",
                      }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          {/* Top Genres Chart */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection("topGenres")}
            >
              <h3 className="text-sm font-medium dark:text-white">
                Top Genres by Sales
              </h3>
              {expandedSections.topGenres ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {expandedSections.topGenres && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <div className="flex justify-center">
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={topGenreData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {topGenreData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>

          {/* Top Books */}
          <div className="mb-6">
            <div
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection("topBooks")}
            >
              <h3 className="text-sm font-medium dark:text-white">
                Top Selling Books
              </h3>
              {expandedSections.topBooks ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </div>

            {expandedSections.topBooks && (
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border dark:border-gray-700">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={topBooksData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis type="number" tick={{ fill: "#9CA3AF" }} />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fill: "#9CA3AF" }}
                      width={100}
                    />
                    <Tooltip />
                    <Bar dataKey="sales" fill="#8884d8" radius={[0, 4, 4, 0]}>
                      {topBooksData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </>
      </div>
    </div>
  );
}

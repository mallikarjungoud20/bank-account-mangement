import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  FaBars,
  FaBell,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaUsers,
  FaSignOutAlt
} from "react-icons/fa";
import WeatherWidget from "../components/WeatherWidget";
import { ToastContext } from "../context/ToastContext";

function AdminDashboard() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const [stats, setStats] = useState({
    users: 0,
    deposit: 0,
    withdraw: 0
  });

  // Load admin name from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("adminName");
    if (stored) {
      setAdminName(stored);
    }
  }, []);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const storedNotifications = JSON.parse(localStorage.getItem("adminNotifications")) || [];
        setNotifications(storedNotifications);
      } catch (e) {
        console.error("Error loading notifications:", e);
      }
    };

    loadNotifications();
  }, []);

  // 🔥 FETCH DATA
  const fetchData = () => {
    fetch("http://127.0.0.1:8080/api/admin/users")
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setStats(prev => ({ ...prev, users: data.length }));
      });

    fetch("http://127.0.0.1:8080/api/admin/transactions")
      .then(res => res.json())
      .then(data => {
        setTransactions(data);

        let dep = 0;
        let wit = 0;

        data.forEach(t => {
          if (t.type === "Deposit") dep += t.amount;
          else if (t.type === "Withdraw") wit += t.amount;
        });

        setStats(prev => ({
          ...prev,
          deposit: dep,
          withdraw: wit
        }));
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 📊 CHART DATA
  const chartData = [
    { name: "Deposit", value: stats.deposit },
    { name: "Withdraw", value: stats.withdraw }
  ];

  // Clear all notifications
  const clearNotifications = () => {
    setNotifications([]);
    localStorage.removeItem("adminNotifications");
    showToast("Notifications cleared", "info");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.clear();
    showToast("Logged out successfully", "info");
    setTimeout(() => {
      navigate("/");
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ===== SIDEBAR ===== */}
      <div className={`${sidebarOpen ? "w-64" : "w-20"} bg-blue-900 text-white flex flex-col shadow-xl transition-all duration-300 fixed h-screen`}>
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-blue-800">
          <h1 className="text-2xl">🏦</h1>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="hover:bg-blue-800 p-2 rounded">
            <FaBars />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2">
          <Link to="/admin" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition bg-blue-800">
            <FaTachometerAlt className="text-lg" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/admin/users" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition">
            <FaUsers className="text-lg" />
            {sidebarOpen && <span>User Management</span>}
          </Link>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-blue-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-4 w-full p-3 rounded-lg hover:bg-red-600 transition bg-red-500 text-white font-semibold"
          >
            <FaSignOutAlt className="text-lg" />
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-20"} flex-1 flex flex-col transition-all duration-300`}>

        {/* ===== TOP NAVBAR ===== */}
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="px-6 py-4 flex items-center justify-between">
            
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-gray-800">🏦 My Bank Admin</h2>
            </div>

            <div className="flex items-center gap-6">
              {/* Weather Widget */}
              <div className="hidden md:block">
                <WeatherWidget />
              </div>

              {/* Notifications Bell */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-gray-600 hover:text-blue-600 text-xl transition"
                >
                  <FaBell />
                  {notifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Notifications</h3>
                      {notifications.length > 0 && (
                        <button
                          onClick={clearNotifications}
                          className="text-sm text-red-500 hover:text-red-700 font-semibold"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="p-4 text-center text-gray-500 text-sm">No notifications</p>
                      ) : (
                        notifications.slice().reverse().map((notif, idx) => (
                          <div key={idx} className="p-4 border-b border-gray-100 hover:bg-blue-50 transition">
                            <p className="text-sm text-gray-800">{notif.message}</p>
                            <p className="text-xs text-gray-400 mt-1">{notif.date}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile */}
              <button
                onClick={() => navigate("/admin-profile")}
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold hover:bg-blue-700 transition"
                title="Admin Profile"
              >
                {adminName.charAt(0).toUpperCase()}
              </button>
            </div>
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">

            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {adminName} 👋
              </h1>
              <p className="text-gray-500 mt-2">Here's your bank management overview</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-100 text-sm font-semibold">Total Users</p>
                    <p className="text-4xl font-bold mt-2">{stats.users}</p>
                  </div>
                  <FaUsers className="text-5xl opacity-20" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-600 to-green-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-semibold">Total Deposits</p>
                    <p className="text-4xl font-bold mt-2">₹ {stats.deposit.toLocaleString()}</p>
                  </div>
                  <FaExchangeAlt className="text-5xl opacity-20" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-600 to-red-800 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition transform hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-100 text-sm font-semibold">Total Withdrawals</p>
                    <p className="text-4xl font-bold mt-2">₹ {stats.withdraw.toLocaleString()}</p>
                  </div>
                  <FaExchangeAlt className="text-5xl opacity-20" />
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6">Transaction Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹ ${value.toLocaleString()}`} />
                  <Bar dataKey="value" fill="#2563eb" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;
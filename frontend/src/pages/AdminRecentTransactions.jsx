import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaExchangeAlt,
  FaSignOutAlt,
  FaBell,
  FaTimes
} from "react-icons/fa";
import WeatherWidget from "../components/WeatherWidget";
import { ToastContext } from "../context/ToastContext";

function AdminRecentTransactions() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [transactions, setTransactions] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);

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

  // 🔥 FETCH TRANSACTIONS
  const fetchTransactions = () => {
    fetch("http://127.0.0.1:8080/api/admin/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data));
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  // 👤 HANDLE USER CLICK - Fetch user details
  const handleUserClick = async (userId) => {
    try {
      const res = await fetch(`http://127.0.0.1:8080/api/users/${userId}`);
      if (res.ok) {
        const user = await res.json();
        setSelectedUser(user);

        // Filter transactions for this user
        const filtered = transactions.filter(t => t.userId === userId || t.receiverId === userId);
        setUserTransactions(filtered);
      }
    } catch (err) {
      showToast("Error loading user details", "error");
      console.error("Error fetching user:", err);
    }
  };

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
          <Link to="/admin" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition">
            <FaTachometerAlt className="text-lg" />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>

          <Link to="/admin/users" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition">
            <FaUsers className="text-lg" />
            {sidebarOpen && <span>User Management</span>}
          </Link>

          <Link to="/admin/transactions" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition bg-blue-800">
            <FaExchangeAlt className="text-lg" />
            {sidebarOpen && <span>Transactions</span>}
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

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Recent Transactions
              </h1>
              <p className="text-gray-500 mt-2">View all system transactions</p>
            </div>

            {/* User Details Modal */}
            {selectedUser && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
                  
                  {/* Modal Header */}
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
                    <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
                    <button
                      onClick={() => setSelectedUser(null)}
                      className="text-gray-500 hover:text-gray-700 text-2xl"
                    >
                      <FaTimes />
                    </button>
                  </div>

                  {/* User Info */}
                  <div className="p-6 border-b border-gray-200">
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="text-xl font-semibold text-gray-800">{selectedUser.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Account Number</p>
                        <p className="text-xl font-semibold text-gray-800">{selectedUser.accountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Balance</p>
                        <p className="text-xl font-semibold text-green-600">₹ {selectedUser.balance?.toLocaleString() || "0"}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Status</p>
                        <p className={`text-xl font-semibold ${selectedUser.frozen ? "text-red-600" : "text-green-600"}`}>
                          {selectedUser.frozen ? "Frozen ❄️" : "Active ✅"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* User Transactions */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Transactions ({userTransactions.length})</h3>
                    {userTransactions.length === 0 ? (
                      <p className="text-gray-500 text-center">No transactions for this user</p>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left p-2 font-semibold text-gray-700">ID</th>
                              <th className="text-left p-2 font-semibold text-gray-700">Type</th>
                              <th className="text-right p-2 font-semibold text-gray-700">Amount</th>
                              <th className="text-center p-2 font-semibold text-gray-700">Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userTransactions.map((t) => (
                              <tr key={t.id} className="border-t border-gray-200 hover:bg-gray-50">
                                <td className="p-2 text-gray-800">#{t.id}</td>
                                <td className="p-2 text-gray-600">{t.type}</td>
                                <td className="p-2 text-right text-gray-800 font-semibold">₹ {t.amount?.toLocaleString() || "0"}</td>
                                <td className="p-2 text-center">
                                  <span className={`px-2 py-1 rounded text-xs font-semibold text-white ${
                                    t.status === "SUCCESS" ? "bg-green-500" : t.status === "FAILED" ? "bg-red-500" : "bg-yellow-500"
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {/* Back Button */}
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                      >
                        Back to Transactions
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* Transactions Section */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">All Transactions</h2>
                <span className="text-sm text-gray-500">Total: {transactions.length}</span>
              </div>

              {/* Transactions Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-300">
                    <tr>
                      <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                      <th className="text-left p-3 font-semibold text-gray-700">User</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Type</th>
                      <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                      <th className="text-left p-3 font-semibold text-gray-700">Receiver</th>
                      <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="p-4 text-center text-gray-500">No transactions found</td>
                      </tr>
                    ) : (
                      transactions.map((t) => (
                        <tr key={t.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                          <td className="p-3 text-gray-800 font-medium">#{t.id}</td>
                          <td className="p-3">
                            <button
                              onClick={() => handleUserClick(t.userId || t.id)}
                              className="text-blue-600 hover:underline font-semibold hover:text-blue-800 transition"
                            >
                              {t.userName || "User " + t.userId}
                            </button>
                          </td>
                          <td className="p-3 text-gray-600 font-semibold">
                            {t.type === "Deposit" && "📥"}
                            {t.type === "Withdraw" && "📤"}
                            {t.type === "Transfer" && "🔄"}
                            {" "}{t.type}
                          </td>
                          <td className="p-3 text-right text-gray-800 font-semibold">₹ {t.amount.toLocaleString()}</td>
                          <td className="p-3 text-gray-600">{t.receiver || "-"}</td>
                          <td className="p-3 text-center">
                            <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                              t.status === "SUCCESS"
                                ? "bg-green-500"
                                : t.status === "FAILED"
                                ? "bg-red-500"
                                : "bg-yellow-500"
                            }`}>
                              {t.status === "SUCCESS" && "✅"} {t.status === "FAILED" && "❌"} {t.status === "PENDING" && "⏳"} {t.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminRecentTransactions;

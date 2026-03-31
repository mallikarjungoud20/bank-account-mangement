import { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaBars,
  FaTachometerAlt,
  FaUsers,
  FaSignOutAlt,
  FaBell,
  FaArrowLeft
} from "react-icons/fa";
import WeatherWidget from "../components/WeatherWidget";
import { ToastContext } from "../context/ToastContext";

function AdminUsers() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userTransactions, setUserTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

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

  // 🔥 FETCH USERS AND TRANSACTIONS
  const fetchData = () => {
    fetch("http://127.0.0.1:8080/api/admin/users")
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error("Error fetching users:", err));

    fetch("http://127.0.0.1:8080/api/admin/transactions")
      .then(res => res.json())
      .then(data => setTransactions(data))
      .catch(err => console.error("Error fetching transactions:", err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 🔍 FILTER USERS
  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.accountNumber.includes(search)
  );

  // ❄️ FREEZE / UNFREEZE
  const toggleFreeze = async (id, isFrozen) => {
    const url = isFrozen
      ? `http://127.0.0.1:8080/api/admin/unfreeze/${id}`
      : `http://127.0.0.1:8080/api/admin/freeze/${id}`;

    await fetch(url, { method: "PUT" });
    fetchData(); // Refresh both users and transactions
    showToast(isFrozen ? "Account unfrozen ✅" : "Account frozen ❄️", "success");
  };

  // 👤 VIEW USER TRANSACTIONS
const handleViewTransactions = (user) => {
  setSelectedUser(user);

  const filtered = transactions.filter(
    (t) =>
      t.phone?.toString().trim() ===
      user.phone?.toString().trim()
  );

  console.log("USER PHONE:", user.phone);
  console.log("ALL TRANSACTIONS:", transactions);
  console.log("FILTERED:", filtered);

  setUserTransactions(filtered);
};
  // 🔙 BACK TO USERS
  const handleBackToUsers = () => {
    setSelectedUser(null);
    setUserTransactions([]);
    setSearch("");
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

          <Link to="/admin/users" className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-800 transition bg-blue-800">
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

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                {selectedUser ? `Transactions of ${selectedUser.name}` : "User Management"}
              </h1>
              <p className="text-gray-500 mt-2">
                {selectedUser ? "View this user's transaction history" : "Manage and monitor user accounts"}
              </p>
            </div>

            {/* Back to Users Button - Show when viewing transactions */}
            {selectedUser && (
              <div className="mb-6">
                <button
                  onClick={handleBackToUsers}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white font-semibold transition"
                >
                  <FaArrowLeft /> Back to Users
                </button>
              </div>
            )}

            {/* USERS TABLE - Show when selectedUser is null */}
            {!selectedUser ? (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">All Users</h2>
                  <span className="text-sm text-gray-500">Total: {filteredUsers.length}</span>
                </div>

                {/* Search Box */}
                <input
                  type="text"
                  placeholder="Search by name or account number..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                />

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-300">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Name</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Account Number</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Balance</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Transactions</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan="7" className="p-4 text-center text-gray-500">No users found</td>
                        </tr>
                      ) : (
                        filteredUsers.map((u) => (
                          <tr key={u.id} className="border-b border-gray-200 hover:bg-blue-50 transition">
                            <td className="p-3 text-gray-800 font-medium">#{u.id}</td>
                            <td className="p-3">
                              <button
                                onClick={() => handleViewTransactions(u)}
                                className="text-blue-600 hover:underline font-semibold hover:text-blue-800 transition cursor-pointer"
                              >
                                {u.name}
                              </button>
                            </td>
                            <td className="p-3 text-gray-600">{u.accountNumber}</td>
                            <td className="p-3 text-right text-gray-800 font-semibold">₹ {u.balance.toLocaleString()}</td>
                            <td className="p-3 text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                u.frozen ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                              }`}>
                                {u.frozen ? "Frozen" : "Active"}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => handleViewTransactions(u)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg font-semibold transition text-sm"
                              >
                                View
                              </button>
                            </td>
                            <td className="p-3 text-center">
                              <button
                                onClick={() => toggleFreeze(u.id, u.frozen)}
                                className={`px-4 py-2 rounded-lg text-white font-semibold transition ${
                                  u.frozen
                                    ? "bg-green-500 hover:bg-green-600"
                                    : "bg-red-500 hover:bg-red-600"
                                }`}
                              >
                                {u.frozen ? "Unfreeze" : "Freeze"}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* USER TRANSACTIONS TABLE - Show when selectedUser is selected */
              <div className="bg-white rounded-xl shadow-md p-6">
                {/* User Details Section */}
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Name</p>
                      <p className="text-2xl font-bold text-gray-800">{selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Account Number</p>
                      <p className="text-2xl font-bold text-gray-800">{selectedUser.accountNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Balance</p>
                      <p className="text-2xl font-bold text-green-600">₹ {selectedUser.balance.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className={`text-2xl font-bold ${selectedUser.frozen ? "text-red-600" : "text-green-600"}`}>
                        {selectedUser.frozen ? "Frozen ❄️" : "Active ✅"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Transactions Table */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    Transactions ({userTransactions.length})
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-300">
                      <tr>
                        <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Date</th>
                        <th className="text-left p-3 font-semibold text-gray-700">Type</th>
                        <th className="text-right p-3 font-semibold text-gray-700">Amount</th>
                        <th className="text-center p-3 font-semibold text-gray-700">Status</th>
                      </tr>
                    </thead>

                    <tbody>
                      {userTransactions.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="p-4 text-center text-gray-500">No transactions found for this user</td>
                        </tr>
                      ) : (
                        userTransactions.map((t) => (
                          <tr key={t.id} className="border-b border-gray-200 hover:bg-gray-50 transition">
                            <td className="p-3 text-gray-800 font-medium">#{t.id}</td>
                            <td className="p-3 text-gray-600">{t.date || "N/A"}</td>
                            <td className="p-3 text-gray-600 font-semibold">
                              {t.type === "Deposit" && "📥"}
                              {t.type === "Withdraw" && "📤"}
                              {t.type === "Transfer" && "🔄"}
                              {" "}{t.type}
                            </td>
                            <td className="p-3 text-right text-gray-800 font-semibold">₹ {t.amount.toLocaleString()}</td>
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
            )}

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminUsers;

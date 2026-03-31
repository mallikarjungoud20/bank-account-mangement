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

function AdminProfile() {
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [adminName, setAdminName] = useState("Admin");
  const [adminEmail, setAdminEmail] = useState("admin@bankapp.com");
  const [adminPhone, setAdminPhone] = useState("1234567890");
  const [editMode, setEditMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load admin data from localStorage
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

  const handleSaveProfile = () => {
    localStorage.setItem("adminName", adminName);
    setEditMode(false);
    showToast("Profile updated successfully ✅", "success");
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
              <button
                onClick={() => navigate("/admin")}
                className="text-gray-600 hover:text-blue-600 transition"
              >
                <FaArrowLeft className="text-xl" />
              </button>
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
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                {adminName.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* ===== CONTENT AREA ===== */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">

            {/* Welcome Section */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Admin Profile
              </h1>
              <p className="text-gray-500 mt-2">Manage your administrator profile and settings</p>
            </div>

            {/* Profile Card */}
            <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl">
              
              {/* Profile Avatar */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-white flex items-center justify-center text-5xl font-bold">
                  {adminName.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Profile Information */}
              <div className="space-y-6">

                {/* Admin Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Admin Name
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={adminName}
                      onChange={(e) => setAdminName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-semibold">
                      {adminName}
                    </p>
                  )}
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-semibold">
                    {adminEmail}
                  </p>
                </div>

                {/* Admin Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-semibold">
                    {adminPhone}
                  </p>
                </div>

                {/* Account Status */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Account Status
                  </label>
                  <p className="p-3 bg-green-50 rounded-lg">
                    <span className="text-green-700 font-semibold">✅ Active (Administrator)</span>
                  </p>
                </div>

                {/* Role */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Role
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-semibold">
                    System Administrator
                  </p>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex gap-4">
                {editMode ? (
                  <>
                    <button
                      onClick={handleSaveProfile}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-3 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditMode(true)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mt-8 max-w-2xl">
              <h3 className="font-bold text-blue-900 mb-2">Administrator Panel</h3>
              <p className="text-blue-800 text-sm">
                You have full administrative access to the banking system. Use this power responsibly.
                All your actions are logged and monitored for security purposes.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminProfile;

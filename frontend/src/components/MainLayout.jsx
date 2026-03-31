import { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import WeatherWidget from "./WeatherWidget";

import {
  FaBars,
  FaTachometerAlt,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaHistory,
  FaSignOutAlt,
  FaUserShield,
  FaBell
} from "react-icons/fa";

function MainLayout() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);

  const role = localStorage.getItem("role");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      setUser(storedUser);
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
  }, []);

  // Load notifications from localStorage
  useEffect(() => {
    const loadNotifications = () => {
      try {
        const storedNotifications = JSON.parse(localStorage.getItem("notifications")) || [];
        setNotifications(storedNotifications);
      } catch (e) {
        console.error("Error loading notifications:", e);
      }
    };

    loadNotifications();

    // Listen for userUpdated event to reload notifications
    const handleUserUpdated = () => {
      loadNotifications();
    };

    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-200">

      {/* 🔵 SIDEBAR */}
      <div className={`bg-blue-900 text-white flex flex-col p-4 ${open ? "w-56" : "w-20"}`}>
        <h2 className="text-lg font-semibold mb-6">
          {open ? "Menu" : "M"}
        </h2>

        {role !== "admin" && (
          <>
            <Link to="/dashboard" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
              <FaTachometerAlt /> {open && "Dashboard"}
            </Link>

            <Link to="/deposit" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
              <FaMoneyBillWave /> {open && "Deposit"}
            </Link>

            <Link to="/withdraw" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
              <FaMoneyBillWave /> {open && "Withdraw"}
            </Link>

            <Link to="/transfer" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
              <FaExchangeAlt /> {open && "Transfer"}
            </Link>

            <Link to="/transactions" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
              <FaHistory /> {open && "Transactions"}
            </Link>
          </>
        )}

        {role === "admin" && (
          <Link to="/admin" className="flex items-center gap-3 p-3 hover:bg-blue-800 rounded">
            <FaUserShield /> {open && "Admin Dashboard"}
          </Link>
        )}

        {/* LOGOUT */}
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
          className="mt-auto flex items-center gap-3 p-3 bg-red-500 hover:bg-red-600 rounded"
        >
          <FaSignOutAlt /> {open && "Logout"}
        </button>
      </div>

      {/* 🔷 MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* 🔝 TOP BAR */}
        <div className="flex justify-between items-center p-4 bg-white shadow">

          {/* LEFT */}
          <div className="flex items-center gap-4">
            <button onClick={() => setOpen(!open)} className="text-xl">
              <FaBars />
            </button>

            <div className="flex items-center gap-2">
              <span className="text-2xl">🏦</span>
              <h1 className="text-xl font-bold text-blue-800">
                My Bank
              </h1>
            </div>

            <WeatherWidget />
          </div>

          {/* RIGHT → NOTIFICATION BELL + PROFILE ICON */}
          <div className="flex items-center gap-6">
            {/* NOTIFICATION BELL */}
            <div className="relative">
              <button
                onClick={() => setShowNotif(!showNotif)}
                className="text-2xl text-blue-900 hover:text-blue-700 relative transition"
              >
                <FaBell />
                {notifications.length > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {notifications.length}
                  </span>
                )}
              </button>

              {/* NOTIFICATION DROPDOWN */}
              {showNotif && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 border border-gray-200">
                  <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <span className="font-semibold text-gray-800">Notifications</span>
                    {notifications.length > 0 && (
                      <button
                        onClick={() => {
                          localStorage.removeItem("notifications");
                          setNotifications([]);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 hover:underline transition font-medium"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      <ul>
                        {notifications.slice(0, 5).map((notif, index) => (
                          <li
                            key={index}
                            className="p-4 border-b border-gray-100 hover:bg-gray-50 transition"
                          >
                            <div className="text-gray-800 text-sm">{notif.message}</div>
                            <div className="text-gray-400 text-xs mt-1">{notif.time}</div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* PROFILE ICON */}
            <Link to="/profile">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-white flex items-center justify-center text-lg font-bold shadow cursor-pointer hover:bg-blue-800 transition">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
            </Link>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </div>

      </div>
    </div>
  );
}

export default MainLayout;
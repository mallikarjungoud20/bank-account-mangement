import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import AdminUsers from "./pages/AdminUsers";
import AdminProfile from "./pages/AdminProfile";
import EditProfile from "./pages/EditProfile";
import ChangePassword from "./pages/ChangePassword";
import SecuritySettings from "./pages/SecuritySettings";

import MainLayout from "./components/MainLayout";
import Toast from "./components/Toast";
import { ToastProvider } from "./context/ToastContext";

function App() {
  return (
    <ToastProvider>
      <Toast />
      <Router>
        <Routes>

          {/* PUBLIC */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ✅ ADMIN ROUTES */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin-profile" element={<AdminProfile />} />

          {/* ✅ USER APP (FIXED NESTED ROUTES) */}
          <Route path="/" element={<MainLayout />}>
          <Route path="/edit-profile" element={<EditProfile />} />
<Route path="/change-password" element={<ChangePassword />} />
<Route path="/security" element={<SecuritySettings />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="deposit" element={<Deposit />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transfer" element={<Transfer />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />

          </Route>

        </Routes>
      </Router>
    </ToastProvider>
  );
}

export default App;
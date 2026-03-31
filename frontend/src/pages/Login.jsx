import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BankHeader from "../components/BankHeader";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function Login() {
  const navigate = useNavigate();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const [tab, setTab] = useState("userid");

  const handleLogin = async () => {
    if (!phone || !password) {
      setMessage("Please fill in all fields ❌");
      return;
    }

    // 🔥 ADMIN LOGIN
    if (role === "admin") {
      if (phone === "admin" && password === "1234") {
        setMessage("Admin Login Successful ✅");
        setTimeout(() => {
          navigate("/admin");
        }, 1500);
      } else {
        setMessage("Invalid Admin Credentials ❌");
      }
      return;
    }

    try {
      const res = await axios.post("http://localhost:8080/api/login", {
        phone,
        password
      });

      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }

      setMessage("Login Successful ✅");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);

    } catch (err) {
      const errorMsg =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Login failed ❌";

      setMessage(errorMsg);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <BankHeader />

      {/* Main Content - Scrollable Below Fixed Header */}
      <div className="pt-20 min-h-screen bg-gray-100">
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] py-12 px-4">
          <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* LEFT SECTION - LOGIN FORM */}
            <div className="flex flex-col justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6">
                
                {/* Title */}
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">
                    Login to Your Account
                  </h2>
                  <p className="text-gray-600">Access your bank account securely</p>
                </div>

                {/* Login Tabs */}
                <div className="flex gap-4 border-b border-gray-200">
                  <button
                    onClick={() => setTab("userid")}
                    className={`pb-3 px-2 font-semibold transition ${
                      tab === "userid"
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    User ID
                  </button>
                  <button
                    onClick={() => setTab("debitcard")}
                    className={`pb-3 px-2 font-semibold transition ${
                      tab === "debitcard"
                        ? "text-blue-700 border-b-2 border-blue-700"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Debit Card
                  </button>
                </div>

                {/* Role Selection */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setRole("user")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      role === "user"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    User
                  </button>
                  <button
                    onClick={() => setRole("admin")}
                    className={`flex-1 py-2 px-4 rounded-lg font-semibold transition ${
                      role === "admin"
                        ? "bg-blue-700 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    Admin
                  </button>
                </div>

                {/* Messages */}
                {message && (
                  <div
                    className={`p-4 rounded-lg text-center font-semibold ${
                      message.includes("❌")
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Phone Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {role === "admin" ? "Admin ID" : "Phone Number"}
                  </label>
                  <input
                    type="text"
                    placeholder={role === "admin" ? "Enter Admin ID" : "Enter Phone Number"}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  />
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <AiOutlineEyeInvisible size={20} />
                      ) : (
                        <AiOutlineEye size={20} />
                      )}
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a href="#" className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
                    Forgot Password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-blue-700 to-blue-800 text-white py-3 rounded-lg font-bold hover:from-blue-800 hover:to-blue-900 transition shadow-lg"
                >
                  Login
                </button>

                {/* Register Link */}
                <p className="text-center text-gray-600">
                  Don't have an account?{" "}
                  <span
                    onClick={() => navigate("/register")}
                    className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                  >
                    Register Here
                  </span>
                </p>

                {/* Security Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-700">
                  <p className="font-semibold">🔒 Security Notice</p>
                  <p>We never ask for your PIN or password in email or phone calls.</p>
                </div>
              </div>
            </div>

            {/* RIGHT SECTION - WELCOME MESSAGE */}
            <div className="hidden lg:flex flex-col justify-center items-center text-center space-y-6 p-8 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-6xl">🏦</div>
              <h3 className="text-3xl font-bold text-gray-900">
                Welcome to My Bank
              </h3>
              <p className="text-xl text-gray-700 mb-4">
                Secure Internet Banking at Your Fingertips
              </p>

              {/* Features */}
              <div className="space-y-4 text-left w-full">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <div>
                    <p className="font-semibold text-gray-900">Fast Transactions</p>
                    <p className="text-sm text-gray-600">Transfer money instantly</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <div>
                    <p className="font-semibold text-gray-900">24/7 Access</p>
                    <p className="text-sm text-gray-600">Banking anytime, anywhere</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-700 text-white rounded-full flex items-center justify-center font-bold">✓</div>
                  <div>
                    <p className="font-semibold text-gray-900">Secure & Safe</p>
                    <p className="text-sm text-gray-600">Bank-level encryption</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default Login;

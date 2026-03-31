import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import BankHeader from "../components/BankHeader";

function Register() {
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    deposit: "",
    pin: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // 🔒 PASSWORD VALIDATION (BANK LEVEL)
  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(password);
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!form.name.trim()) newErrors.name = "Name is required";
      if (!form.email.trim()) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "Invalid email format";
      if (!form.phone.trim()) newErrors.phone = "Phone is required";
      else if (form.phone.length < 10) newErrors.phone = "Phone must be at least 10 digits";
    } else if (step === 2) {
      if (!form.password) newErrors.password = "Password is required";
      else if (!validatePassword(form.password)) {
        newErrors.password = "Password must contain: 8+ chars, uppercase, lowercase, number, special char";
      }
      if (form.password !== form.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
      if (!form.pin.trim()) newErrors.pin = "PIN is required";
      else if (!/^\d{4}$/.test(form.pin)) newErrors.pin = "PIN must be exactly 4 digits";
    } else if (step === 3) {
      const deposit = Number(form.deposit);
      if (!form.deposit) newErrors.deposit = "Deposit amount is required";
      else if (deposit < 1000) newErrors.deposit = "Minimum deposit should be ₹1000";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateStep(3)) return;

    try {
      const res = await axios.post("http://localhost:8080/api/register", {
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password,
        pin: form.pin,
        balance: Number(form.deposit)
      });

      console.log("Saved User:", res.data);

      setMessage("Account Created Successfully ✅");

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      const errorMsg =
        typeof err.response?.data === "string"
          ? err.response.data
          : "Registration failed ❌";

      setMessage(errorMsg);
    }
  };

  return (
    <>
      <BankHeader />

      {/* Main Content - Scrollable Below Fixed Header */}
      <div className="pt-20 min-h-screen bg-gray-100 pb-12 px-4">
        <div className="flex items-center justify-center">
          <div className="w-full max-w-2xl">
            
            {/* Step Indicators */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition ${
                        step <= currentStep
                          ? "bg-blue-700 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                    >
                      {step}
                    </div>
                    {step < 3 && (
                      <div
                        className={`flex-1 h-1 mx-2 transition ${
                          step < currentStep ? "bg-blue-700" : "bg-gray-300"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs font-semibold text-gray-600">
                <span>Personal Details</span>
                <span>Security</span>
                <span>Confirmation</span>
              </div>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              
              {/* Title */}
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Create Your Account
                </h2>
                <p className="text-gray-600">Step {currentStep} of 3 - {
                  currentStep === 1 ? "Personal Details" :
                  currentStep === 2 ? "Security Setup" :
                  "Confirm & Complete"
                }</p>
              </div>

              {/* Error/Success Messages */}
              {message && (
                <div
                  className={`p-4 rounded-lg text-center font-semibold mb-6 ${
                    message.includes("❌")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <form onSubmit={handleRegister} className="space-y-6">
                
                {/* STEP 1: PERSONAL DETAILS */}
                {currentStep === 1 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.name ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.email ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.phone ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                )}

                {/* STEP 2: SECURITY */}
                {currentStep === 2 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Password
                      </label>
                      <input
                        type="password"
                        name="password"
                        placeholder="Create a strong password"
                        value={form.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.password ? (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                      ) : (
                        <p className="text-xs text-gray-600 mt-2">
                          • 8+ characters • Uppercase & lowercase • Number • Special character
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter your password"
                        value={form.confirmPassword}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.confirmPassword && <p className="text-red-600 text-sm mt-1">{errors.confirmPassword}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        4-Digit Transaction PIN
                      </label>
                      <input
                        type="password"
                        name="pin"
                        placeholder="Enter 4 digits"
                        maxLength="4"
                        value={form.pin}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.pin ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.pin ? (
                        <p className="text-red-600 text-sm mt-1">{errors.pin}</p>
                      ) : (
                        <p className="text-xs text-gray-600 mt-2">Required for transactions</p>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 3: CONFIRMATION */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Initial Deposit Amount
                      </label>
                      <input
                        type="number"
                        name="deposit"
                        placeholder="Enter amount (Min ₹1000)"
                        value={form.deposit}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                          errors.deposit ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors.deposit && <p className="text-red-600 text-sm mt-1">{errors.deposit}</p>}
                    </div>

                    {/* Review Summary */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 space-y-3 mt-6">
                      <h4 className="font-bold text-gray-900">Review Your Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-semibold">Name:</span> {form.name}</p>
                        <p><span className="font-semibold">Email:</span> {form.email}</p>
                        <p><span className="font-semibold">Phone:</span> {form.phone}</p>
                        <p><span className="font-semibold">Initial Deposit:</span> ₹{form.deposit || "0"}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-xs text-blue-700">
                      <p className="font-semibold">🔒 Security Notice</p>
                      <p className="mt-2">Your PIN is confidential and never shared. Keep it secure at all times.</p>
                    </div>
                  </div>
                )}

                {/* Buttons */}
                <div className="flex gap-4 mt-8 pt-4 border-t">
                  {currentStep > 1 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                  )}
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 px-6 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-700 to-blue-800 text-white rounded-lg font-semibold hover:from-blue-800 hover:to-blue-900 transition shadow-lg"
                    >
                      Create Account
                    </button>
                  )}
                </div>
              </form>

              {/* Back to Login */}
              <p className="text-center text-gray-600 mt-6">
                Already have an account?{" "}
                <span
                  onClick={() => navigate("/")}
                  className="text-blue-600 hover:text-blue-700 font-bold cursor-pointer"
                >
                  Login Here
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Register;

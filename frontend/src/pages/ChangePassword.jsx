import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../utils/notification";
import { ToastContext } from "../context/ToastContext";

function ChangePassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  const handleChangePassword = () => {
    if (!password || !confirmPassword) {
      showToast("Please fill all fields ❌", "error");
      return;
    }

    if (password !== confirmPassword) {
      showToast("Passwords do not match ❌", "error");
      return;
    }

    const user = JSON.parse(localStorage.getItem("user"));

    fetch(`http://localhost:8080/api/users/${user.id}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorMsg = await res.text();
          throw new Error(errorMsg || "Failed to update password");
        }
        return res.json();
      })
      .then(() => {
        showToast("Password updated ✅", "success");
        addNotification("🔐 Password changed");
        navigate("/profile");
      })
      .catch((err) => showToast(err.message || "Error updating password ❌", "error"));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80 flex flex-col gap-4">

        {/* TITLE */}
        <h2 className="text-lg font-semibold text-blue-800 select-none">
          Change Password
        </h2>

        {/* NEW PASSWORD */}
        <input
          type="password"
          placeholder="New Password"
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* CONFIRM PASSWORD */}
        <input
          type="password"
          placeholder="Confirm Password"
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* BUTTON */}
        <button
          onClick={handleChangePassword}
          className="bg-blue-800 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Update Password
        </button>

      </div>
    </div>
  );
}

export default ChangePassword;
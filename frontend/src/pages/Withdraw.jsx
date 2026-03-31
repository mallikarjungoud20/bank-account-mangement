import { useState, useEffect, useContext } from "react";
import "../styles.css";
import { addNotification } from "../utils/notification";
import { ToastContext } from "../context/ToastContext";

function Withdraw() {
  const [amount, setAmount] = useState("");
  const [user, setUser] = useState(null);

  const [pinInput, setPinInput] = useState("");
  const [showPinBox, setShowPinBox] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleWithdrawClick = () => {
    if (!amount || amount <= 0) {
      showToast("Enter valid amount ❌", "error");
      return;
    }
    setShowPinBox(true);
    setError("");
  };

  const handleVerifyPin = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ safety check
    if (!storedUser) {
      showToast("User not found ❌", "error");
      return;
    }

    if (pinInput !== storedUser.pin) {
      setError("Incorrect PIN ❌");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phone: storedUser.phone,
          amount: parseFloat(amount)
        })
      });

      // ✅ check response
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const data = await res.json();

      // ✅ update user (balance updated)
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data); // 🔥 IMPORTANT (refresh UI)

      window.dispatchEvent(new Event("userUpdated"));
      // 🔔 Notifications
      const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

      notifications.unshift({
        message: `💸 ₹${amount} withdrawn`,
        time: new Date().toLocaleString()
      });

      localStorage.setItem("notifications", JSON.stringify(notifications));

      addNotification("💸 Amount withdrawn successfully");
      showToast("Withdraw Successful ✅", "success");

      setAmount("");
      setPinInput("");
      setShowPinBox(false);

    } catch (err) {
      console.error(err);
      showToast(err.message || "Backend error ❌", "error");
    }
  };

  if (!user) return <h3>No user logged in</h3>;

  return (
    <div className="page-container">

      <div className="form-card">
        <h2>Withdraw Money</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button onClick={handleWithdrawClick} className="button">
          Withdraw Amount
        </button>
      </div>

      {showPinBox && (
        <div className="overlay">
          <div className="pin-card">

            <h3>🔐 Enter PIN</h3>

            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              maxLength="4"
              className="input"
            />

            {error && <p className="error">{error}</p>}

            <button onClick={handleVerifyPin} className="button">
              Confirm Withdraw
            </button>

            <button onClick={() => setShowPinBox(false)}>
              Cancel
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Withdraw;
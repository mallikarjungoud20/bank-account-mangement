import { useState, useEffect, useContext } from "react";
import "../styles.css";
import { addNotification } from "../utils/notification";
import { ToastContext } from "../context/ToastContext";

function Deposit() {
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

  const handleDepositClick = () => {
    if (!amount || amount <= 0) {
      showToast("Enter valid amount ❌", "error");
      return;
    }

    setShowPinBox(true);
    setError("");
  };

 const handleVerifyPin = async () => {
  const storedUser = JSON.parse(localStorage.getItem("user"));

  if (!storedUser) {
    showToast("User not found ❌", "error");
    return;
  }

  try {
    // ✅ STEP 1: VERIFY PIN FROM BACKEND
    await fetch("http://localhost:8080/api/verify-pin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: storedUser.phone,
        pin: pinInput
      })
    }).then(async (res) => {
      if (!res.ok) {
        throw new Error("Incorrect PIN ❌");
      }
    });

    // ✅ STEP 2: IF PIN CORRECT → DO DEPOSIT
    const res = await fetch("http://localhost:8080/api/deposit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        phone: storedUser.phone,
        amount: parseFloat(amount)
      })
    });

    if (!res.ok) {
      const msg = await res.text();
      throw new Error(msg);
    }

    const data = await res.json();

    // ✅ update user
    localStorage.setItem("user", JSON.stringify(data));
    setUser(data);

    window.dispatchEvent(new Event("userUpdated"));

    // 🔔 notification
    const notifications =
      JSON.parse(localStorage.getItem("notifications")) || [];

    notifications.unshift({
      message: `💰 ₹${amount} deposited`,
      time: new Date().toLocaleString()
    });

    localStorage.setItem("notifications", JSON.stringify(notifications));

    addNotification("💰 Amount deposited successfully");
    showToast("Deposit Successful ✅", "success");

    setAmount("");
    setPinInput("");
    setShowPinBox(false);
    setError("");

  } catch (err) {
    showToast(err.message || "Incorrect PIN ❌", "error");
  }
};

  if (!user) return <h3>No user logged in</h3>;

  return (
    <div className="page-container">

      <div className="form-card">
        <h2>Deposit Money</h2>

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button onClick={handleDepositClick} className="button">
          Deposit Amount
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
              Confirm Deposit
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

export default Deposit;
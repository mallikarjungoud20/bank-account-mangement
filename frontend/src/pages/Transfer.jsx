import { useState, useEffect, useContext } from "react";
import "../styles.css";
import { addNotification } from "../utils/notification";
import { ToastContext } from "../context/ToastContext";

function Transfer() {
  const [amount, setAmount] = useState("");
  const [receiver, setReceiver] = useState("");
  const [user, setUser] = useState(null);

  const [pinInput, setPinInput] = useState("");
  const [showPinBox, setShowPinBox] = useState(false);
  const [error, setError] = useState("");

  const { showToast } = useContext(ToastContext);

  // ✅ FIXED localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, []);

  const handleTransferClick = () => {
    if (!amount || !receiver) {
      showToast("Enter all details ❌", "error");
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
      // ✅ FIXED API call
      const res = await fetch("http://localhost:8080/api/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fromPhone: storedUser.phone,
          toPhone: receiver,
          amount: parseFloat(amount)
        })
      });

      // ✅ check error
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg);
      }

      const message = await res.text(); // backend returns string

      addNotification("🔄 Money transferred successfully");
      showToast(message, "success");

      window.dispatchEvent(new Event("userUpdated"));
      // 🔔 Notifications
      const notifications =
        JSON.parse(localStorage.getItem("notifications")) || [];

      notifications.unshift({
        message: `🔄 ₹${amount} sent to ${receiver}`,
        time: new Date().toLocaleString()
      });

      localStorage.setItem("notifications", JSON.stringify(notifications));

      setAmount("");
      setReceiver("");
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
        <h2>Transfer Money</h2>

        <input
          type="text"
          placeholder="Receiver Phone Number"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          className="input"
        />

        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="input"
        />

        <button onClick={handleTransferClick} className="button">
          Transfer Amount
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
              Confirm Transfer
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

export default Transfer;
import { useState } from "react";
import "../styles.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [authorized, setAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");

  const handleVerifyPin = async () => {
    // ✅ FIX 1: correct key
    const storedUser = JSON.parse(localStorage.getItem("user"));

    // ✅ FIX 2: null check
    if (!storedUser) {
      setError("User not found ❌");
      return;
    }

    // ✅ FIX 3: safe pin check
    if (pinInput === storedUser.pin) {
      setAuthorized(true);
      setError("");

      try {
       const res = await fetch("http://127.0.0.1:8080/api/admin/transactions");
        const data = await res.json();

        // ✅ FIX 4: filter only logged-in user's transactions
        const userTransactions = data.filter(
          (t) =>
            t.phone?.toString().trim() ===
            storedUser.phone?.toString().trim()
        );

        setTransactions(userTransactions);

      } catch (err) {
        console.error(err);
        setError("Failed to load transactions ❌");
      }

    } else {
      setError("Incorrect PIN ❌");
    }
  };

  // 🔐 PIN SCREEN
  if (!authorized) {
    return (
      <div className="page-container">
        <div className="pin-card">

          <h2 className="text-xl font-semibold">🔐 Enter PIN</h2>

          <input
            type="password"
            placeholder="••••"
            value={pinInput}
            onChange={(e) => setPinInput(e.target.value)}
            maxLength="4"
            className="input text-center text-xl tracking-widest"
          />

          {error && <p className="error">{error}</p>}

          <button onClick={handleVerifyPin} className="button">
            Verify
          </button>

        </div>
      </div>
    );
  }

  // ✅ TRANSACTIONS UI
  return (
    <div className="page-container">

      <h2 className="text-2xl font-bold text-gray-800">
        Transaction History
      </h2>

      <div className="form-card w-full max-w-4xl overflow-hidden">

        {transactions.length === 0 ? (
          <p className="text-gray-500">No transactions available</p>
        ) : (
          <table className="w-full">

            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Type</th>
                <th className="text-left p-4">Amount</th>
                <th className="text-left p-4">Receiver</th>
                <th className="text-left p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((t, index) => (
                <tr key={index} className="border-t hover:bg-gray-50">

                  <td className="p-4 text-sm text-gray-600">
                    {t.date}
                  </td>

                  <td className="p-4 font-medium">
                    {t.type}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      t.type === "Deposit"
                        ? "text-green-600"
                        : t.type === "Withdraw"
                        ? "text-red-600"
                        : "text-blue-600"
                    }`}
                  >
                    {t.type === "Deposit"
                      ? "+ "
                      : t.type === "Withdraw"
                      ? "- "
                      : ""}
                    ₹ {t.amount}
                  </td>

                  <td className="p-4">
                    {t.receiver || "-"}
                  </td>

                  <td
                    className={`p-4 font-bold ${
                      t.status === "SUCCESS"
                        ? "text-green-600"
                        : t.status === "FAILED"
                        ? "text-red-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {t.status === "SUCCESS" }
                    {t.status === "FAILED" }
                    {t.status === "PENDING"}
                    {t.status}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>

    </div>
  );
}

export default Transactions;
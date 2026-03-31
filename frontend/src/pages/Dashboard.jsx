import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  FaWallet,
  FaEye,
  FaEyeSlash
} from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [showBalance, setShowBalance] = useState(false);

  const [summary, setSummary] = useState({
    totalDeposit: 0,
    totalWithdraw: 0,
    totalTransactions: 0
  });

  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);

  // ✅ FIXED useEffect
  useEffect(() => {
    const loadData = () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser) {
        navigate("/");
        return;
      }

      setUser(storedUser);

      const phone = storedUser.phone;

      // SUMMARY
      fetch(`http://localhost:8080/api/summary/${phone}`)
        .then(res => res.json())
        .then(data => setSummary(data))
        .catch(err => console.error(err));

      // BALANCE
      fetch(`http://localhost:8080/api/balance/${phone}`)
        .then(res => res.json())
        .then(data => setBalance(data))
        .catch(err => console.error(err));

      // TRANSACTIONS
      fetch(`http://localhost:8080/api/transactions/${phone}`)
        .then(res => res.json())
        .then(data => setTransactions(data))
        .catch(err => console.error(err));
    };

    loadData();

    window.addEventListener("userUpdated", loadData);

    return () => {
      window.removeEventListener("userUpdated", loadData);
    };
  }, [navigate]);

  // ✅ SAFE FUNCTION
  const formatName = (name) => {
    if (!name) return "";
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };

  const chartData = [
    { name: "Deposit", amount: summary.totalDeposit },
    { name: "Withdraw", amount: summary.totalWithdraw }
  ];

  if (!user) return <h3>No user</h3>;

  return (
    <div className="space-y-6">

      <div>
        <h2 className="text-2xl font-bold">
          Welcome to My Bank, {formatName(user.name)} 👋
        </h2>
        <p className="text-gray-500">
          Account No: {user.accountNumber}
        </p>
      </div>

      {/* BALANCE */}
      <div className="bg-blue-700 text-white p-6 rounded-xl flex justify-between">
        <div>
          <p>Available Balance</p>
          <h1 className="text-3xl font-bold">
            {showBalance ? `₹ ${balance}` : "₹ ******"}
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={handleToggleBalance}>
            {showBalance ? <FaEyeSlash /> : <FaEye />}
          </button>
          <FaWallet size={25} />
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded shadow">
          ₹ {summary.totalDeposit} <br /> Deposits
        </div>

        <div className="bg-white p-4 rounded shadow">
          ₹ {summary.totalWithdraw} <br /> Withdrawals
        </div>

        <div className="bg-white p-4 rounded shadow">
          {summary.totalTransactions} <br /> Transactions
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white p-5 rounded shadow">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="amount">
              {chartData.map((entry, i) => (
                <Cell
                  key={i}
                  fill={entry.name === "Deposit" ? "green" : "red"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ACTIONS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

        <button onClick={() => navigate("/deposit")} className="bg-white p-5 rounded-xl shadow hover:bg-green-50 flex gap-4">
          ⬇️ Deposit
        </button>

        <button onClick={() => navigate("/withdraw")} className="bg-white p-5 rounded-xl shadow hover:bg-red-50 flex gap-4">
          ⬆️ Withdraw
        </button>

        <button onClick={() => navigate("/transfer")} className="bg-white p-5 rounded-xl shadow hover:bg-blue-50 flex gap-4">
          🔄 Transfer
        </button>

        <button onClick={() => navigate("/transactions")} className="bg-white p-5 rounded-xl shadow hover:bg-purple-50 flex gap-4">
          📜 Transactions
        </button>

      </div>

      {/* RECENT */}
      <div className="bg-white p-4 rounded shadow">
        <h3>Recent Transactions</h3>

        {transactions.slice(0, 3).map((t, i) => (
          <div key={i} className="flex justify-between">
            <span>{t.type}</span>
            <span>₹ {t.amount}</span>
          </div>
        ))}

      </div>

    </div>
  );
}

export default Dashboard;
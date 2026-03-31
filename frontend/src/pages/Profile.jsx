import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser) return;

    fetch(`http://localhost:8080/api/users/${storedUser.id}`)
      .then(res => res.json())
      .then(data => setUser(data));
  }, []);

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  const firstLetter = user.name?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6 gap-6">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-800 to-blue-600 text-white w-full max-w-md p-6 rounded-xl shadow-lg text-center">
        <div className="w-20 h-20 rounded-full bg-white text-blue-800 flex items-center justify-center text-3xl font-bold mx-auto mb-3">
          {firstLetter}
        </div>
        <h2 className="text-xl font-semibold">{user.name}</h2>
        <p className="opacity-80">{user.email}</p>
      </div>

      {/* ACCOUNT DETAILS */}
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow">
        <h3 className="text-blue-800 font-semibold mb-3">Account Info</h3>

        <div className="flex justify-between border-b py-2">
          <span>Account Number</span>
          <strong>{user.accountNumber}</strong>
        </div>

        <div className="flex justify-between border-b py-2">
          <span>Balance</span>
          <strong className="text-green-600">₹ {user.balance}</strong>
        </div>

        <div className="flex justify-between py-2">
          <span>Phone</span>
          <strong>{user.phone}</strong>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="bg-white w-full max-w-md p-5 rounded-xl shadow flex flex-col gap-3">

  {/* EDIT PROFILE */}
  <button
    onClick={() => navigate("/edit-profile")}
    className="flex items-center justify-center gap-2 border border-blue-800 text-blue-800 py-2 rounded transition hover:bg-blue-800 hover:text-white"
  >
    ✏️ Edit Profile
  </button>

  {/* CHANGE PASSWORD */}
  <button
    onClick={() => navigate("/change-password")}
    className="flex items-center justify-center gap-2 border border-blue-800 text-blue-800 py-2 rounded transition hover:bg-blue-800 hover:text-white"
  >
    🔐 Change Password
  </button>

  {/* SECURITY */}
  <button
    onClick={() => navigate("/security")}
    className="flex items-center justify-center gap-2 border border-blue-800 text-blue-800 py-2 rounded transition hover:bg-blue-800 hover:text-white"
  >
    🛡 Security Settings
  </button>

  {/* LOGOUT */}
  <button
    onClick={() => {
      localStorage.clear();
      navigate("/");
    }}
    className="flex items-center justify-center gap-2 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
  >
    🚪 Logout
  </button>

</div>
    </div>
  );
}

export default Profile;
import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addNotification } from "../utils/notification";
import { ToastContext } from "../context/ToastContext";


function EditProfile() {
  const [user, setUser] = useState({});
  const navigate = useNavigate();
  const { showToast } = useContext(ToastContext);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem("user")));
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    fetch(`http://localhost:8080/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }).then(() => {
  localStorage.setItem("user", JSON.stringify(user));

  addNotification("✏️ Profile updated");   // ✅ ADD HERE

  showToast("Profile updated ✅", "success");
  navigate("/profile");
});
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-80 flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-blue-800">Edit Profile</h2>

        <input name="name" value={user.name || ""} onChange={handleChange}
          className="border p-2 rounded" placeholder="Name" />

        <input name="phone" value={user.phone || ""} onChange={handleChange}
          className="border p-2 rounded" placeholder="Phone" />

        <input name="email" value={user.email || ""} onChange={handleChange}
          className="border p-2 rounded" placeholder="Email" />

        <button
          onClick={handleUpdate}
          className="bg-blue-800 text-white py-2 rounded hover:bg-blue-700"
        >
          Update
        </button>
      </div>
    </div>
  );
}

export default EditProfile;
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const email = useSelector((s) => s.auth.email);

  const handleLogout = () => {
    dispatch(logout());
    nav("/login");
  };

  return (
    <header className="mb-6 flex items-center justify-between rounded-xl bg-white p-4 shadow-sm">
      <h1 className="text-xl font-bold text-blue-600">Mini Tasker</h1>

      <div className="flex items-center gap-4">
        {email && <span className="text-gray-700">👋 {email}</span>}
        <button
          onClick={handleLogout}
          className="btn btn-outline"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

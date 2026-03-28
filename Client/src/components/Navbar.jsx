import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  let user = null;
  if (token) {
    try {
      user = JSON.parse(atob(token.split('.')[1]));
    } catch(e) {}
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav className="glass-panel sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-t-0 border-x-0 rounded-b-2xl mb-8 w-full">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xl shadow-[0_0_15px_rgba(99,102,241,0.5)]">
          S
        </div>
        <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 hidden sm:block">
          SecureUpdate
        </span>
      </div>
      <div className="flex items-center gap-6">
        {user && (
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-white">{user.name || "User"}</p>
              <p className="text-xs text-indigo-300 capitalize font-medium">{user.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-500/30 text-indigo-300">
              <span className="text-sm font-bold">
                {user.name ? user.name[0].toUpperCase() : "U"}
              </span>
            </div>
          </div>
        )}
        <button onClick={handleLogout} className="btn-secondary py-2 px-5 text-sm">
          Logout
        </button>
      </div>
    </nav>
  );
}

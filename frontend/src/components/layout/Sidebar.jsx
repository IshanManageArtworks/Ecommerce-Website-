import { NavLink, Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/auth/authSlice";
import { api } from "../../services/api";
import { persistor } from "../../app/store";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const prefetchProducts = api.usePrefetch("getProducts");
  const user = useSelector((state) => state.auth.user);
  const isProfileActive = location.pathname === "/profile";

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/login");
  };

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm transition ${
      isActive
        ? "bg-blue-700 text-white shadow-sm dark:bg-blue-600"
        : "text-slate-600 hover:bg-slate-50 dark:text-gray-300 dark:hover:bg-slate-700"
    }`;

  return (
    <aside className="w-64 border-r border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 min-h-[calc(100vh-73px)] p-4 flex flex-col justify-between text-slate-800 dark:text-slate-100">
      <div className="flex flex-col gap-4">
        {/* Profile card - links to /profile */}
        <Link
          to="/profile"
          title="View profile"
          className={`flex items-center gap-3 px-3 py-3 rounded-xl transition ${
            isProfileActive
              ? "bg-blue-50 dark:bg-blue-900/30 ring-1 ring-blue-200 dark:ring-blue-800"
              : "bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700"
          }`}
        >
          <div className="w-9 h-9 rounded-full bg-blue-700 text-white flex items-center justify-center text-sm font-bold shrink-0">
            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
              {user?.name || "Store Manager"}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email || "admin@shop.com"}
            </p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1.5">
          <NavLink to="/dashboard" className={linkClass}>
            📊 Dashboard
          </NavLink>

          <NavLink
            to="/products"
            className={linkClass}
            onMouseEnter={() => prefetchProducts({ limit: 10, skip: 0 })}
          >
            🛍️ Products
          </NavLink>

          <NavLink to="/wishlist" className={linkClass}>
            ❤️ Wishlist
          </NavLink>

          <NavLink to="/cart" className={linkClass}>
            🛒 Cart
          </NavLink>

          <NavLink to="/notifications" className={linkClass}>
            🔔 Notifications
          </NavLink>

          <NavLink to="/profile" className={linkClass}>
            👤 Profile
          </NavLink>
        </nav>
      </div>

      <div className="border-t border-gray-100 dark:border-slate-700 pt-3">
        <button
          onClick={handleLogout}
          className="w-full text-left flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
        >
          🚪 Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;

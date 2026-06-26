import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../features/theme/themeSlice";
import { logout } from "../../features/auth/authSlice";
import { toggleSidebar } from "../../features/ui/uiSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../../app/store";

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const darkMode = useSelector((state) => state.theme.darkMode);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    dispatch(logout());
    await persistor.purge();
    navigate("/login");
  };

  return (
    <nav className="flex justify-between items-center gap-4 px-6 py-3 border-b border-gray-200 bg-white dark:bg-slate-800 dark:border-slate-700 text-slate-800 dark:text-slate-100">
      <div className="flex items-center gap-3 shrink-0">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="text-xl p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 focus:outline-none"
          title="Toggle Menu"
        >
          ☰
        </button>

        <div className="w-8 h-8 rounded-lg bg-blue-700 text-white flex items-center justify-center text-base shrink-0">
          📊
        </div>
        <h2 className="text-lg font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
          ShopAdmin
        </h2>
      </div>

      {/* Decorative search box, matches mockup. Not wired to a query -
          ProductsPage has the real search; this is the global-nav visual. */}
      <div className="hidden md:flex flex-1 max-w-sm">
        <div className="flex items-center gap-2 w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/40 text-gray-400 text-sm">
          <span>🔍</span>
          <span className="truncate">Search products, SKUs, or categories...</span>
        </div>
      </div>

      <div className="flex gap-3 items-center shrink-0">
        <span className="hidden lg:inline font-medium text-sm text-gray-600 dark:text-gray-300">
          {user?.name || user?.email}
        </span>

        {/* Theme Toggle */}
        <button
          onClick={() => dispatch(toggleTheme())}
          className="px-3 py-1.5 border border-gray-300 dark:border-slate-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>

        {/* Notification bell with badge dot - visual only, real list is on /notifications */}
        <button
          className="relative text-lg p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700"
          title="Notifications"
          onClick={() => navigate("/notifications")}
        >
          🔔
          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <button
          onClick={() => navigate("/profile")}
          title="View profile"
          className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-blue-200 dark:hover:ring-blue-800 transition"
        >
          {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="hidden sm:inline px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;

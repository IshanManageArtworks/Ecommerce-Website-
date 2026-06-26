import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import useOnlineStatus from "../../hooks/useOnlineStatus";

function Layout() {
  const isOnline = useOnlineStatus();
  const sidebarOpen = useSelector((state) => state.ui.sidebarOpen);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Offline banner */}
      {!isOnline && (
        <div className="bg-red-500 text-white text-center py-2 px-4 font-medium text-sm w-full sticky top-0 z-50 shadow-md">
          ⚠️ You are currently offline. Showing cached data.
        </div>
      )}

      <Navbar />

      <div className="flex flex-1">
        {sidebarOpen && <Sidebar />}

        <main className="flex-1 p-6 bg-[#f8f9ff] dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center bg-[#f8f9ff] dark:bg-slate-900 px-4">
      <div className="w-14 h-14 rounded-xl bg-blue-700 text-white flex items-center justify-center text-2xl mb-4">
        📊
      </div>
      <h1 className="text-5xl font-extrabold text-slate-800 dark:text-white">404</h1>
      <h2 className="text-lg font-semibold text-gray-500 dark:text-gray-400 mt-2 mb-6">
        Page Not Found
      </h2>
      <Link
        to="/dashboard"
        className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-lg transition"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
}

export default NotFoundPage;

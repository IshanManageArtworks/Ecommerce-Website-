import { useState } from "react";
import { useRegisterMutation } from "../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate, Navigate, Link } from "react-router-dom";

function RegisterPage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [register, { isLoading, error }] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

  const handleRegister = async () => {
  try {
    const response = await register({
      name,
      email,
      password,
    }).unwrap();

    dispatch(
  loginSuccess({
    user: response.user,
    token: response.token,
  })
);

navigate("/dashboard");
  } catch (err) {
    console.log(err);
  }
};

if (isAuthenticated) {
  return <Navigate to="/dashboard" replace />;
}
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] dark:bg-slate-900 px-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-2xl shadow-sm p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center text-2xl mb-3 shadow-sm">
            📊
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
            ShopAdmin
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Create your account
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-300 mb-1.5">
              Full Name
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:border-blue-500 transition">
              <span className="text-gray-400">👤</span>
              <input
                type="text"
                placeholder="Alex Morgan"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-300 mb-1.5">
              Email Address
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:border-blue-500 transition">
              <span className="text-gray-400">✉️</span>
              <input
                type="email"
                placeholder="admin@shop.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 focus-within:border-blue-500 transition">
              <span className="text-gray-400">🔒</span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-slate-800 dark:text-white placeholder:text-gray-400"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition shadow-sm mt-1"
          >
            {isLoading ? "Creating account..." : "Register"}
          </button>

          {error && (
            <p className="text-sm text-red-600 text-center -mt-1">
              {error.data?.message || "Could not create account."}
            </p>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-700 dark:text-blue-400">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;

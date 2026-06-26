import { useState } from "react";
import { useLoginMutation } from "../services/authApi";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../features/auth/authSlice";
import { useNavigate, Navigate, Link } from "react-router-dom";


function LoginPage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [login, { isLoading, error }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
  (state) => state.auth.isAuthenticated
);

  const handleLogin = async () => {
  try {
    const response = await login({
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
        {/* Logo + heading */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-blue-700 text-white flex items-center justify-center text-2xl mb-3 shadow-sm">
            📊
          </div>
          <h1 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 tracking-tight">
            ShopAdmin
          </h1>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
            Precision Commerce Management
          </p>
        </div>

        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
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

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-500 dark:text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300"
              />
              Remember me
            </label>
            <span
              className="font-semibold text-blue-700 dark:text-blue-400 cursor-not-allowed opacity-70"
              title="Password reset isn't available in this demo yet"
            >
              Forgot password?
            </span>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition shadow-sm"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <p className="text-sm text-red-600 text-center -mt-1">
              Invalid credentials
            </p>
          )}
        </form>

        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200 dark:bg-slate-600" />
        </div>

        <button
          type="button"
          disabled
          title="SSO isn't available in this demo yet"
          className="w-full flex items-center justify-center gap-2 border border-gray-200 dark:border-slate-600 text-slate-500 dark:text-gray-400 font-semibold text-sm py-2.5 rounded-lg cursor-not-allowed opacity-70"
        >
          🔑 Sign in with SSO
        </button>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-5">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-700 dark:text-blue-400">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import AppRouter from "./router/AppRouter";
import { logout } from "./features/auth/authSlice";

function App() {
  const dispatch = useDispatch();
  const darkMode = useSelector((state) => state.theme.darkMode);
  const { isAuthenticated, expiresAt } = useSelector((state) => state.auth);

  // 1. Sync Dark Mode with document element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 2. JWT Auto-Logout Check
  useEffect(() => {
    if (!isAuthenticated || !expiresAt) return;

    const checkTokenExpiration = () => {
      if (Date.now() >= expiresAt) {
        dispatch(logout());
      }
    };

    // Check on mount
    checkTokenExpiration();

    // Check every 5 seconds
    const interval = setInterval(checkTokenExpiration, 5000);

    return () => clearInterval(interval);
  }, [isAuthenticated, expiresAt, dispatch]);

  return <AppRouter />;
}

export default App;
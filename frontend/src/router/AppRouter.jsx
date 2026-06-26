import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  lazy,
  Suspense,
} from "react";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

const LoginPage = lazy(() =>
  import("../pages/LoginPage")
);

const RegisterPage = lazy(() =>
  import("../pages/RegisterPage")
);

const DashboardPage = lazy(() =>
  import("../pages/DashboardPage")
);

const ProductsPage = lazy(() =>
  import("../pages/ProductsPage")
);

const ProductDetailsPage = lazy(() =>
  import("../pages/ProductDetailsPage")
);

const CartPage = lazy(() =>
  import("../pages/CartPage")
);

const WishlistPage = lazy(() =>
  import("../pages/WishlistPage")
);

const ProfilePage = lazy(() =>
  import("../pages/ProfilePage")
);

const NotificationsPage = lazy(() =>
  import("../pages/NotificationsPage")
);

const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage")
);

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#f8f9ff] dark:bg-slate-900">
            <div className="w-10 h-10 border-[3px] border-blue-200 border-t-blue-700 rounded-full animate-spin" />
          </div>
        }
      >
        <Routes>

          <Route
            path="/"
            element={<LoginPage />}
          />

          <Route
            path="/login"
            element={<LoginPage />}
          />

          <Route
            path="/register"
            element={<RegisterPage />}
          />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route
              path="/dashboard"
              element={<DashboardPage />}
            />

            <Route
  path="/notifications"
  element={<NotificationsPage />}
/>

            <Route
              path="/products"
              element={<ProductsPage />}
            />

            <Route
              path="/products/:id"
              element={<ProductDetailsPage />}
            />

            <Route
              path="/cart"
              element={<CartPage />}
            />

            <Route
              path="/wishlist"
              element={<WishlistPage />}
            />

            <Route
              path="/profile"
              element={<ProfilePage />}
            />
          </Route>

          <Route
            path="*"
            element={<NotFoundPage />}
          />

        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;
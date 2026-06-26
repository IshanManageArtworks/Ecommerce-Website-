import { useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  useLazyGetProductsQuery,
  useGetProductsQuery,
  useGetOrdersQuery,
  useGetUsersQuery,
} from "../services/productsApi";
import { selectCartCount } from "../features/cart/cartSelectors";
import { selectWishlistCount } from "../features/wishlist/wishlistSelectors";
import Button from "../components/ui/Button";
import DashboardListSkeleton from "../components/ui/DashboardListSkeleton";

function StatCard({ icon, label, value, trend, trendTone = "emerald" }) {
  const toneClass =
    trendTone === "rose"
      ? "bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400"
      : "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400";

  return (
    <div className="p-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-base">
          {icon}
        </div>
        {trend && (
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${toneClass}`}>
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-0.5">{label}</p>
      <p className="text-xl font-extrabold text-slate-800 dark:text-white">{value}</p>
    </div>
  );
}

function DashboardPage() {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const cartCount = useSelector(selectCartCount);
  const wishlistCount = useSelector(selectWishlistCount);

  // Real stats, all from data that already exists in db.json.
  const { total: productsTotal } = useGetProductsQuery(
    { limit: 1, skip: 0 },
    { selectFromResult: ({ data }) => ({ total: data?.total ?? 0 }) }
  );
  const { data: orders = [] } = useGetOrdersQuery();
  const { data: customers = [] } = useGetUsersQuery();

  const { orderCount, revenue } = useMemo(
    () => ({
      orderCount: orders.length,
      revenue: orders.reduce((sum, o) => sum + (o.total || 0), 0),
    }),
    [orders]
  );

  const [triggerLoad, { data: lazyData, isFetching: isLazyFetching }] = useLazyGetProductsQuery();

  const handleQuickLoad = () => {
    triggerLoad({ limit: 4, skip: 0 });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Welcome back, <strong className="text-blue-700 dark:text-blue-400">{user?.name || user?.email}</strong>. Here's what's happening with your store today.
          </p>
        </div>
        <Button onClick={() => navigate("/products")} className="shrink-0">
          + New Product
        </Button>
      </div>

      {/* Stat cards - real data from products/orders/users collections */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon="📦" label="Products" value={productsTotal.toLocaleString()} />
        <StatCard icon="🧾" label="Orders" value={orderCount.toLocaleString()} />
        <StatCard icon="💰" label="Revenue" value={`₹ ${revenue.toLocaleString()}`} />
        <StatCard icon="👥" label="Customers" value={customers.length.toLocaleString()} />
      </div>

      {/* Quick links to the rest of the app, with live counts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          {
            title: "🛒 Cart",
            desc: "Review and checkout your cart items.",
            badge: cartCount > 0 ? `${cartCount} items` : "Empty",
            path: "/cart",
          },
          {
            title: "❤️ Wishlist",
            desc: "Your saved products to buy later.",
            badge: wishlistCount > 0 ? `${wishlistCount} saved` : "Empty",
            path: "/wishlist",
          },
          {
            title: "👤 Profile",
            desc: "View your user details and settings.",
            badge: user?.role || "User",
            path: "/profile",
          },
        ].map((card) => (
          <div
            key={card.path}
            onClick={() => navigate(card.path)}
            className="p-5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md cursor-pointer transition flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">{card.title}</h3>
                {card.badge && (
                  <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{card.desc}</p>
            </div>
            <div className="mt-4 text-xs font-medium text-blue-700 dark:text-blue-400 flex items-center gap-1">
              Go to page →
            </div>
          </div>
        ))}
      </div>

      {/* Quick View Products - lazy query demo, restyled as a card grid */}
      <div className="p-6 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">Quick View Products</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Load a quick preview of top products.
            </p>
          </div>
          <Button onClick={handleQuickLoad} disabled={isLazyFetching} className="shrink-0">
            {isLazyFetching ? "Loading..." : "🔄 Load Products"}
          </Button>
        </div>

        {isLazyFetching && <DashboardListSkeleton count={4} />}

        {lazyData?.products && !isLazyFetching && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {lazyData.products.map((prod) => (
              <div
                key={prod.id}
                onClick={() => navigate(`/products/${prod.id}`)}
                className="rounded-lg border border-gray-100 dark:border-slate-700 overflow-hidden cursor-pointer hover:shadow-md transition"
              >
                <img
                  src={prod.thumbnail}
                  alt={prod.title}
                  className="w-full h-24 object-cover bg-gray-100"
                  loading="lazy"
                />
                <div className="p-2.5">
                  <p className="text-xs text-gray-400 capitalize">{prod.category}</p>
                  <p className="font-semibold text-sm line-clamp-1">{prod.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400">₹ {prod.price}</span>
                    <span className="text-xs text-gray-500">⭐ {prod.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;

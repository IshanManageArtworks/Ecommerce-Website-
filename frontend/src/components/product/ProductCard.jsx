import { memo } from "react";
import { useNavigate } from "react-router-dom";

function stockBadge(stock) {
  if (stock === undefined || stock === null) return null;
  if (stock <= 0) {
    return { label: "OUT OF STOCK", className: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" };
  }
  if (stock <= 10) {
    return { label: "LIMITED", className: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300" };
  }
  return { label: "IN STOCK", className: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" };
}

function ProductCard({ product }) {
  const navigate = useNavigate();
  const badge = stockBadge(product.stock);

  return (
    <div
      onClick={() =>
        navigate(`/products/${product.id}`)
      }
      className="w-full max-w-[280px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer transition flex flex-col text-slate-800 dark:text-slate-100"
    >
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          width="280"
          height="180"
          loading="lazy"
          className="w-full h-40 object-cover bg-gray-100"
        />
        {badge && (
          <span
            className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wide ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      <div className="p-3.5 flex flex-col flex-1">
        <p className="text-xs text-gray-400 dark:text-gray-400 capitalize mb-0.5">{product.category}</p>
        <h3 className="font-bold text-sm line-clamp-1 mb-2">{product.title}</h3>

        <div className="flex items-center justify-between mt-auto">
          <span className="text-base font-bold text-blue-700 dark:text-blue-400">₹ {product.price}</span>
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-0.5">
            ⭐ {product.rating}
          </span>
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);

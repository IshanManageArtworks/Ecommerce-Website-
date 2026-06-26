import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../features/cart/cartSlice";
import { selectCartSummary } from "../features/cart/cartSelectors";
import EmptyState from "../components/ui/EmptyState";

function CartPage() {
  const dispatch = useDispatch();
  const [discountCode, setDiscountCode] = useState("");

  const { items, subtotal } = useSelector(selectCartSummary);

  // Decorative - no tax/shipping calculation exists on the backend.
  const estimatedTax = Math.round(subtotal * 0.08);
  const total = subtotal + estimatedTax;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">Your Shopping Cart</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Manage your selected items and proceed to checkout.
        </p>
      </div>

      {items.length === 0 ? (
        <EmptyState message="Your cart is empty." />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Line items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm"
              >
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-sm line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-gray-400 capitalize">{item.category}</p>
                </div>

                <div className="flex items-center gap-1 border border-gray-200 dark:border-slate-600 rounded-lg px-1 shrink-0">
                  <button
                    onClick={() => dispatch(decreaseQuantity(item.id))}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">{item.quantity}</span>
                  <button
                    onClick={() => dispatch(increaseQuantity(item.id))}
                    className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-slate-800 dark:hover:text-white"
                  >
                    +
                  </button>
                </div>

                <span className="text-sm font-bold text-blue-700 dark:text-blue-400 w-20 text-right shrink-0">
                  ₹ {item.price * item.quantity}
                </span>

                <button
                  onClick={() => dispatch(removeFromCart(item.id))}
                  title="Remove"
                  className="text-red-500 hover:text-red-600 shrink-0"
                >
                  🗑️
                </button>
              </div>
            ))}

            {/* Discount code - UI only, not connected to any pricing logic */}
            <div className="border border-dashed border-gray-300 dark:border-slate-600 rounded-xl p-5 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">🏷️ Have a discount code?</p>
              <div className="flex gap-2 max-w-sm mx-auto">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  title="Discount codes aren't available in this demo yet"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-slate-700 text-white opacity-70 cursor-not-allowed"
                >
                  Apply
                </button>
              </div>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 dark:text-blue-400"
            >
              ← Continue Shopping
            </Link>
          </div>

          {/* Order summary */}
          <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl shadow-sm p-5 space-y-4 self-start">
            <h3 className="font-bold text-slate-800 dark:text-white">Order Summary</h3>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-800 dark:text-white">₹ {subtotal}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Shipping</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  FREE
                </span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>Estimated Tax</span>
                <span className="font-semibold text-slate-800 dark:text-white">₹ {estimatedTax}</span>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-slate-700 pt-3 flex justify-between font-bold text-slate-800 dark:text-white">
              <span>Total</span>
              <span className="text-blue-700 dark:text-blue-400">₹ {total}</span>
            </div>

            <button
              type="button"
              disabled
              title="Checkout isn't available in this demo yet"
              className="w-full flex items-center justify-center gap-2 bg-blue-700 text-white font-bold py-2.5 rounded-lg opacity-60 cursor-not-allowed"
            >
              Proceed to Checkout →
            </button>

            <p className="text-center text-xs text-gray-400">🔒 Secure transaction · Encrypted</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default CartPage;

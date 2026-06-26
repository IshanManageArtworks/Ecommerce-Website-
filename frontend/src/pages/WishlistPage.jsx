import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { addToCart } from "../features/cart/cartSlice";
import { useAddToCartMutation } from "../services/productsApi";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

function WishlistPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [addCartApi] = useAddToCartMutation();

  const items = useSelector(
    (state) => state.wishlist.items
  );

  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
    addCartApi({ userId: 1, products: [{ id: item.id, quantity: 1 }] });
  };

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      if (item.stock > 0) handleAddToCart(item);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">My Wishlist</h1>
          <span className="text-xs font-bold px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
            {items.length} {items.length === 1 ? "item" : "items"}
          </span>
        </div>
        {items.length > 0 && (
          <Button onClick={handleMoveAllToCart}>
            🛒 Move All to Cart
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState message="No products in your wishlist yet." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {items.map((item) => {
            const outOfStock = item.stock <= 0;
            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm flex flex-col"
              >
                <div className="relative">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    onClick={() => navigate(`/products/${item.id}`)}
                    className="w-full h-32 object-cover bg-gray-100 cursor-pointer"
                    loading="lazy"
                  />
                  <button
                    onClick={() => dispatch(removeFromWishlist(item.id))}
                    title="Remove from wishlist"
                    className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/90 dark:bg-slate-900/80 text-gray-500 dark:text-gray-300 flex items-center justify-center text-xs font-bold hover:bg-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-bold text-sm line-clamp-1 mb-1">{item.title}</h3>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-400">₹ {item.price}</span>
                    {item.rating && (
                      <span className="text-xs text-gray-500">⭐ {item.rating}</span>
                    )}
                  </div>

                  <button
                    onClick={() => !outOfStock && handleAddToCart(item)}
                    disabled={outOfStock}
                    className="mt-auto w-full text-sm font-semibold py-2 rounded-lg transition bg-blue-700 hover:bg-blue-800 text-white disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed dark:disabled:bg-slate-700"
                  >
                    {outOfStock ? "Notify Me" : "🛒 Add to Cart"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;

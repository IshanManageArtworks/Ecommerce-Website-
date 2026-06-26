import { useParams, Link } from "react-router-dom";
import { useGetProductByIdQuery } from "../services/productsApi";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import { addToWishlist, removeFromWishlist } from "../features/wishlist/wishlistSlice";
import { selectWishlistIds } from "../features/wishlist/wishlistSelectors";
import { useCallback, useState } from "react";
import { useAddToCartMutation } from "../services/productsApi";
import ProductDetailsSkeleton from "../components/ui/ProductDetailsSkeleton";

// Decorative swatch colors - no color-variant data exists on products, so
// these are presentation-only and don't change the product being added.
const SWATCHES = ["#1f2937", "#7c2d12", "#1d4ed8"];

const SPEC_TABS = ["Technical Specifications", "Customer Reviews", "Shipping & Returns"];

function stockStatus(stock) {
  if (stock === undefined || stock === null) return null;
  if (stock <= 0) return { label: "Out of Stock", className: "text-rose-600 dark:text-rose-400" };
  if (stock <= 10) return { label: `Low stock (${stock} left)`, className: "text-amber-600 dark:text-amber-400" };
  return { label: `In Stock (${stock} units left)`, className: "text-emerald-600 dark:text-emerald-400" };
}

function ProductDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [addCartApi] = useAddToCartMutation();
  const [activeTab, setActiveTab] = useState(SPEC_TABS[0]);

  const wishlistIds = useSelector(selectWishlistIds);

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductByIdQuery(id);

  const isWishlisted = product ? wishlistIds.has(product.id) : false;

  const handleAddToCart = useCallback(async () => {
    dispatch(addToCart(product));

    await addCartApi({
      userId: 1,
      products: [
        {
          id: product.id,
          quantity: 1,
        },
      ],
    });
  }, [dispatch, product, addCartApi]);

  const handleToggleWishlist = useCallback(() => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
    } else {
      dispatch(addToWishlist(product));
    }
  }, [dispatch, product, isWishlisted]);

  if (isLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600 dark:text-red-400 font-medium">
        ⚠️ Error loading product.
      </div>
    );
  }

  const stock = stockStatus(product.stock);
  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? Math.round(product.price / (1 - product.discountPercentage / 100))
    : null;

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide flex items-center gap-2">
        <Link to="/products" className="hover:text-blue-700 dark:hover:text-blue-400">Inventory</Link>
        <span>/</span>
        <span className="capitalize">{product.category}</span>
        <span>/</span>
        <span className="text-slate-600 dark:text-gray-300">{product.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image column */}
        <div>
          <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 bg-gray-50">
            <img
              src={product.thumbnail}
              alt={product.title}
              className="w-full h-80 object-cover"
            />
          </div>
          {/* Decorative thumbnail strip - product only has one image */}
          <div className="flex gap-2 mt-3">
            {SWATCHES.map((c, i) => (
              <div
                key={i}
                className="w-14 h-14 rounded-lg border border-gray-200 dark:border-slate-700 bg-gray-100 overflow-hidden"
              >
                <img src={product.thumbnail} alt="" className="w-full h-full object-cover opacity-70" />
              </div>
            ))}
            <div className="w-14 h-14 rounded-lg border border-dashed border-gray-300 dark:border-slate-600 flex items-center justify-center text-xs text-gray-400">
              +2 View
            </div>
          </div>
        </div>

        {/* Info column */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
            <span>SKU: DEMO-{String(product.id).padStart(4, "0")}</span>
            <span className="ml-auto flex items-center gap-1 text-amber-500 font-semibold">
              ⭐ {product.rating} <span className="text-gray-400">({Math.floor(product.rating * 25)})</span>
            </span>
          </div>

          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-white mb-2">{product.title}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">₹ {product.price}</span>
            {hasDiscount && (
              <>
                <span className="text-base text-gray-400 line-through">₹ {originalPrice}</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                  SAVE {product.discountPercentage}%
                </span>
              </>
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">Product Description</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {/* Decorative quick specs - no dimension/weight/warranty data exists */}
          <div className="grid grid-cols-2 gap-3 mt-4 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <span>🏷️</span> Brand: {product.brand}
            </div>
            <div className="flex items-center gap-2">
              <span>📦</span> Category: <span className="capitalize">{product.category}</span>
            </div>
          </div>

          {/* Decorative color swatches - no variant data exists */}
          <div className="mt-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2">Color</p>
            <div className="flex items-center gap-2">
              {SWATCHES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  title="Color variants aren't available for this product"
                  className={`w-7 h-7 rounded-full border-2 ${i === 0 ? "border-blue-600" : "border-transparent"}`}
                  style={{ backgroundColor: c }}
                />
              ))}
              {stock && (
                <span className={`ml-3 text-xs font-semibold ${stock.className}`}>
                  ● {stock.label}
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-lg transition"
            >
              🛒 Add to Cart
            </button>
            <button
              onClick={handleToggleWishlist}
              className={`flex-1 flex items-center justify-center gap-2 border font-bold py-2.5 rounded-lg transition ${
                isWishlisted
                  ? "border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900 dark:bg-rose-900/20 dark:text-rose-400"
                  : "border-gray-200 dark:border-slate-600 text-slate-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700"
              }`}
            >
              {isWishlisted ? "❤️ Wishlisted" : "♡ Add to Wishlist"}
            </button>
          </div>

          {/* Decorative shipping notice - no shipping data exists */}
          <div className="flex items-center justify-between mt-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-700/40 text-sm">
            <span className="flex items-center gap-2 text-slate-600 dark:text-gray-300">
              🚚 <strong>Free Express Shipping</strong>
            </span>
            <span className="text-blue-700 dark:text-blue-400 font-semibold text-xs">Details</span>
          </div>
        </div>
      </div>

      {/* Spec tabs - Technical Specifications uses real description; Reviews/Shipping are placeholders with no backing data */}
      <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
        <div className="flex gap-6 border-b border-gray-200 dark:border-slate-700">
          {SPEC_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-sm font-semibold border-b-2 -mb-px transition ${
                activeTab === tab
                  ? "border-blue-700 text-blue-700 dark:text-blue-400"
                  : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-5">
          <div className="md:col-span-2">
            {activeTab === "Technical Specifications" && (
              <>
                <h3 className="font-bold text-slate-800 dark:text-white mb-2">Product Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {product.description}
                </p>
              </>
            )}
            {activeTab === "Customer Reviews" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Reviews aren't available for this product yet.
              </p>
            )}
            {activeTab === "Shipping & Returns" && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Shipping and returns details aren't available for this product yet.
              </p>
            )}
          </div>
          <div className="bg-slate-50 dark:bg-slate-700/40 rounded-xl p-4">
            <p className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide mb-1">Pro Tip</p>
            <h4 className="font-bold text-sm text-slate-800 dark:text-white mb-1">Care & Maintenance</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Follow the manufacturer's care instructions to keep this {product.category} item in the best condition.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;

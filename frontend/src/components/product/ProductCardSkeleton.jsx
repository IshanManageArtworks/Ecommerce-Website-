function ProductCardSkeleton() {
  return (
    <div className="w-full max-w-[280px] bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm animate-pulse">
      <div className="w-full h-40 bg-gray-200 dark:bg-slate-700" />
      <div className="p-3.5">
        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
        <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-slate-700 mb-3" />
        <div className="flex items-center justify-between">
          <div className="h-5 w-1/3 rounded bg-gray-200 dark:bg-slate-700" />
          <div className="h-3 w-1/5 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      </div>
    </div>
  );
}

// Grid of skeleton cards, mirroring ProductGrid's layout, for use while
// useGetProductsQuery / useSearchProductsQuery / useGetProductsByCategoryQuery
// are loading.
export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export default ProductCardSkeleton;

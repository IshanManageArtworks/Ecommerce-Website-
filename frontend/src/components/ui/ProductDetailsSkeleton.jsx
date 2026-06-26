function ProductDetailsSkeleton() {
  return (
    <div className="space-y-6 max-w-5xl animate-pulse">
      <div className="h-3 w-48 rounded bg-gray-200 dark:bg-slate-700" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <div className="w-full h-80 rounded-xl bg-gray-200 dark:bg-slate-700" />
          <div className="flex gap-2 mt-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-slate-700" />
            ))}
          </div>
        </div>

        <div>
          <div className="h-3 w-24 rounded bg-gray-200 dark:bg-slate-700 mb-3" />
          <div className="h-7 w-3/4 rounded bg-gray-200 dark:bg-slate-700 mb-3" />
          <div className="h-7 w-32 rounded bg-gray-200 dark:bg-slate-700 mb-5" />
          <div className="space-y-2 mb-5">
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-3 w-full rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-3 w-2/3 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
          <div className="flex gap-3">
            <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-slate-700" />
            <div className="h-10 flex-1 rounded-lg bg-gray-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsSkeleton;

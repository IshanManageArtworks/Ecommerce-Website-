function DashboardListSkeleton({ count = 5 }) {
  return (
    <div className="mt-4 border-t border-gray-100 dark:border-slate-700 pt-4 space-y-2 animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-32 rounded bg-gray-200 dark:bg-slate-700" />
              <div className="h-3 w-16 rounded bg-gray-200 dark:bg-slate-700" />
            </div>
          </div>
          <div className="h-4 w-12 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

export default DashboardListSkeleton;

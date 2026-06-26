function NotificationSkeleton({ count = 3 }) {
  return (
    <div className="space-y-4 max-w-2xl animate-pulse">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-4 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg shadow-sm"
        >
          <div className="h-3.5 w-28 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
          <div className="h-3.5 w-3/4 rounded bg-gray-200 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;

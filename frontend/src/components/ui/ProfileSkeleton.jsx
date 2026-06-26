function ProfileSkeleton() {
  return (
    <div className="space-y-6 max-w-md animate-pulse">
      <div>
        <div className="h-8 w-40 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
        <div className="h-4 w-64 rounded bg-gray-200 dark:bg-slate-700" />
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-sm space-y-6">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-5 w-32 rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-5 w-20 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        </div>

        <div className="border-t border-gray-100 dark:border-slate-700 pt-4 space-y-4">
          <div>
            <div className="h-3 w-24 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
            <div className="h-4 w-44 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
          <div>
            <div className="h-3 w-16 rounded bg-gray-200 dark:bg-slate-700 mb-2" />
            <div className="h-4 w-12 rounded bg-gray-200 dark:bg-slate-700" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;

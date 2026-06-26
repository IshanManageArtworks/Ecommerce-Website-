function EmptyState({ message = "No items found." }) {
  return (
    <div className="flex flex-col justify-center items-center py-12 px-4 border border-dashed border-gray-300 rounded-xl text-center bg-gray-50 dark:bg-slate-800 dark:border-slate-700">
      <p className="text-gray-500 dark:text-gray-400 text-lg">{message}</p>
    </div>
  );
}

export default EmptyState;

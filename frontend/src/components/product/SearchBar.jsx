function SearchBar({ value, onChange, placeholder = "Search products..." }) {
  return (
    <div className="relative w-full max-w-sm">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
        🔍
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-9 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/30 bg-slate-50 dark:bg-slate-700/40 dark:text-white transition"
      />
    </div>
  );
}

export default SearchBar;

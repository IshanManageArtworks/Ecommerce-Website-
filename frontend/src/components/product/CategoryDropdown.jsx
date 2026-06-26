function CategoryDropdown({ value, onChange, categories = [] }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
    >
      <option value="">All Categories</option>
      {categories.map((cat) => (
        <option key={cat} value={cat}>
          {cat}
        </option>
      ))}
    </select>
  );
}

export default CategoryDropdown;

function ProductFilters({
  maxPrice,
  onChangeMaxPrice,
  sortOrder,
  onChangeSortOrder,
}) {
  return (
    <div className="flex flex-wrap gap-4 items-center">
      <input
        type="number"
        placeholder="Max Price"
        value={maxPrice}
        onChange={onChangeMaxPrice}
        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 w-36 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
      />

      <select
        value={sortOrder}
        onChange={onChangeSortOrder}
        className="px-4 py-2 border border-gray-300 rounded-lg outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:border-slate-700 dark:text-white"
      >
        <option value="">Sort By</option>
        <option value="lowToHigh">Price: Low to High</option>
        <option value="highToLow">Price: High to Low</option>
      </select>
    </div>
  );
}

export default ProductFilters;

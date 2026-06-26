import { useState, useMemo } from "react";
import {
  useGetProductsQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} from "../services/productsApi";
import useDebounce from "../hooks/useDebounce";
import usePagination from "../hooks/usePagination";

// Subcomponents
import SearchBar from "../components/product/SearchBar";
import CategoryDropdown from "../components/product/CategoryDropdown";
import ProductFilters from "../components/product/ProductFilters";
import ProductGrid from "../components/product/ProductGrid";
import { ProductGridSkeleton } from "../components/product/ProductCardSkeleton";
import Pagination from "../components/product/Pagination";
import EmptyState from "../components/ui/EmptyState";
import Button from "../components/ui/Button";

function ProductsPage() {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const limit = 10;
  const skip = (page - 1) * limit;

  // 1. Fetch Categories
  const { data: categories = [] } = useGetCategoriesQuery();

  // 2. Fetch paginated products (only when not searching and not filtering by category)
  const isDefaultQuery = !debouncedSearch && !category;
  const {
    products: defaultProducts = [],
    total: defaultTotal = 0,
    isLoading: isDefaultLoading,
    error: defaultError,
    refetch: refetchDefault,
  } = useGetProductsQuery(
    { limit, skip },
    {
      skip: !isDefaultQuery,
      selectFromResult: ({ data, isLoading, error }) => ({
        products: data?.products,
        total: data?.total,
        isLoading,
        error,
      }),
    }
  );

  // 3. Fetch search products
  const {
    data: searchData = [],
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchProductsQuery(debouncedSearch, {
    skip: !debouncedSearch,
  });

  // 4. Fetch category products
  const {
    data: categoryData = [],
    isLoading: isCategoryLoading,
    error: categoryError,
    refetch: refetchCategory,
  } = useGetProductsByCategoryQuery(category, {
    skip: !category,
  });

  // Determine current active loading state and error state
  const isLoading =
    (isDefaultQuery && isDefaultLoading) ||
    (debouncedSearch && isSearchLoading) ||
    (category && isCategoryLoading);

  const error =
    (isDefaultQuery && defaultError) ||
    (debouncedSearch && searchError) ||
    (category && categoryError);

  // Handle manual refetch/retry
  const handleRetry = () => {
    if (isDefaultQuery) refetchDefault();
    else if (debouncedSearch) refetchSearch();
    else if (category) refetchCategory();
  };

  // Determine base products list based on active filters
  const rawProducts = useMemo(() => {
    if (debouncedSearch) {
      return searchData;
    }
    if (category) {
      return categoryData;
    }
    return defaultProducts || [];
  }, [debouncedSearch, searchData, category, categoryData, defaultProducts]);

  // Apply Price Filter and Sort Order on rawProducts
  const processedProducts = useMemo(() => {
    let list = [...rawProducts];

    // Filter by Max Price
    if (maxPrice) {
      list = list.filter((p) => p.price <= Number(maxPrice));
    }

    // Sort
    if (sortOrder === "lowToHigh") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "highToLow") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [rawProducts, maxPrice, sortOrder]);

  // Setup Pagination using custom hook
  const totalItemsCount = useMemo(() => {
    if (isDefaultQuery) {
      return defaultTotal || 0;
    }
    return processedProducts.length;
  }, [isDefaultQuery, defaultTotal, processedProducts.length]);

  const {
    totalPages,
    nextPage,
    prevPage,
  } = usePagination({ page, setPage, totalItems: totalItemsCount, limit });

  // Get active products for this page (slice client-side if not the server-paginated default view)
  const productsToDisplay = useMemo(() => {
    if (!isDefaultQuery) {
      return processedProducts.slice(skip, skip + limit);
    }
    return processedProducts; // already paginated on server
  }, [isDefaultQuery, processedProducts, skip, limit]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 dark:text-white">All Products</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage, search, and filter our inventory of items.
          </p>
        </div>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-3 items-center flex-1">
          <SearchBar
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCategory(""); // Clear category when searching
              setPage(1);
            }}
            placeholder="Search products, SKUs, or categories..."
          />

          <CategoryDropdown
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSearchTerm(""); // Clear search when category selected
              setPage(1);
            }}
            categories={categories}
          />
        </div>

        <ProductFilters
          maxPrice={maxPrice}
          onChangeMaxPrice={(e) => {
            setMaxPrice(e.target.value);
            setPage(1);
          }}
          sortOrder={sortOrder}
          onChangeSortOrder={(e) => {
            setSortOrder(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Error State with Retry Button */}
      {error && (
        <div className="text-center py-12 border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/30 rounded-lg">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-4">
            Failed to load products. Please check your connection.
          </p>
          <Button onClick={handleRetry}>🔄 Retry Request</Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {isLoading && <ProductGridSkeleton />}

      {/* Products Grid / Empty state */}
      {!isLoading && !error && (
        <>
          {productsToDisplay.length === 0 ? (
            <EmptyState message="No products match your criteria." />
          ) : (
            <ProductGrid products={productsToDisplay} />
          )}

          {/* Pagination Controls */}
          {productsToDisplay.length > 0 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPrevPage={prevPage}
              onNextPage={nextPage}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ProductsPage;
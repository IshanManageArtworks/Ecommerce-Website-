import { useCallback } from "react";

function usePagination({ page, setPage, totalItems, limit }) {
  const totalPages = Math.ceil(totalItems / limit) || 1;

  const nextPage = useCallback(() => {
    setPage((prev) => Math.min(prev + 1, totalPages));
  }, [setPage, totalPages]);

  const prevPage = useCallback(() => {
    setPage((prev) => Math.max(prev - 1, 1));
  }, [setPage]);

  const goToPage = useCallback((pageNumber) => {
    const validPage = Math.max(1, Math.min(pageNumber, totalPages));
    setPage(validPage);
  }, [setPage, totalPages]);

  const skip = (page - 1) * limit;

  return {
    totalPages,
    nextPage,
    prevPage,
    goToPage,
    skip,
  };
}

export default usePagination;

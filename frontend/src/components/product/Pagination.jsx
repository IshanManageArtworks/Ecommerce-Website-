import Button from "../ui/Button";

function Pagination({ page, totalPages, onPrevPage, onNextPage }) {
  return (
    <div className="flex items-center gap-4 py-4 justify-center">
      <Button onClick={onPrevPage} disabled={page === 1}>
        Previous
      </Button>

      <span className="text-gray-700 dark:text-gray-300 font-medium">
        Page {page} / {totalPages}
      </span>

      <Button onClick={onNextPage} disabled={page === totalPages}>
        Next
      </Button>
    </div>
  );
}

export default Pagination;

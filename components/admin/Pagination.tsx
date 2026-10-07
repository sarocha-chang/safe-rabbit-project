import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  const arrowClassName =
    "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-muted transition hover:border-carrot hover:text-carrot-dark disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav className="flex items-center justify-center gap-1.5">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="หน้าก่อนหน้า"
        className={arrowClassName}
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={
            page === currentPage
              ? "h-9 min-w-9 rounded-full bg-carrot px-3 text-sm font-medium text-white"
              : "h-9 min-w-9 rounded-full px-3 text-sm text-muted transition hover:bg-white hover:text-ink"
          }
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="หน้าถัดไป"
        className={arrowClassName}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

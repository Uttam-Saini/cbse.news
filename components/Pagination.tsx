import Link from 'next/link';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  basePath = '/',
}: PaginationProps) {
  // Don't show pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  const getPageUrl = (page: number) => {
    if (page === 1) {
      return basePath;
    }
    return `${basePath}?page=${page}`;
  };

  const previousPage = currentPage > 1 ? currentPage - 1 : null;
  const nextPage = currentPage < totalPages ? currentPage + 1 : null;

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 mt-8 py-6">
      {/* Page info */}
      <div className="text-sm text-gray-600 dark:text-[#9ca3af]">
        Page {currentPage} of {totalPages}
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center" aria-label="Pagination">
        {/* Previous button */}
        {previousPage ? (
          <Link
            href={getPageUrl(previousPage)}
            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-[#d1d5db] hover:bg-gray-50 dark:hover:bg-[#242424] hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base"
          >
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </Link>
        ) : (
          <span className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-gray-400 dark:text-[#6b7280] cursor-not-allowed bg-gray-50 dark:bg-[#1f1f1f] text-sm sm:text-base">
            <span className="hidden sm:inline">Previous</span>
            <span className="sm:hidden">Prev</span>
          </span>
        )}

        {/* Page numbers */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-2 text-gray-400 dark:text-[#9ca3af] text-sm sm:text-base"
                >
                  ...
                </span>
              );
            }

            const pageNum = page as number;
            const isActive = pageNum === currentPage;

            return (
              <Link
                key={pageNum}
                href={getPageUrl(pageNum)}
                className={`px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm sm:text-base ${
                  isActive
                    ? 'bg-blue-600 text-white border-blue-600 font-semibold'
                    : 'border-gray-300 dark:border-white/20 text-gray-700 dark:text-[#d1d5db] hover:bg-gray-50 dark:hover:bg-[#242424] hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {pageNum}
              </Link>
            );
          })}
        </div>

        {/* Next button */}
        {nextPage ? (
          <Link
            href={getPageUrl(nextPage)}
            className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-gray-700 dark:text-[#d1d5db] hover:bg-gray-50 dark:hover:bg-[#242424] hover:border-blue-500 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-sm sm:text-base"
          >
            Next
          </Link>
        ) : (
          <span className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-white/20 rounded-lg text-gray-400 dark:text-[#6b7280] cursor-not-allowed bg-gray-50 dark:bg-[#1f1f1f] text-sm sm:text-base">
            Next
          </span>
        )}
      </nav>
    </div>
  );
}

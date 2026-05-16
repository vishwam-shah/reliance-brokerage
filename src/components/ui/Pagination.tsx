'use client';

import { CIcon } from '@coreui/icons-react';
import { cilChevronLeft, cilChevronRight } from '@coreui/icons';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange?: (limit: number) => void;
}

export default function Pagination({
  page,
  limit,
  total,
  onPageChange,
  onLimitChange,
}: PaginationProps) {
  const totalPages = total > 0 ? Math.ceil(total / limit) : 1;
  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const handlePageChange = (nextPage: number) => {
    onPageChange(nextPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex items-center justify-between px-5 py-4 border-t border-outline-variant/20 bg-surface">
      <div className="flex items-center gap-4">
        {onLimitChange && (
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-on-surface-variant">Per page:</label>
            <select
              value={limit}
              onChange={(e) => {
                onLimitChange(Number(e.target.value));
                handlePageChange(1);
              }}
              className="px-3 py-1 border border-outline-variant rounded-lg text-sm bg-surface hover:border-outline transition-colors"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        )}
        <div className="text-sm text-on-surface-variant">
          {total === 0 ? 'No results' : `${start}–${end} of ${total}`}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={!canPrev}
          className={cn(
            'inline-flex items-center justify-center h-9 w-9 rounded-lg border border-outline-variant transition-colors',
            canPrev
              ? 'hover:bg-surface-container cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Previous page"
        >
          <CIcon icon={cilChevronLeft} className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const pageNum = Math.max(1, Math.min(totalPages - 4, page - 2)) + i;
            const isActive = pageNum === page;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={cn(
                  'h-9 w-9 rounded-lg text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline-variant hover:bg-surface-container'
                )}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={!canNext}
          className={cn(
            'inline-flex items-center justify-center h-9 w-9 rounded-lg border border-outline-variant transition-colors',
            canNext
              ? 'hover:bg-surface-container cursor-pointer'
              : 'opacity-50 cursor-not-allowed'
          )}
          aria-label="Next page"
        >
          <CIcon icon={cilChevronRight} className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

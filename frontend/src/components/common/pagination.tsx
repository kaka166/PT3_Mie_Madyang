import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  itemsPerPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center text-sm w-full">
      {/* BUTTON */}
      <div className="flex gap-1.5 font-bold ml-auto">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-200">
          <ChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-8 h-8 flex items-center justify-center rounded ${
              currentPage === i + 1 ? "bg-[#f85656] text-white" : "bg-gray-200"
            }`}>
            {i + 1}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          className="w-8 h-8 flex items-center justify-center rounded bg-gray-200">
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}

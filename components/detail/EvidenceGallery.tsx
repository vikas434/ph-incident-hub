"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Evidence } from "@/lib/types";
import EvidenceCard from "./EvidenceCard";

interface EvidenceGalleryProps {
  evidence: Evidence[];
}

export default function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12; // Show 12 items per page (4 rows × 3 columns)

  if (evidence.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-gray-500">No evidence found for the selected filters.</p>
      </div>
    );
  }

  // Reset to page 1 when evidence changes
  useEffect(() => {
    setCurrentPage(1);
  }, [evidence.length]);

  // Calculate pagination
  const totalPages = Math.ceil(evidence.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEvidence = evidence.slice(startIndex, endIndex);

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentEvidence.map((item) => (
          <EvidenceCard key={item.id} evidence={item} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center space-x-2">
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              // Show first page, last page, current page, and pages around current
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => handlePageClick(page)}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      currentPage === page
                        ? "bg-purple-600 text-white"
                        : "border border-slate-300 text-gray-700 bg-white hover:bg-slate-50"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (
                page === currentPage - 2 ||
                page === currentPage + 2
              ) {
                return (
                  <span key={page} className="px-2 text-gray-500">
                    ...
                  </span>
                );
              }
              return null;
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className="px-3 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="ml-4 text-sm text-gray-600">
            Showing {startIndex + 1}-{Math.min(endIndex, evidence.length)} of {evidence.length}
          </span>
        </div>
      )}
    </div>
  );
}


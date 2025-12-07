"use client";

import { SKU, Program } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface IntelligenceSidebarProps {
  sku: SKU;
  selectedProgram: string | null;
  onProgramChange: (program: string | null) => void;
}

// All possible programs defined in the system
const ALL_PROGRAMS: Program[] = [
  "Customer Reported",
  "Asia Inspection",
  "Deluxing",
  "X-Ray QC",
  "Returns",
  "QC",
  "Pre-Shipment Inspection",
  "Inbound QC",
  "Warehouse Audit",
  "Supplier Audit",
  "Random Sampling",
  "Batch Testing",
];

const getProgramColor = (program: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    "Customer Reported": { bg: "bg-red-100", text: "text-red-800", border: "border-red-300" },
    "Asia Inspection": { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-300" },
    "Deluxing": { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-300" },
    "X-Ray QC": { bg: "bg-purple-100", text: "text-purple-800", border: "border-purple-300" },
    "Returns": { bg: "bg-orange-100", text: "text-orange-800", border: "border-orange-300" },
    "QC": { bg: "bg-green-100", text: "text-green-800", border: "border-green-300" },
    "Pre-Shipment Inspection": { bg: "bg-indigo-100", text: "text-indigo-800", border: "border-indigo-300" },
    "Inbound QC": { bg: "bg-cyan-100", text: "text-cyan-800", border: "border-cyan-300" },
    "Warehouse Audit": { bg: "bg-pink-100", text: "text-pink-800", border: "border-pink-300" },
    "Supplier Audit": { bg: "bg-teal-100", text: "text-teal-800", border: "border-teal-300" },
    "Random Sampling": { bg: "bg-amber-100", text: "text-amber-800", border: "border-amber-300" },
    "Batch Testing": { bg: "bg-emerald-100", text: "text-emerald-800", border: "border-emerald-300" },
  };
  return colors[program] || { bg: "bg-gray-100", text: "text-gray-800", border: "border-gray-300" };
};

export default function IntelligenceSidebar({
  sku,
  selectedProgram,
  onProgramChange,
}: IntelligenceSidebarProps) {
  // Count incidents per program
  const programCounts = sku.evidence.reduce((acc, ev) => {
    acc[ev.program] = (acc[ev.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Include all possible programs, even if they have zero counts
  const allPrograms = ["All", ...ALL_PROGRAMS];
  const totalCount = sku.evidence.length;

  return (
    <div className="space-y-6">
      {/* Product Information */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Product Information
        </h3>
        <div className="space-y-3">
          {sku.poNumber && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">PO Number</span>
              <span className="text-sm font-medium text-gray-900">{sku.poNumber}</span>
            </div>
          )}
          {sku.wayfairSKU && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Wayfair SKU</span>
              <span className="text-sm font-medium text-gray-900">{sku.wayfairSKU}</span>
            </div>
          )}
          {sku.productID && (
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-1">Product ID</span>
              <span className="text-sm font-medium text-gray-900">{sku.productID}</span>
            </div>
          )}
          <div className="flex flex-col pt-2 border-t border-slate-200">
            <span className="text-xs text-gray-500 mb-1">SKU</span>
            <span className="text-sm font-medium text-gray-900">{sku.sku}</span>
          </div>
        </div>
      </div>

      {/* AI Root Cause Card */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          AI Root Cause
        </h3>
        <p className="text-sm text-gray-700 mb-4">{sku.aiRootCause}</p>
        <div className="flex flex-wrap gap-2">
          {sku.aiDefectTypes.map((defect, idx) => (
            <Badge key={idx} variant="default" className="bg-indigo-100 text-indigo-800">
              {defect}
            </Badge>
          ))}
        </div>
      </div>

      {/* Program Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Programs Flagged
        </h3>
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {sku.programsFlagged.map((program, idx) => {
              const colors = getProgramColor(program);
              return (
                <div
                  key={idx}
                  className={`group relative inline-flex items-center px-2.5 py-1 rounded-md border ${colors.bg} ${colors.border} ${colors.text} text-xs font-medium cursor-help transition-all hover:scale-105 hover:shadow-sm`}
                  title={`${program} - ${programCounts[program] || 0} incidents flagged`}
                >
                  <span className="truncate max-w-[140px]">{program}</span>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                    {program}
                    <div className="text-gray-300 mt-1">
                      {programCounts[program] || 0} incident{programCounts[program] !== 1 ? 's' : ''}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="border-4 border-transparent border-t-gray-900"></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <h3 className="text-sm font-semibold text-gray-900 mb-4 mt-6">
          Filter by Program
        </h3>
        <div className="space-y-2">
          {allPrograms.map((program) => {
            const count = program === "All" ? totalCount : programCounts[program] || 0;
            const isActive = selectedProgram === program || (selectedProgram === null && program === "All");
            const programColors = program !== "All" ? getProgramColor(program) : null;
            
            // Tooltip text based on program type
            const getTooltipText = (prog: string) => {
              if (prog === "All") {
                return `Show all ${totalCount} incidents`;
              }
              const programDescriptions: Record<string, string> = {
                "Customer Reported": "Incidents reported directly by customers",
                "Asia Inspection": "Quality inspections conducted in Asia",
                "Deluxing": "Deluxing process quality checks",
                "X-Ray QC": "X-Ray quality control inspections",
                "Returns": "Products returned by customers",
                "QC": "General quality control checks",
                "Pre-Shipment Inspection": "Inspections before shipping",
                "Inbound QC": "Quality checks on inbound shipments",
                "Warehouse Audit": "Warehouse audit findings",
                "Supplier Audit": "Supplier audit results",
                "Random Sampling": "Random sampling quality tests",
                "Batch Testing": "Batch testing quality checks",
              };
              return `${programDescriptions[prog] || prog} - ${count} incident${count !== 1 ? 's' : ''}`;
            };
            
            return (
              <div key={program} className="group relative">
                <button
                  onClick={() => onProgramChange(program === "All" ? null : program)}
                  className={`w-full text-left px-4 py-3 rounded-md transition-all ${
                    isActive
                      ? programColors 
                        ? `${programColors.bg} border-2 ${programColors.border} ${programColors.text}`
                        : "bg-purple-50 border-2 border-purple-600 text-purple-900"
                      : "bg-white border border-slate-200 text-gray-700 hover:bg-slate-50 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{program}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        isActive
                          ? programColors
                            ? `${programColors.bg} ${programColors.text} border ${programColors.border}`
                            : "bg-purple-600 text-white"
                          : "bg-slate-100 text-gray-600"
                      }`}
                    >
                      {count}
                    </span>
                  </div>
                </button>
                {/* Tooltip on hover */}
                <div className="absolute left-full ml-2 top-1/2 transform -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                  {getTooltipText(program)}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 -mr-1">
                    <div className="border-4 border-transparent border-r-gray-900"></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


"use client";

import { SKU } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface IntelligenceSidebarProps {
  sku: SKU;
  selectedProgram: string | null;
  onProgramChange: (program: string | null) => void;
}

export default function IntelligenceSidebar({
  sku,
  selectedProgram,
  onProgramChange,
}: IntelligenceSidebarProps) {
  const programCounts = sku.evidence.reduce((acc, ev) => {
    acc[ev.program] = (acc[ev.program] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const allPrograms = ["All", ...Object.keys(programCounts)];
  const totalCount = sku.evidence.length;

  return (
    <div className="space-y-6">
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
          Filter by Program
        </h3>
        <div className="space-y-2">
          {allPrograms.map((program) => {
            const count = program === "All" ? totalCount : programCounts[program] || 0;
            const isActive = selectedProgram === program || (selectedProgram === null && program === "All");
            
            return (
              <button
                key={program}
                onClick={() => onProgramChange(program === "All" ? null : program)}
                className={`w-full text-left px-4 py-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-purple-50 border-2 border-purple-600 text-purple-900"
                    : "bg-white border border-slate-200 text-gray-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{program}</span>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      isActive
                        ? "bg-purple-600 text-white"
                        : "bg-slate-100 text-gray-600"
                    }`}
                  >
                    {count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}


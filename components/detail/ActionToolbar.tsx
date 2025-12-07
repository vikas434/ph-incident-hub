"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { useToast } from "@/components/ui/Toast";

interface ActionToolbarProps {
  onLimitChange: (limit: number | null) => void;
}

export default function ActionToolbar({ onLimitChange }: ActionToolbarProps) {
  const [limit, setLimit] = useState<number | null>(10);
  const { showToast } = useToast();

  const handleLimitChange = (value: string) => {
    const numValue = value === "all" ? null : parseInt(value);
    setLimit(numValue);
    onLimitChange(numValue);
  };

  const handleShare = () => {
    showToast("Magic Link Generated", "success");
  };

  const handleDownload = () => {
    console.log("Download PDF triggered");
    showToast("PDF download started", "info");
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
          Limit to:
        </label>
        <select
          id="limit-select"
          value={limit === null ? "all" : limit.toString()}
          onChange={(e) => handleLimitChange(e.target.value)}
          className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
        >
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
          <option value="all">All</option>
        </select>
      </div>
      <div className="flex items-center space-x-3">
        <button
          onClick={handleDownload}
          className="inline-flex items-center px-4 py-2 border border-slate-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-slate-50 transition-colors"
        >
          <Download className="w-4 h-4 mr-2" />
          Download PDF
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share with Factory
        </button>
      </div>
    </div>
  );
}


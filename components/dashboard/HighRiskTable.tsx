"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight, Sparkles, Loader2, Calendar, ArrowUpDown } from "lucide-react";
import { SKU } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

export default function HighRiskTable() {
  const router = useRouter();
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzingSkuId, setAnalyzingSkuId] = useState<string | null>(null);
  const [dateFilter, setDateFilter] = useState<string>("12months"); // Default: Last 12 months
  const [sortBy, setSortBy] = useState<string>("sku"); // Default: Sort by SKU Number

  useEffect(() => {
    fetch('/api/skus')
      .then(res => res.json())
      .then(data => {
        setSkus(data.skus || []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching SKUs:', err);
        setLoading(false);
      });
  }, []);

  // Calculate date range based on filter
  const getDateRange = (filter: string): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    const startDate = new Date();
    
    switch (filter) {
      case "1month":
        startDate.setMonth(endDate.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(endDate.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(endDate.getMonth() - 6);
        break;
      case "12months":
        startDate.setMonth(endDate.getMonth() - 12);
        break;
      case "all":
        startDate.setFullYear(2020); // Set to a very early date
        break;
      default:
        startDate.setMonth(endDate.getMonth() - 6);
    }
    
    return { startDate, endDate };
  };

  // Filter SKUs by date range
  const filteredSKUs = useMemo(() => {
    const { startDate, endDate } = getDateRange(dateFilter);
    
    return skus.filter((sku) => {
      if (!sku.isCritical) return false;
      
      // Check if SKU has any evidence within the date range
      const hasEvidenceInRange = sku.evidence.some((ev) => {
        const evidenceDate = new Date(ev.date);
        return evidenceDate >= startDate && evidenceDate <= endDate;
      });
      
      return hasEvidenceInRange;
    });
  }, [skus, dateFilter]);

  const highRiskSKUs = useMemo(() => {
    let sorted = [...filteredSKUs];
    
    // Apply sorting based on selected option
    // Sort alphabetically by SKU number
    sorted.sort((a, b) => {
      const skuA = a.sku || a.name || "";
      const skuB = b.sku || b.name || "";
      return skuA.localeCompare(skuB);
    });
    
    return sorted.slice(0, 15); // Top 15 high-risk
  }, [filteredSKUs, sortBy]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-gray-500">Loading SKU data...</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleAnalyze = (e: React.MouseEvent, skuId: string) => {
    e.stopPropagation(); // Prevent row click
    setAnalyzingSkuId(skuId);
    
    // Show loading for 1 second, then navigate
    setTimeout(() => {
      router.push(`/detail/${skuId}`);
    }, 1000);
  };

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

  return (
    <>
      {/* Generative AI Analysis Loading Overlay */}
      {analyzingSkuId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md mx-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Sparkles className="w-12 h-12 text-purple-600 animate-pulse" />
                <Loader2 className="w-8 h-8 text-purple-600 animate-spin absolute -top-2 -right-2" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Generative AI Analysis
                </h3>
                <p className="text-sm text-gray-600 mb-1">
                  Analyzing product incidents and evidence...
                </p>
                <p className="text-xs text-gray-500">
                  Using AI to identify root causes and recommend actions
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div className="bg-purple-600 h-full rounded-full animate-pulse" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-semibold text-gray-900">
                  High Incident SKU List
                </h2>
                <div className="group relative">
                  <div className="w-4 h-4 rounded-full bg-yellow-100 flex items-center justify-center cursor-help">
                    <span className="text-xs text-yellow-600 font-bold">?</span>
                  </div>
                  <div className="absolute left-0 top-full mt-2 w-72 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    <p className="font-semibold mb-2">The Yellow Zone</p>
                    <p className="mb-2">Products flagged as high-risk requiring immediate attention:</p>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      <li>3+ incidents reported</li>
                      <li>Deductions exceeding $50</li>
                      <li>Multiple quality program flags</li>
                    </ul>
                    <p className="mt-2 text-yellow-300">⚠️ Action required to prevent escalation</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-4 h-4 text-gray-500" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="sku">Sort by SKU Number</option>
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="1month">Last 1 Month</option>
                  <option value="3months">Last 3 Months</option>
                  <option value="6months">Last 6 Months</option>
                  <option value="12months">Last 12 Months</option>
                  <option value="all">All Time</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU/Part Number
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programs Flagged
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incident Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                AI Insight
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {highRiskSKUs.map((sku) => (
              <tr
                key={sku.id}
                onClick={() => router.push(`/detail/${sku.id}`)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-slate-100">
                      <Image
                        src={sku.thumbnail}
                        alt={sku.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {sku.name}
                      </div>
                      <div className="text-sm text-gray-500">{sku.sku}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap items-center gap-2">
                    {sku.programsFlagged.map((program, idx) => {
                      const colors = getProgramColor(program);
                      return (
                        <div
                          key={idx}
                          className={`group relative inline-flex items-center px-2.5 py-1 rounded-md border ${colors.bg} ${colors.border} ${colors.text} text-xs font-medium cursor-help transition-all hover:scale-105 hover:shadow-sm`}
                          title={`${program} - Click to filter by this program`}
                        >
                          <span className="truncate max-w-[120px]">{program}</span>
                          {/* Tooltip on hover */}
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                            {program}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="border-4 border-transparent border-t-gray-900"></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {sku.programsFlagged.length === 0 && (
                      <span className="text-xs text-gray-400">No programs flagged</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant="critical">{sku.incidentRate}%</Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-center space-x-1 group relative">
                        <span className="text-sm text-gray-900 font-medium block">{sku.aiInsight.split(' • ')[0]}</span>
                        <div className="w-3 h-3 rounded-full bg-purple-100 flex items-center justify-center cursor-help">
                          <span className="text-xs text-purple-600 font-bold">?</span>
                        </div>
                        <div className="absolute left-0 top-full mt-2 w-80 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                          <p className="font-semibold mb-2">AI Insight Calculation</p>
                          <p className="mb-2">For critical products (Yellow Zone), numbers are enhanced for visibility:</p>
                          <ul className="list-disc list-inside space-y-1 ml-2 mb-2">
                            <li><strong>Incident Count:</strong> Base count from data, boosted for critical products</li>
                            <li><strong>Financial Impact:</strong> Base deductions × 1000 × multiplier</li>
                            <li><strong>Multipliers:</strong> 1.5x for 5+ incidents, 1.2x for 3+ incidents</li>
                          </ul>
                          <p className="text-purple-300 text-xs mt-2">Example: $12.11 deduction → $12,110 × 1.5 = $18,165</p>
                        </div>
                      </div>
                      {sku.aiInsight.includes(' • ') && (
                        <span className="text-xs text-gray-500 mt-1 block">
                          {sku.aiInsight.split(' • ').slice(1).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={(e) => handleAnalyze(e, sku.id)}
                    disabled={analyzingSkuId === sku.id}
                    className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                  >
                    {analyzingSkuId === sku.id ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Analyze
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}


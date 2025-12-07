"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { SKU } from "@/lib/types";
import Badge from "@/components/ui/Badge";
import Image from "next/image";

export default function HighRiskTable() {
  const router = useRouter();
  const [skus, setSkus] = useState<SKU[]>([]);
  const [loading, setLoading] = useState(true);

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

  const highRiskSKUs = skus
    .filter((sku) => sku.isCritical)
    .sort((a, b) => b.incidentRate - a.incidentRate)
    .slice(0, 15); // Top 15 high-risk

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
    <div className="bg-white rounded-lg shadow-sm border border-slate-200">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-gray-900">
          High Incident SKU List (The Yellow Zone)
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                SKU/Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Programs Flagged
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Incident Rate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                GIE Exposure
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-semibold text-gray-900">
                    {formatCurrency(sku.financialExposure)}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-gray-900 font-medium block">{sku.aiInsight.split(' • ')[0]}</span>
                      {sku.aiInsight.includes(' • ') && (
                        <span className="text-xs text-gray-500 mt-1 block">
                          {sku.aiInsight.split(' • ').slice(1).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="inline-flex items-center text-sm text-purple-600 hover:text-purple-700 font-medium">
                    Analyze
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


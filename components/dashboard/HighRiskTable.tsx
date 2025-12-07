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
    const colors: Record<string, string> = {
      "Customer Reported": "bg-red-500",
      "Asia Inspection": "bg-blue-500",
      "Deluxing": "bg-yellow-500",
      "X-Ray QC": "bg-purple-500",
      Returns: "bg-orange-500",
      QC: "bg-green-500",
    };
    return colors[program] || "bg-gray-500";
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1">
                    {sku.programsFlagged.map((program, idx) => (
                      <div
                        key={idx}
                        className={`w-3 h-3 rounded-full ${getProgramColor(program)}`}
                        title={program}
                      />
                    ))}
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-700">{sku.aiInsight}</span>
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


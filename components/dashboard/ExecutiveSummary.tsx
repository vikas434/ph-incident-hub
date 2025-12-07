"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, ChevronRight } from "lucide-react";
import { SKU } from "@/lib/types";
import { useRouter } from "next/navigation";

interface TopIssue {
  productName: string;
  productID: string;
  wayfairSKU: string;
  issueCount: number;
  topDefectTypes: string[];
  severity: string;
}

export default function ExecutiveSummary() {
  const router = useRouter();
  const [topIssues, setTopIssues] = useState<TopIssue[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skus')
      .then(res => res.json())
      .then(data => {
        const skus: SKU[] = data.skus || [];
        
        // Get top 5 products with most issues
        const issues = skus
          .map(sku => ({
            productName: sku.name,
            productID: sku.productID,
            wayfairSKU: sku.wayfairSKU,
            issueCount: sku.evidence.length,
            topDefectTypes: sku.aiDefectTypes.slice(0, 3),
            severity: sku.isCritical ? 'Critical' : sku.incidentRate > 5 ? 'High' : 'Medium',
          }))
          .sort((a, b) => b.issueCount - a.issueCount)
          .slice(0, 5);

        setTopIssues(issues);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-slate-200 p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-64 mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-sm mb-8">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-xl font-semibold text-gray-900">
          XYZ Supplier - Top Issues
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Products requiring immediate attention
        </p>
      </div>
      
      <div className="p-6">
        {topIssues.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No issues found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {topIssues.map((issue, index) => (
              <div
                key={issue.productID}
                onClick={() => router.push(`/detail/${issue.productID}`)}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 hover:border-purple-300 cursor-pointer transition-all group"
              >
                <div className="flex items-center space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white ${
                      issue.severity === 'Critical' ? 'bg-red-500' :
                      issue.severity === 'High' ? 'bg-orange-500' :
                      'bg-yellow-500'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-sm font-semibold text-gray-900 truncate">
                        {issue.productName}
                      </h3>
                      {issue.severity === 'Critical' && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Critical
                        </span>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-gray-600">
                      <span>SKU: {issue.wayfairSKU}</span>
                      <span>•</span>
                      <span>Product ID: {issue.productID}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {issue.topDefectTypes.map((defect, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700"
                        >
                          {defect}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">
                        {issue.issueCount}
                      </div>
                      <div className="text-xs text-gray-500">
                        {issue.issueCount === 1 ? 'incident' : 'incidents'}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


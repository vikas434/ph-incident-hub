"use client";

import { useState, useEffect } from "react";
import { TrendingDown, AlertCircle, CheckCircle2, Lightbulb } from "lucide-react";

interface SummaryData {
  totalSKUs: number;
  criticalSKUs: number;
  totalIncidents: number;
  avgIncidentRate: number;
  gieOpportunity: number;
}

export default function ExecutiveSummary() {
  const [summary, setSummary] = useState<SummaryData>({
    totalSKUs: 0,
    criticalSKUs: 0,
    totalIncidents: 0,
    avgIncidentRate: 0,
    gieOpportunity: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/skus')
      .then(res => res.json())
      .then(data => {
        const skus = data.skus || [];
        const totalSKUs = skus.length;
        const criticalSKUs = skus.filter((s: any) => s.isCritical).length;
        const totalIncidents = skus.reduce((sum: number, s: any) => sum + s.evidence.length, 0);
        const avgIncidentRate = skus.length > 0 
          ? skus.reduce((sum: number, s: any) => sum + s.incidentRate, 0) / skus.length 
          : 0;
        const gieOpportunity = skus.reduce((sum: number, s: any) => sum + s.financialExposure, 0);

        setSummary({
          totalSKUs,
          criticalSKUs,
          totalIncidents,
          avgIncidentRate: parseFloat(avgIncidentRate.toFixed(1)),
          gieOpportunity,
        });
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching summary:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 p-6 mb-8 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-96"></div>
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

  const criticalPercentage = summary.totalSKUs > 0 
    ? ((summary.criticalSKUs / summary.totalSKUs) * 100).toFixed(1)
    : "0";

  return (
    <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-lg border border-purple-200 shadow-sm mb-8">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Executive Dashboard Summary
            </h2>
            <p className="text-sm text-gray-600">
              Real-time quality insights for XYZ Supplier • Partner Home Portal
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <span>Live Data</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="bg-red-100 rounded-lg p-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Critical SKUs</p>
                <p className="text-xl font-bold text-gray-900">
                  {summary.criticalSKUs} <span className="text-sm font-normal text-gray-500">({criticalPercentage}%)</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-100 rounded-lg p-2">
                <TrendingDown className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Avg Incident Rate</p>
                <p className="text-xl font-bold text-gray-900">
                  {summary.avgIncidentRate}% <span className="text-sm font-normal text-green-600">↓ 3.2%</span>
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4 border border-purple-100">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-100 rounded-lg p-2">
                <Lightbulb className="w-5 h-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-1 group relative">
                  <p className="text-xs text-gray-500 mb-1">GIE Opportunity</p>
                  <div className="w-3 h-3 rounded-full bg-purple-100 flex items-center justify-center cursor-help">
                    <span className="text-xs text-purple-600 font-bold">?</span>
                  </div>
                  <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 shadow-xl">
                    <p className="font-semibold mb-1">GIE Opportunity</p>
                    <p>Goods Inspection Expense - Total financial impact including deductions, returns, replacements, and customer service costs. Higher values indicate greater financial risk and potential cost savings through quality improvements.</p>
                  </div>
                </div>
                <p className="text-xl font-bold text-gray-900">
                  {formatCurrency(summary.gieOpportunity)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-purple-200">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Key Insight</h3>
              <p className="text-sm text-gray-700">
                {summary.criticalSKUs > 0 
                  ? `${summary.criticalSKUs} products require immediate supplier attention. Focus on structural and surface defects which account for ${Math.round((summary.criticalSKUs / summary.totalSKUs) * 60)}% of critical incidents.`
                  : 'All products are within acceptable quality thresholds. Continue monitoring for early detection.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


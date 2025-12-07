"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Eye, TrendingDown, Package } from "lucide-react";
import KPICard from "./KPICard";

interface KPIs {
  criticalSKUs: number;
  photosAnalyzed: number;
  gieOpportunity: number;
  suppliersAffected: number;
}

export default function KPIScorecard() {
  const [kpis, setKpis] = useState<KPIs>({
    criticalSKUs: 0,
    photosAnalyzed: 0,
    gieOpportunity: 0,
    suppliersAffected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/kpis')
      .then(res => res.json())
      .then(data => {
        setKpis(data.kpis || kpis);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching KPIs:', err);
        setLoading(false);
      });
  }, []);
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    })
      .format(value / 1000000)
      .replace("$", "$")
      .replace(/\.0$/, "") + "M";
  };

  const formatNumber = (value: number) => {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + "M";
    }
    return value.toLocaleString();
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        label="Critical SKUs"
        value={kpis.criticalSKUs}
        icon={AlertTriangle}
        bgColor="bg-red-50"
      />
      <KPICard
        label="Photos Analyzed"
        value={formatNumber(kpis.photosAnalyzed)}
        icon={Eye}
        bgColor="bg-blue-50"
      />
      <KPICard
        label="GIE Opportunity"
        value={formatCurrency(kpis.gieOpportunity)}
        icon={TrendingDown}
        bgColor="bg-orange-50"
      />
      <KPICard
        label="Suppliers Affected"
        value={kpis.suppliersAffected.toLocaleString()}
        icon={Package}
        bgColor="bg-green-50"
      />
    </div>
  );
}


import { AlertTriangle, Eye, TrendingDown, Package } from "lucide-react";
import KPICard from "./KPICard";
import { aggregateKPIs } from "@/lib/mockData";

export default function KPIScorecard() {
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <KPICard
        label="Critical SKUs"
        value={aggregateKPIs.criticalSKUs}
        icon={AlertTriangle}
        bgColor="bg-red-50"
      />
      <KPICard
        label="Photos Analyzed"
        value={formatNumber(aggregateKPIs.photosAnalyzed)}
        icon={Eye}
        bgColor="bg-blue-50"
      />
      <KPICard
        label="GIE Opportunity"
        value={formatCurrency(aggregateKPIs.gieOpportunity)}
        icon={TrendingDown}
        bgColor="bg-orange-50"
      />
      <KPICard
        label="Suppliers Affected"
        value={aggregateKPIs.suppliersAffected.toLocaleString()}
        icon={Package}
        bgColor="bg-green-50"
      />
    </div>
  );
}


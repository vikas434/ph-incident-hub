import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  bgColor: string;
  trend?: number; // Percentage change
  trendLabel?: string; // e.g., "vs last month"
  subtitle?: string;
}

export default function KPICard({ 
  label, 
  value, 
  icon: Icon, 
  bgColor, 
  trend,
  trendLabel = "vs last period",
  subtitle 
}: KPICardProps) {
  const isPositive = trend !== undefined && trend < 0; // Negative trend is good for incidents
  const isNegative = trend !== undefined && trend > 0;
  const TrendIcon = isPositive ? TrendingDown : isNegative ? TrendingUp : Minus;
  const trendColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500";

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-all hover:border-purple-300">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          {subtitle && (
            <p className="text-xs text-gray-500 mb-2">{subtitle}</p>
          )}
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center space-x-1">
              <TrendIcon className={`w-4 h-4 ${trendColor}`} />
              <span className={`text-sm font-semibold ${trendColor}`}>
                {Math.abs(trend).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">{trendLabel}</span>
            </div>
          )}
        </div>
        <div className={`${bgColor} rounded-lg p-3`}>
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
}



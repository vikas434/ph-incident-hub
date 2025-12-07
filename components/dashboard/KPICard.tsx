import { LucideIcon } from "lucide-react";

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  bgColor: string;
}

export default function KPICard({ label, value, icon: Icon, bgColor }: KPICardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`${bgColor} rounded-lg p-3`}>
          <Icon className="w-6 h-6 text-purple-600" />
        </div>
      </div>
    </div>
  );
}


import KPIScorecard from "@/components/dashboard/KPIScorecard";
import HighRiskTable from "@/components/dashboard/HighRiskTable";

export default function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <KPIScorecard />
        <HighRiskTable />
      </div>
    </main>
  );
}


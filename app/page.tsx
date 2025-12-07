"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import KPIScorecard from "@/components/dashboard/KPIScorecard";
import HighRiskTable from "@/components/dashboard/HighRiskTable";
import ExecutiveSummary from "@/components/dashboard/ExecutiveSummary";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ExecutiveSummary />
        <KPIScorecard />
        <HighRiskTable />
      </div>
    </main>
  );
}


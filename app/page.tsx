"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getSupplierName } from "@/lib/auth";
import KPIScorecard from "@/components/dashboard/KPIScorecard";
import HighRiskTable from "@/components/dashboard/HighRiskTable";

export default function Dashboard() {
  const router = useRouter();
  const [supplierName, setSupplierName] = useState("ABC Manufacturer");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    } else {
      setSupplierName(getSupplierName() || "ABC Manufacturer");
    }
  }, [router]);

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {supplierName}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Here's your quality dashboard overview
          </p>
        </div>
        
        <KPIScorecard />
        <HighRiskTable />
      </div>
    </main>
  );
}


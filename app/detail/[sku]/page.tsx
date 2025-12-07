"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { mockSKUs } from "@/lib/mockData";
import DetailHeader from "@/components/detail/DetailHeader";
import ActionToolbar from "@/components/detail/ActionToolbar";
import IntelligenceSidebar from "@/components/detail/IntelligenceSidebar";
import EvidenceGallery from "@/components/detail/EvidenceGallery";

export default function DetailPage() {
  const params = useParams();
  const skuId = params.sku as string;
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [imageLimit, setImageLimit] = useState<number | null>(10);

  const sku = mockSKUs.find((s) => s.id === skuId);

  if (!sku) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">SKU Not Found</h1>
          <p className="text-gray-600">The requested SKU could not be found.</p>
        </div>
      </div>
    );
  }

  const filteredEvidence = useMemo(() => {
    let evidence = sku.evidence;
    
    if (selectedProgram && selectedProgram !== "All") {
      evidence = evidence.filter((e) => e.program === selectedProgram);
    }
    
    if (imageLimit !== null) {
      evidence = evidence.slice(0, imageLimit);
    }
    
    return evidence;
  }, [sku.evidence, selectedProgram, imageLimit]);

  return (
    <main className="min-h-screen bg-slate-50">
      <DetailHeader sku={sku.sku} name={sku.name} manufacturer={sku.manufacturer} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ActionToolbar onLimitChange={setImageLimit} />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <IntelligenceSidebar
              sku={sku}
              selectedProgram={selectedProgram}
              onProgramChange={setSelectedProgram}
            />
          </div>
          <div className="lg:col-span-2">
            <EvidenceGallery evidence={filteredEvidence} />
          </div>
        </div>
      </div>
    </main>
  );
}


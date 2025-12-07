"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { SKU } from "@/lib/types";
import DetailHeader from "@/components/detail/DetailHeader";
import IntelligenceSidebar from "@/components/detail/IntelligenceSidebar";
import EvidenceGallery from "@/components/detail/EvidenceGallery";

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [imageLimit, setImageLimit] = useState<number | null>(10);
  const [sku, setSku] = useState<SKU | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get product ID from localStorage using the token
    if (typeof window !== "undefined") {
      const productID = localStorage.getItem(`share_token_${token}`);
      
      if (!productID) {
        setError("Invalid or expired share link");
        setLoading(false);
        return;
      }

      // Fetch SKU data
      fetch(`/api/skus/${productID}`)
        .then(res => res.json())
        .then(data => {
          setSku(data.sku || null);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching SKU:', err);
          setError("Failed to load product data");
          setLoading(false);
        });
    }
  }, [token]);

  const filteredEvidence = useMemo(() => {
    if (!sku) return [];
    
    let evidence = sku.evidence;
    
    if (selectedProgram && selectedProgram !== "All") {
      evidence = evidence.filter((e) => e.program === selectedProgram);
    }
    
    if (imageLimit !== null) {
      evidence = evidence.slice(0, imageLimit);
    }
    
    return evidence;
  }, [sku, selectedProgram, imageLimit]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Loading product data...</p>
        </div>
      </div>
    );
  }

  if (error || !sku) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">{error || "The requested product could not be found."}</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Public Share Banner */}
      <div className="bg-purple-600 text-white py-2 px-4 text-center text-sm">
        <span className="font-medium">🔗 Public Share Link</span> - This page is accessible without login
      </div>
      
      <DetailHeader 
        sku={sku.sku} 
        name={sku.name} 
        manufacturer={sku.manufacturer}
        poNumber={sku.poNumber}
        wayfairSKU={sku.wayfairSKU}
        productID={sku.productID}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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


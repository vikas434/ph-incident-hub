"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { SKU, Evidence, Program, Severity } from "@/lib/types";
import DetailHeader from "@/components/detail/DetailHeader";
import IntelligenceSidebar from "@/components/detail/IntelligenceSidebar";
import EvidenceGallery from "@/components/detail/EvidenceGallery";

export default function SharePage() {
  const params = useParams();
  const token = params.token as string;
  const [selectedProgram, setSelectedProgram] = useState<string | null>(null);
  const [imageLimit, setImageLimit] = useState<number | null>(5);
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

  // Generate dummy evidence to fill the space when needed
  const generateDummyEvidence = (count: number, baseId: string, existingPrograms: string[]): Evidence[] => {
    const programs: Program[] = [
      "Customer Reported",
      "Asia Inspection",
      "Deluxing",
      "X-Ray QC",
      "Returns",
      "QC",
      "Pre-Shipment Inspection",
      "Inbound QC",
      "Warehouse Audit",
      "Supplier Audit",
      "Random Sampling",
      "Batch Testing",
    ];
    
    const defectTypes = [
      "Surface Defect",
      "Structural Issue",
      "Packaging Damage",
      "Color Mismatch",
      "Finish Quality",
      "Assembly Problem",
      "Material Defect",
      "Contamination",
    ];
    
    const severities: Severity[] = ["Critical", "High", "Medium", "Low"];
    
    // Use programs not already in use, or cycle through all programs
    const availablePrograms = programs.filter(p => !existingPrograms.includes(p));
    const programsToUse = availablePrograms.length > 0 ? availablePrograms : programs;
    
    return Array.from({ length: count }, (_, index) => {
      const programIndex = index % programsToUse.length;
      const program = programsToUse[programIndex];
      const severity = severities[index % severities.length];
      const defectType = defectTypes[index % defectTypes.length];
      const daysAgo = 30 + (index * 2); // Spread dates over time
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      // Use the specified Unsplash image for dummy evidence
      // Using the brown wooden framed yellow padded chair image
      return {
        id: `dummy-${baseId}-${index}`,
        imageUrl: `https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop`,
        severity,
        program,
        date: date.toISOString().split('T')[0],
        defectType,
        note: `Sample ${defectType.toLowerCase()} detected during ${program.toLowerCase()}`,
      };
    });
  };

  const filteredEvidence = useMemo(() => {
    if (!sku) return [];
    
    let evidence = sku.evidence;
    
    if (selectedProgram && selectedProgram !== "All") {
      evidence = evidence.filter((e) => e.program === selectedProgram);
    }
    
    // If limit is set and we have less evidence than the limit, add dummy evidence
    if (imageLimit !== null && evidence.length < imageLimit) {
      const needed = imageLimit - evidence.length;
      const existingPrograms = evidence.map(e => e.program);
      const dummyEvidence = generateDummyEvidence(needed, sku.id, existingPrograms);
      evidence = [...evidence, ...dummyEvidence];
    } else if (imageLimit !== null) {
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
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <label htmlFor="limit-select" className="text-sm font-medium text-gray-700">
              Limit to:
            </label>
            <select
              id="limit-select"
              value={imageLimit === null ? "all" : imageLimit.toString()}
              onChange={(e) => setImageLimit(e.target.value === "all" ? null : parseInt(e.target.value))}
              className="border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>
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


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
    
    // Realistic image URLs mapped to defect types and scenarios
    const evidenceScenarios = [
      // Surface Defects
      {
        defectType: "Surface Defect",
        program: "Customer Reported",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
        note: "Customer reported visible scratches and scuff marks on product surface",
      },
      {
        defectType: "Surface Defect",
        program: "Returns",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Returned item shows surface imperfections and finish inconsistencies",
      },
      {
        defectType: "Surface Defect",
        program: "QC",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&q=80",
        note: "Quality control inspection identified surface blemishes and finish defects",
      },
      // Structural Issues
      {
        defectType: "Structural Issue",
        program: "Customer Reported",
        severity: "Critical" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop&q=80",
        note: "Customer reported structural damage - frame appears warped and unstable",
      },
      {
        defectType: "Structural Issue",
        program: "Asia Inspection",
        severity: "Critical" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop&q=80",
        note: "Pre-shipment inspection found structural integrity concerns",
      },
      {
        defectType: "Structural Issue",
        program: "X-Ray QC",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
        note: "X-Ray inspection revealed internal structural anomalies",
      },
      // Packaging Damage
      {
        defectType: "Packaging Damage",
        program: "Returns",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1604917018707-72a5d0a8b3b3?w=800&h=600&fit=crop&q=80",
        note: "Product returned due to damaged packaging and potential product impact",
      },
      {
        defectType: "Packaging Damage",
        program: "Inbound QC",
        severity: "Low" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1604917018707-72a5d0a8b3b3?w=800&h=600&fit=crop&q=80",
        note: "Inbound quality check identified packaging damage during warehouse receipt",
      },
      {
        defectType: "Packaging Damage",
        program: "Warehouse Audit",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1604917018707-72a5d0a8b3b3?w=800&h=600&fit=crop&q=80",
        note: "Warehouse audit found packaging integrity issues in storage",
      },
      // Color Mismatch
      {
        defectType: "Color Mismatch",
        program: "Customer Reported",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Customer complaint: product color does not match advertised specifications",
      },
      {
        defectType: "Color Mismatch",
        program: "Deluxing",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&q=80",
        note: "Deluxing process identified color variations between units",
      },
      {
        defectType: "Color Mismatch",
        program: "Pre-Shipment Inspection",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Pre-shipment inspection flagged color inconsistency in batch",
      },
      // Finish Quality
      {
        defectType: "Finish Quality",
        program: "Customer Reported",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
        note: "Customer reported poor finish quality - uneven coating and rough texture",
      },
      {
        defectType: "Finish Quality",
        program: "QC",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&q=80",
        note: "Quality control inspection found finish defects and coating issues",
      },
      {
        defectType: "Finish Quality",
        program: "Supplier Audit",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Supplier audit identified finish quality inconsistencies in production",
      },
      // Assembly Problem
      {
        defectType: "Assembly Problem",
        program: "Customer Reported",
        severity: "Critical" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop&q=80",
        note: "Customer reported assembly issues - parts not fitting correctly",
      },
      {
        defectType: "Assembly Problem",
        program: "Returns",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop&q=80",
        note: "Returned item has assembly defects - misaligned components",
      },
      {
        defectType: "Assembly Problem",
        program: "Asia Inspection",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop&q=80",
        note: "Asia inspection found assembly quality issues before shipment",
      },
      // Material Defect
      {
        defectType: "Material Defect",
        program: "Customer Reported",
        severity: "Critical" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Customer reported material defects - visible cracks and weaknesses",
      },
      {
        defectType: "Material Defect",
        program: "X-Ray QC",
        severity: "Critical" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop&q=80",
        note: "X-Ray QC detected material defects and internal flaws",
      },
      {
        defectType: "Material Defect",
        program: "Batch Testing",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=800&h=600&fit=crop&q=80",
        note: "Batch testing revealed material quality issues in sample",
      },
      // Contamination
      {
        defectType: "Contamination",
        program: "Customer Reported",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800&h=600&fit=crop&q=80",
        note: "Customer reported foreign material contamination on product",
      },
      {
        defectType: "Contamination",
        program: "Inbound QC",
        severity: "Medium" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1604917018707-72a5d0a8b3b3?w=800&h=600&fit=crop&q=80",
        note: "Inbound QC inspection found contamination during warehouse receipt",
      },
      {
        defectType: "Contamination",
        program: "Random Sampling",
        severity: "High" as Severity,
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop&q=80",
        note: "Random sampling test identified contamination in product batch",
      },
    ];
    
    // Use programs not already in use, or cycle through all programs
    const availablePrograms = programs.filter(p => !existingPrograms.includes(p));
    const programsToUse = availablePrograms.length > 0 ? availablePrograms : programs;
    
    // Program distribution for first 5 items: 2x Customer Reported, 1x Deluxing, 1x X-Ray QC, 1x Inbound QC
    const firstFivePrograms: Program[] = [
      'Customer Reported',
      'Customer Reported',
      'Deluxing',
      'X-Ray QC',
      'Inbound QC'
    ];
    
    return Array.from({ length: count }, (_, index) => {
      // Cycle through evidence scenarios to get realistic combinations
      const scenarioIndex = index % evidenceScenarios.length;
      const scenario = evidenceScenarios[scenarioIndex];
      
      // Use specific program distribution for first 5 items
      let program: Program;
      if (index < 5) {
        program = firstFivePrograms[index];
      } else {
        // For items beyond 5, use scenario program or fall back to available programs
        program = scenario.program;
        if (!programsToUse.includes(program as Program)) {
          const programIndex = index % programsToUse.length;
          program = programsToUse[programIndex];
        }
      }
      
      // Generate varied dates - spread over last 90 days with some randomness
      const baseDaysAgo = 5 + (index * 3); // Start from 5 days ago, increment by 3
      const randomOffset = Math.floor(Math.random() * 7); // Add 0-6 days randomness
      const daysAgo = Math.min(90, baseDaysAgo + randomOffset);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      
      return {
        id: `dummy-${baseId}-${index}`,
        imageUrl: scenario.imageUrl,
        severity: scenario.severity,
        program: program as Program,
        date: date.toISOString().split('T')[0],
        defectType: scenario.defectType,
        note: scenario.note,
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
              onChange={(e) => {
                // When "All" is selected, set to 50 items by default
                const value = e.target.value === "all" ? 50 : parseInt(e.target.value);
                setImageLimit(value);
              }}
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


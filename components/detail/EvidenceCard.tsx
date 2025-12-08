"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Evidence } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface EvidenceCardProps {
  evidence: Evidence;
  index?: number; // Optional index to identify position
}

export default function EvidenceCard({ evidence, index = 0 }: EvidenceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getSeverityVariant = (severity: string): "critical" | "high" | "medium" | "low" => {
    switch (severity) {
      case "Critical":
        return "critical";
      case "High":
        return "high";
      case "Medium":
        return "medium";
      default:
        return "low";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Creative overlay text based on defect type
  const getOverlayText = (defectType: string): string => {
    const overlayTexts: Record<string, string> = {
      'Surface Defect': 'Surface Quality Issue',
      'Structural Issue': 'Structural Damage Detected',
      'Packaging Damage': 'Packaging Compromised',
      'Color Mismatch': 'Color Inconsistency',
      'Finish Quality': 'Finish Quality Issue',
      'Finish Quality Issue': 'Finish Quality Issue',
      'Assembly Problem': 'Assembly Defect',
      'Material Defect': 'Material Quality Issue',
      'Contamination': 'Contamination Found',
      'Scratch': 'Surface Scratch',
      'Dent': 'Surface Dent',
      'Crack': 'Structural Crack',
      'Chip': 'Material Chip',
      'Warping': 'Warped Component',
      'Misalignment': 'Misaligned Parts',
      'Peeling Finish': 'Finish Peeling',
      'Discoloration': 'Color Discoloration',
      'Missing Parts': 'Missing Components',
      'Loose Parts': 'Loose Assembly',
      'Stain': 'Surface Stain',
      'Odor': 'Odor Issue',
      'Mold': 'Mold Contamination',
      'Paint Defect': 'Paint Quality Issue',
      'Water Damage': 'Water Damage',
      'Broken Component': 'Broken Part',
      'Torn Material': 'Torn Material',
    };
    
    return overlayTexts[defectType] || defectType;
  };

  const handleClick = () => {
    if (evidence.imageUrl) {
      window.open(evidence.imageUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-all duration-300 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Image Container */}
      <div className="relative h-48 bg-slate-100 overflow-hidden">
        <Image
          src={evidence.imageUrl}
          alt={evidence.defectType}
          fill
          className={`object-cover transition-transform duration-300 ${
            isHovered ? "scale-105" : ""
          }`}
        />
        
        {/* Dummy Image Watermark */}
        {evidence.id.startsWith('dummy-') && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
            <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border-2 border-dashed border-gray-400">
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                Dummy Image
              </span>
            </div>
          </div>
        )}
        
        {/* Severity Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={getSeverityVariant(evidence.severity)}>
            {evidence.severity}
          </Badge>
        </div>

        {/* Defect Type Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="text-white text-xs font-medium">
            {/* First two items show "Customer Reported" if program is Customer Reported */}
            {/* Index 2 shows "Deluxing" if program is Deluxing */}
            {/* Index 3 shows "Inbound QC" if program is Inbound QC */}
            {index < 2 && evidence.program === "Customer Reported"
              ? "Customer Reported"
              : index === 2 && evidence.program === "Deluxing"
              ? "Deluxing"
              : index === 3 && evidence.program === "Inbound QC"
              ? "Inbound QC"
              : getOverlayText(evidence.defectType)}
          </span>
        </div>

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center transition-opacity duration-300">
            <div className="bg-white rounded-full p-3 shadow-lg">
              <ExternalLink className="w-5 h-5 text-purple-600" />
            </div>
          </div>
        )}
      </div>

      {/* Metadata */}
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 mb-1">{evidence.defectType}</h4>
        <p className="text-xs text-gray-500 mb-2">{formatDate(evidence.date)}</p>
        <p className="text-sm text-gray-600 line-clamp-2">{evidence.note}</p>
      </div>
    </div>
  );
}


"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import { Evidence } from "@/lib/types";
import Badge from "@/components/ui/Badge";

interface EvidenceCardProps {
  evidence: Evidence;
}

export default function EvidenceCard({ evidence }: EvidenceCardProps) {
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
        
        {/* Severity Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant={getSeverityVariant(evidence.severity)}>
            {evidence.severity}
          </Badge>
        </div>

        {/* Program Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
          <span className="text-white text-xs font-medium">{evidence.program}</span>
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


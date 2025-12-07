import { Evidence } from "@/lib/types";
import EvidenceCard from "./EvidenceCard";

interface EvidenceGalleryProps {
  evidence: Evidence[];
}

export default function EvidenceGallery({ evidence }: EvidenceGalleryProps) {
  if (evidence.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-12 text-center">
        <p className="text-gray-500">No evidence found for the selected filters.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {evidence.map((item) => (
        <EvidenceCard key={item.id} evidence={item} />
      ))}
    </div>
  );
}


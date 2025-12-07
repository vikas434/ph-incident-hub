export type Severity = "Critical" | "High" | "Medium" | "Low";

export type Program =
  | "Customer Reported"
  | "Asia Inspection"
  | "Deluxing"
  | "X-Ray QC"
  | "Returns"
  | "QC";

export interface Evidence {
  id: string;
  imageUrl: string;
  severity: Severity;
  program: Program;
  date: string;
  defectType: string;
  note: string;
}

export interface KPIMetric {
  label: string;
  value: string | number;
  icon: string;
  bgColor: string;
}

export interface SKU {
  id: string;
  sku: string;
  name: string;
  manufacturer: string;
  thumbnail: string;
  isCritical: boolean;
  photoVolume: number;
  financialExposure: number;
  programsFlagged: Program[];
  incidentRate: number;
  aiInsight: string;
  aiRootCause: string;
  aiDefectTypes: string[];
  evidence: Evidence[];
  poNumber?: string;
  wayfairSKU: string;
  productID: string;
}


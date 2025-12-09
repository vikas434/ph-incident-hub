import { SKU, Evidence } from "./types";

// Generate mock evidence items
const generateEvidence = (
  count: number,
  programs: string[],
  severities: string[],
  defectTypes: string[]
): Evidence[] => {
  const evidence: Evidence[] = [];
  const baseDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const programIndex = Math.floor(Math.random() * programs.length);
    const severityIndex = Math.floor(Math.random() * severities.length);
    const defectIndex = Math.floor(Math.random() * defectTypes.length);
    const daysAgo = Math.floor(Math.random() * 90);
    const date = new Date(baseDate);
    date.setDate(date.getDate() - daysAgo);
    
    evidence.push({
      id: `ev-${i + 1}`,
      imageUrl: `https://images.unsplash.com/photo-${1558618666 + i}?w=400&h=400&fit=crop`,
      severity: severities[severityIndex] as Evidence["severity"],
      program: programs[programIndex] as Evidence["program"],
      date: date.toISOString().split("T")[0],
      defectType: defectTypes[defectIndex],
      note: `Sample defect note ${i + 1}: ${defectTypes[defectIndex]} detected during ${programs[programIndex]}`,
    });
  }
  
  return evidence;
};

export const mockSKUs: SKU[] = [
  {
    id: "sku-001",
    sku: "WF-12345-ABC",
    name: "Modern Sofa Sectional",
    manufacturer: "Furniture Co. Ltd.",
    thumbnail: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop",
    isCritical: true,
    photoVolume: 1250,
    financialExposure: 1250000,
    programsFlagged: ["Customer Reported", "Asia Inspection", "X-Ray QC"],
    incidentRate: 8.5,
    aiInsight: "Pattern Detected",
    aiRootCause: "Color mismatch between product samples and final production batches. Packaging failures observed in 15% of inspected units.",
    aiDefectTypes: ["Color Mismatch", "Packaging Failure"],
    wayfairSKU: "WF-12345-ABC",
    productID: "sku-001",
    evidence: [
      {
        id: "ev-1",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        severity: "Critical",
        program: "Customer Reported",
        date: "2024-01-15",
        defectType: "Color Mismatch",
        note: "Customer reported significant color difference from website images",
      },
      {
        id: "ev-2",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        severity: "High",
        program: "Asia Inspection",
        date: "2024-01-10",
        defectType: "Color Mismatch",
        note: "Pre-shipment inspection detected color variance in batch #1234",
      },
      {
        id: "ev-3",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
        severity: "Critical",
        program: "X-Ray QC",
        date: "2024-01-08",
        defectType: "Packaging Failure",
        note: "X-Ray scan revealed damaged packaging structure",
      },
      ...generateEvidence(12, ["Deluxing", "Returns", "QC"], ["High", "Medium"], ["Packaging Failure", "Structural Defect"]),
    ],
  },
  {
    id: "sku-002",
    sku: "WF-67890-XYZ",
    name: "Dining Table Set",
    manufacturer: "Woodcraft Industries",
    thumbnail: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=100&h=100&fit=crop",
    isCritical: true,
    photoVolume: 890,
    financialExposure: 980000,
    programsFlagged: ["Customer Reported", "Deluxing"],
    incidentRate: 6.2,
    aiInsight: "Pattern Detected",
    aiRootCause: "Surface finish inconsistencies and wood grain misalignment detected across multiple batches.",
    aiDefectTypes: ["Surface Finish", "Grain Misalignment"],
    wayfairSKU: "WF-67890-XYZ",
    productID: "sku-002",
    evidence: [
      {
        id: "ev-20",
        imageUrl: "https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop",
        severity: "High",
        program: "Customer Reported",
        date: "2024-01-12",
        defectType: "Surface Finish",
        note: "Customer complaint about rough surface texture",
      },
      {
        id: "ev-21",
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        severity: "Medium",
        program: "Deluxing",
        date: "2024-01-09",
        defectType: "Grain Misalignment",
        note: "Deluxing process revealed grain pattern inconsistencies",
      },
      ...generateEvidence(8, ["Returns", "QC"], ["High", "Medium"], ["Surface Finish", "Grain Misalignment"]),
    ],
  },
  {
    id: "sku-003",
    sku: "WF-11111-DEF",
    name: "Bedroom Dresser",
    manufacturer: "Furniture Co. Ltd.",
    thumbnail: "https://images.unsplash.com/photo-1551292831-023188e78222?w=100&h=100&fit=crop",
    isCritical: false,
    photoVolume: 650,
    financialExposure: 450000,
    programsFlagged: ["X-Ray QC", "Asia Inspection"],
    incidentRate: 4.1,
    aiInsight: "Pattern Detected",
    aiRootCause: "Hardware attachment issues and drawer mechanism failures.",
    aiDefectTypes: ["Hardware Issue", "Mechanism Failure"],
    wayfairSKU: "WF-11111-DEF",
    productID: "sku-003",
    evidence: [
      {
        id: "ev-30",
        imageUrl: "https://images.unsplash.com/photo-1551292831-023188e78222?w=800&h=600&fit=crop",
        severity: "High",
        program: "X-Ray QC",
        date: "2024-01-11",
        defectType: "Hardware Issue",
        note: "X-Ray detected loose hardware connections",
      },
      {
        id: "ev-31",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        severity: "Medium",
        program: "Asia Inspection",
        date: "2024-01-07",
        defectType: "Mechanism Failure",
        note: "Drawer slide mechanism not functioning properly",
      },
      ...generateEvidence(6, ["QC", "Returns"], ["Medium", "Low"], ["Hardware Issue", "Mechanism Failure"]),
    ],
  },
  {
    id: "sku-004",
    sku: "WF-22222-GHI",
    name: "Outdoor Patio Set",
    manufacturer: "Outdoor Living Inc.",
    thumbnail: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=100&h=100&fit=crop",
    isCritical: true,
    photoVolume: 1100,
    financialExposure: 2100000,
    programsFlagged: ["Customer Reported", "Asia Inspection", "Deluxing", "X-Ray QC"],
    incidentRate: 9.8,
    aiInsight: "Pattern Detected",
    aiRootCause: "Weather resistance coating failures and structural integrity concerns in outdoor conditions.",
    aiDefectTypes: ["Coating Failure", "Structural Defect"],
    wayfairSKU: "WF-22222-GHI",
    productID: "sku-004",
    evidence: [
      {
        id: "ev-40",
        imageUrl: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&h=600&fit=crop",
        severity: "Critical",
        program: "Customer Reported",
        date: "2024-01-14",
        defectType: "Coating Failure",
        note: "Customer reported peeling finish after first rain",
      },
      {
        id: "ev-41",
        imageUrl: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&h=600&fit=crop",
        severity: "Critical",
        program: "Asia Inspection",
        date: "2024-01-09",
        defectType: "Coating Failure",
        note: "Pre-shipment inspection showed coating defects",
      },
      {
        id: "ev-42",
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        severity: "High",
        program: "Deluxing",
        date: "2024-01-08",
        defectType: "Structural Defect",
        note: "Deluxing process revealed frame weakness",
      },
      {
        id: "ev-43",
        imageUrl: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
        severity: "High",
        program: "X-Ray QC",
        date: "2024-01-06",
        defectType: "Structural Defect",
        note: "X-Ray scan detected internal frame issues",
      },
      ...generateEvidence(10, ["Returns", "QC"], ["High", "Medium"], ["Coating Failure", "Structural Defect"]),
    ],
  },
  {
    id: "sku-005",
    sku: "WF-33333-JKL",
    name: "Office Chair",
    manufacturer: "Ergonomic Solutions",
    thumbnail: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=100&h=100&fit=crop",
    isCritical: false,
    photoVolume: 420,
    financialExposure: 320000,
    programsFlagged: ["Customer Reported", "Returns"],
    incidentRate: 3.5,
    aiInsight: "Pattern Detected",
    aiRootCause: "Ergonomic adjustment mechanism failures and fabric wear issues.",
    aiDefectTypes: ["Mechanism Failure", "Fabric Wear"],
    wayfairSKU: "WF-33333-JKL",
    productID: "sku-005",
    evidence: [
      {
        id: "ev-50",
        imageUrl: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=600&fit=crop",
        severity: "Medium",
        program: "Customer Reported",
        date: "2024-01-13",
        defectType: "Mechanism Failure",
        note: "Height adjustment mechanism not working",
      },
      {
        id: "ev-51",
        imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
        severity: "Low",
        program: "Returns",
        date: "2024-01-10",
        defectType: "Fabric Wear",
        note: "Premature fabric wear on returned unit",
      },
      ...generateEvidence(5, ["QC"], ["Medium", "Low"], ["Mechanism Failure", "Fabric Wear"]),
    ],
  },
];

// Calculate aggregate KPIs
export const aggregateKPIs = {
  criticalSKUs: mockSKUs.filter((sku) => sku.isCritical).length,
  photosAnalyzed: mockSKUs.reduce((sum, sku) => sum + sku.photoVolume, 0),
  gieOpportunity: mockSKUs.reduce((sum, sku) => sum + sku.financialExposure, 0),
  suppliersAffected: new Set(mockSKUs.map((sku) => sku.manufacturer)).size,
};



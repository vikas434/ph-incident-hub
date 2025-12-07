// This module uses Node.js fs and should only run server-side
import fs from 'fs';
import path from 'path';

// Ensure this only runs on server
if (typeof window !== 'undefined') {
  throw new Error('csvDataLoader can only be used server-side');
}

export interface CSVRow {
  poNumber: string;
  wayfairSKU: string;
  productID: string;
  deliveryDate: string;
  incidentType: string;
  incidentOrReturn: string;
  comment: string;
  photos: string;
  imageID: string;
  imageForIncidentOrReturn: string;
  imageURL: string;
  parcelType: string;
  buyersRemorseReturnCount: number;
  totalIncidentsCount: number;
  lostIncidentsCount: number;
  damageIncidentsCount: number;
  defectIncidentsCount: number;
  misinformationIncidentsCount: number;
  misShippedIncidentsCount: number;
  missingPartsIncidentsCount: number;
  otherIncidentsCount: number;
  totalDeductions: string;
  totalDeductionsCurrency: string;
  improvementPlan: string;
  improvementPlanStartDate: string;
  improvementPlanComment: string;
}

export interface ProductGroup {
  productID: string;
  wayfairSKU: string;
  rows: CSVRow[];
  firstDeliveryDate: string;
  totalIncidents: number;
  totalDeductions: number;
  totalDeductionsCurrency: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result;
}

function parseNumber(value: string): number {
  if (!value || value === 'N/A' || value.trim() === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

function parseDeduction(value: string): number {
  if (!value || value === 'N/A' || value.trim() === '') return 0;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? 0 : parsed;
}

export function loadCSVData(): CSVRow[] {
  const csvPath = path.join(process.cwd(), 'data1.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');
  const lines = fileContent.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return [];
  }
  
  // Skip header row
  const dataLines = lines.slice(1);
  const rows: CSVRow[] = [];
  
  for (const line of dataLines) {
    if (!line.trim()) continue;
    
    const values = parseCSVLine(line);
    
    if (values.length < 25) continue; // Ensure we have enough columns
    
    const row: CSVRow = {
      poNumber: values[0]?.trim() || '',
      wayfairSKU: values[1]?.trim() || '',
      productID: values[2]?.trim() || '',
      deliveryDate: values[3]?.trim() || '',
      incidentType: values[4]?.trim() || '',
      incidentOrReturn: values[5]?.trim() || '',
      comment: values[6]?.trim() || '',
      photos: values[7]?.trim() || '',
      imageID: values[8]?.trim() || '',
      imageForIncidentOrReturn: values[9]?.trim() || '',
      imageURL: values[10]?.trim() || '',
      parcelType: values[11]?.trim() || '',
      buyersRemorseReturnCount: parseNumber(values[12]),
      totalIncidentsCount: parseNumber(values[13]),
      lostIncidentsCount: parseNumber(values[14]),
      damageIncidentsCount: parseNumber(values[15]),
      defectIncidentsCount: parseNumber(values[16]),
      misinformationIncidentsCount: parseNumber(values[17]),
      misShippedIncidentsCount: parseNumber(values[18]),
      missingPartsIncidentsCount: parseNumber(values[19]),
      otherIncidentsCount: parseNumber(values[20]),
      totalDeductions: values[21]?.trim() || '0',
      totalDeductionsCurrency: values[22]?.trim() || 'USD',
      improvementPlan: values[23]?.trim() || '',
      improvementPlanStartDate: values[24]?.trim() || '',
      improvementPlanComment: values[25]?.trim() || '',
    };
    
    // Only include rows with Product ID and valid data
    if (row.productID && row.productID.trim() !== '') {
      rows.push(row);
    }
  }
  
  return rows;
}

export function groupByProductID(rows: CSVRow[]): Map<string, ProductGroup> {
  const groups = new Map<string, ProductGroup>();
  
  for (const row of rows) {
    if (!row.productID) continue;
    
    if (!groups.has(row.productID)) {
      groups.set(row.productID, {
        productID: row.productID,
        wayfairSKU: row.wayfairSKU,
        rows: [],
        firstDeliveryDate: row.deliveryDate,
        totalIncidents: row.totalIncidentsCount,
        totalDeductions: parseDeduction(row.totalDeductions),
        totalDeductionsCurrency: row.totalDeductionsCurrency || 'USD',
      });
    }
    
    const group = groups.get(row.productID)!;
    group.rows.push(row);
    
    // Update earliest delivery date
    if (row.deliveryDate && row.deliveryDate < group.firstDeliveryDate) {
      group.firstDeliveryDate = row.deliveryDate;
    }
    
    // Use max total incidents count (should be same per product, but take max to be safe)
    if (row.totalIncidentsCount > group.totalIncidents) {
      group.totalIncidents = row.totalIncidentsCount;
    }
    
    // Accumulate deductions (if multiple PO numbers)
    const deduction = parseDeduction(row.totalDeductions);
    if (deduction > 0) {
      group.totalDeductions += deduction;
    }
  }
  
  return groups;
}


import { SKU } from './types';
import { loadCSVData, groupByProductID } from './csvDataLoader';
import { transformAllProducts } from './dataTransformer';
import { generateSummary } from './aiSummaryGenerator';

// Cache the loaded data
let cachedSKUs: SKU[] | null = null;
let cachedKPIs: {
  criticalSKUs: number;
  photosAnalyzed: number;
  gieOpportunity: number;
  suppliersAffected: number;
} | null = null;

function loadRealData(): SKU[] {
  if (cachedSKUs) {
    return cachedSKUs;
  }
  
  try {
    const rows = loadCSVData();
    const groups = groupByProductID(rows);
    const skus = transformAllProducts(groups, generateSummary);
    
    cachedSKUs = skus;
    return skus;
  } catch (error) {
    console.error('Error loading real data:', error);
    // Return empty array on error
    return [];
  }
}

function calculateKPIs(skus: SKU[]): {
  criticalSKUs: number;
  photosAnalyzed: number;
  gieOpportunity: number;
  suppliersAffected: number;
} {
  if (cachedKPIs) {
    return cachedKPIs;
  }
  
  const criticalSKUs = skus.filter((sku) => sku.isCritical).length;
  const photosAnalyzed = skus.reduce((sum, sku) => sum + sku.photoVolume, 0);
  const gieOpportunity = skus.reduce((sum, sku) => sum + sku.financialExposure, 0);
  const suppliersAffected = new Set(skus.map((sku) => sku.manufacturer)).size;
  
  cachedKPIs = {
    criticalSKUs,
    photosAnalyzed,
    gieOpportunity,
    suppliersAffected,
  };
  
  return cachedKPIs;
}

// Export real SKU data
export const realSKUs: SKU[] = loadRealData();

// Export aggregate KPIs
export const aggregateKPIs = calculateKPIs(realSKUs);

// Helper function to get SKU by Product ID
export function getSKUByProductID(productID: string): SKU | undefined {
  return realSKUs.find((sku) => sku.id === productID || sku.sku === productID);
}


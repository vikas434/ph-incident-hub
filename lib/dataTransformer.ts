import { SKU, Evidence, Severity, Program } from './types';
import { CSVRow, ProductGroup } from './csvDataLoader';

function mapSeverity(incidentType: string, comment: string): Severity {
  const lowerComment = comment.toLowerCase();
  
  // Critical indicators
  if (
    lowerComment.includes('critical') ||
    lowerComment.includes('severe') ||
    lowerComment.includes('complete') ||
    lowerComment.includes('total') ||
    lowerComment.includes('broken') ||
    lowerComment.includes('shattered') ||
    lowerComment.includes('mold') ||
    lowerComment.includes('water damage')
  ) {
    return 'Critical';
  }
  
  // High indicators
  if (
    lowerComment.includes('major') ||
    lowerComment.includes('significant') ||
    lowerComment.includes('large') ||
    lowerComment.includes('multiple') ||
    lowerComment.includes('extensive') ||
    lowerComment.includes('crack') ||
    lowerComment.includes('chip')
  ) {
    return 'High';
  }
  
  // Medium indicators
  if (
    lowerComment.includes('minor') ||
    lowerComment.includes('small') ||
    lowerComment.includes('scratch') ||
    lowerComment.includes('dent') ||
    lowerComment.includes('mark')
  ) {
    return 'Medium';
  }
  
  // Default to High for damaged items
  return 'High';
}

function mapProgram(incidentOrReturn: string): Program {
  // All incidents in CSV are "Incident" type, map to Customer Reported
  return 'Customer Reported';
}

function extractDefectType(comment: string): string {
  const lowerComment = comment.toLowerCase();
  
  // Remove "Incident:" prefix if present
  let cleaned = comment.replace(/^incident:\s*/i, '').trim();
  
  // Extract key defect types
  const defectKeywords: Record<string, string> = {
    'crack': 'Crack',
    'chip': 'Chip',
    'scratch': 'Scratch',
    'dent': 'Dent',
    'damage': 'Damage',
    'broken': 'Broken',
    'defect': 'Defect',
    'splinter': 'Splinter',
    'stain': 'Stain',
    'odor': 'Odor',
    'tear': 'Tear',
    'rip': 'Rip',
    'warp': 'Warp',
    'misalign': 'Misalignment',
    'missing': 'Missing Parts',
    'loose': 'Loose',
    'peel': 'Peeling',
    'discolor': 'Discoloration',
    'mold': 'Mold',
    'water': 'Water Damage',
  };
  
  for (const [keyword, defectType] of Object.entries(defectKeywords)) {
    if (lowerComment.includes(keyword)) {
      return defectType;
    }
  }
  
  // Default to first meaningful words
  const words = cleaned.split(/[.,;]/)[0].trim().split(/\s+/).slice(0, 3);
  return words.join(' ') || 'Damage';
}

function isValidImageURL(url: string): boolean {
  if (!url || url.trim() === '') return false;
  // Check if URL starts with http/https
  if (!url.startsWith('http://') && !url.startsWith('https://')) return false;
  // Check if it's a valid image URL pattern (contains image-related extensions or wfcdn.com)
  return url.includes('wfcdn.com') || /\.(jpg|jpeg|png|gif|webp)(\?|$)/i.test(url);
}

function getThumbnail(imageURLs: string[]): string {
  // Return first valid image URL as thumbnail
  const validURL = imageURLs.find(url => isValidImageURL(url));
  if (validURL) return validURL;
  
  // Fallback: return first non-empty URL even if validation fails
  return imageURLs.find(url => url && url.trim() !== '') || '';
}

export function transformProductGroupToSKU(
  group: ProductGroup,
  generateSummary: (group: ProductGroup) => {
    aiRootCause: string;
    aiDefectTypes: string[];
    aiInsight: string;
  }
): SKU {
  const imageURLs = group.rows
    .map(row => row.imageURL)
    .filter(url => isValidImageURL(url));
  
  const evidence: Evidence[] = group.rows
    .filter(row => isValidImageURL(row.imageURL))
    .map((row, index) => {
      const defectType = extractDefectType(row.comment);
      const severity = mapSeverity(row.incidentType, row.comment);
      const program = mapProgram(row.incidentOrReturn);
      
      return {
        id: `ev-${group.productID}-${index}`,
        imageUrl: row.imageURL,
        severity,
        program,
        date: row.deliveryDate || new Date().toISOString().split('T')[0],
        defectType,
        note: row.comment || `Incident reported for ${group.wayfairSKU}`,
      };
    });
  
  const summary = generateSummary(group);
  
  // Calculate if critical (threshold: 3+ incidents or deductions > $50)
  const isCritical = group.totalIncidents >= 3 || group.totalDeductions > 50;
  
  // Calculate incident rate (simplified: incidents per 100 units)
  // Using total incidents as a percentage indicator
  const incidentRate = Math.min(group.totalIncidents * 1.2, 15); // Cap at 15%
  
  return {
    id: group.productID,
    sku: group.productID,
    name: group.wayfairSKU || `Product ${group.productID}`,
    manufacturer: 'XYZ Supplier', // Hardcoded as per user request
    thumbnail: getThumbnail(imageURLs),
    isCritical,
    photoVolume: imageURLs.length,
    financialExposure: group.totalDeductions * 1000, // Convert to full exposure estimate
    programsFlagged: Array.from(new Set(evidence.map(e => e.program))),
    incidentRate: parseFloat(incidentRate.toFixed(1)),
    aiInsight: summary.aiInsight,
    aiRootCause: summary.aiRootCause,
    aiDefectTypes: summary.aiDefectTypes,
    evidence,
  };
}

export function transformAllProducts(
  groups: Map<string, ProductGroup>,
  generateSummary: (group: ProductGroup) => {
    aiRootCause: string;
    aiDefectTypes: string[];
    aiInsight: string;
  }
): SKU[] {
  const skus: SKU[] = [];
  
  for (const group of groups.values()) {
    const sku = transformProductGroupToSKU(group, generateSummary);
    skus.push(sku);
  }
  
  // Sort by critical status and incident rate
  return skus.sort((a, b) => {
    if (a.isCritical !== b.isCritical) {
      return a.isCritical ? -1 : 1;
    }
    return b.incidentRate - a.incidentRate;
  });
}


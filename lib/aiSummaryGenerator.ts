import { ProductGroup } from './csvDataLoader';

interface SummaryResult {
  aiRootCause: string;
  aiDefectTypes: string[];
  aiInsight: string;
}

// Common defect keywords and their categories
const DEFECT_CATEGORIES: Record<string, string[]> = {
  'Structural': ['crack', 'broken', 'break', 'shatter', 'split', 'fracture', 'snap'],
  'Surface': ['scratch', 'dent', 'chip', 'mark', 'scuff', 'abrasion', 'blemish'],
  'Finish': ['peel', 'flake', 'fade', 'discolor', 'stain', 'rust', 'corrosion'],
  'Assembly': ['loose', 'misalign', 'warp', 'crooked', 'bent', 'twist'],
  'Material': ['splinter', 'tear', 'rip', 'hole', 'gap', 'missing'],
  'Quality': ['defect', 'imperfection', 'flaw', 'fault', 'issue'],
  'Contamination': ['odor', 'smell', 'mold', 'water', 'stain', 'dirty'],
};

function extractDefectTypes(comments: string[]): string[] {
  const defectTypes = new Set<string>();
  const lowerComments = comments.map(c => c.toLowerCase());
  
  for (const [category, keywords] of Object.entries(DEFECT_CATEGORIES)) {
    for (const keyword of keywords) {
      if (lowerComments.some(c => c.includes(keyword))) {
        defectTypes.add(category);
        break;
      }
    }
  }
  
  // Extract specific defect mentions
  for (const comment of lowerComments) {
    // Look for specific patterns
    if (comment.includes('crack')) defectTypes.add('Crack');
    if (comment.includes('chip')) defectTypes.add('Chip');
    if (comment.includes('scratch')) defectTypes.add('Scratch');
    if (comment.includes('dent')) defectTypes.add('Dent');
    if (comment.includes('broken')) defectTypes.add('Broken');
    if (comment.includes('tear') || comment.includes('rip')) defectTypes.add('Tear/Rip');
    if (comment.includes('splinter')) defectTypes.add('Splinter');
    if (comment.includes('stain')) defectTypes.add('Stain');
    if (comment.includes('odor') || comment.includes('smell')) defectTypes.add('Odor');
    if (comment.includes('mold')) defectTypes.add('Mold');
    if (comment.includes('warp') || comment.includes('warped')) defectTypes.add('Warping');
    if (comment.includes('misalign') || comment.includes('crooked')) defectTypes.add('Misalignment');
    if (comment.includes('loose')) defectTypes.add('Loose Parts');
    if (comment.includes('missing')) defectTypes.add('Missing Parts');
    if (comment.includes('peel') || comment.includes('peeling')) defectTypes.add('Peeling Finish');
    if (comment.includes('discolor')) defectTypes.add('Discoloration');
  }
  
  // If no specific defects found, add generic
  if (defectTypes.size === 0) {
    defectTypes.add('Damage');
  }
  
  return Array.from(defectTypes).slice(0, 5); // Limit to top 5
}

function countKeywordOccurrences(comments: string[], keywords: string[]): number {
  const lowerComments = comments.map(c => c.toLowerCase());
  return keywords.reduce((count, keyword) => {
    return count + lowerComments.filter(c => c.includes(keyword)).length;
  }, 0);
}

function generateRootCause(group: ProductGroup): string {
  const comments = group.rows
    .map(row => row.comment)
    .filter(c => c && c.trim() !== '');
  
  if (comments.length === 0) {
    return 'Multiple incidents reported. Root cause analysis pending.';
  }
  
  const lowerComments = comments.map(c => c.toLowerCase());
  const incidentCount = group.totalIncidents;
  
  // Analyze patterns
  const structuralIssues = countKeywordOccurrences(comments, ['crack', 'broken', 'shatter', 'split']);
  const surfaceIssues = countKeywordOccurrences(comments, ['scratch', 'dent', 'chip', 'mark']);
  const finishIssues = countKeywordOccurrences(comments, ['peel', 'flake', 'discolor', 'stain']);
  const assemblyIssues = countKeywordOccurrences(comments, ['loose', 'misalign', 'warp', 'crooked']);
  const materialIssues = countKeywordOccurrences(comments, ['splinter', 'tear', 'rip', 'hole']);
  const contaminationIssues = countKeywordOccurrences(comments, ['odor', 'mold', 'water', 'stain']);
  
  const issues: string[] = [];
  
  if (structuralIssues > 0) {
    issues.push(`Structural damage (cracks, breaks) reported in ${structuralIssues} incident(s)`);
  }
  if (surfaceIssues > 0) {
    issues.push(`Surface defects (scratches, dents, chips) in ${surfaceIssues} incident(s)`);
  }
  if (finishIssues > 0) {
    issues.push(`Finish quality issues (peeling, discoloration) in ${finishIssues} incident(s)`);
  }
  if (assemblyIssues > 0) {
    issues.push(`Assembly/misalignment problems in ${assemblyIssues} incident(s)`);
  }
  if (materialIssues > 0) {
    issues.push(`Material defects (splinters, tears) in ${materialIssues} incident(s)`);
  }
  if (contaminationIssues > 0) {
    issues.push(`Contamination issues (odor, mold, water damage) in ${contaminationIssues} incident(s)`);
  }
  
  // Build root cause summary
  if (issues.length === 0) {
    return `Multiple incidents (${incidentCount}) reported for this product. Common issues include general damage and defects requiring supplier attention.`;
  }
  
  const primaryIssues = issues.slice(0, 3).join('. ');
  const additionalText = issues.length > 3 ? ` Additional issues reported.` : '';
  
  return `${primaryIssues}.${additionalText} Pattern indicates ${incidentCount > 1 ? 'recurring' : 'potential'} quality control issues requiring supplier review and corrective action.`;
}

export function generateSummary(group: ProductGroup): SummaryResult {
  const incidentCount = group.totalIncidents;
  const defectTypes = extractDefectTypes(
    group.rows.map(row => row.comment).filter(c => c && c.trim() !== '')
  );
  
  // Generate more executive-friendly insights
  const financialImpact = group.totalDeductions > 0 ? `$${group.totalDeductions.toFixed(2)}` : 'N/A';
  const severityLevel = incidentCount >= 5 ? 'Critical' : incidentCount >= 3 ? 'High Priority' : incidentCount > 1 ? 'Pattern Detected' : 'Single Incident';
  
  const aiInsight = incidentCount > 1 
    ? `${severityLevel} • ${incidentCount} incidents • ${financialImpact} impact`
    : `Single Incident • ${financialImpact} impact`;
  
  const aiRootCause = generateRootCause(group);
  
  return {
    aiRootCause,
    aiDefectTypes: defectTypes.length > 0 ? defectTypes : ['Damage'],
    aiInsight,
  };
}


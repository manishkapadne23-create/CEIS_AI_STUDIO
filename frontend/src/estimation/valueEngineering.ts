import type { BoqItem, EngineeringEstimate, ValueEngineeringSuggestion } from "./types";

export const generateValueEngineeringSuggestions = (
  estimate: EngineeringEstimate
): ValueEngineeringSuggestion[] => {
  const suggestions: ValueEngineeringSuggestion[] = [];

  for (const item of estimate.items) {
    const text = item.description.toLowerCase();

    if (/opc\s*53|m\s*40|high\s*grade\s*concrete/i.test(text)) {
      suggestions.push({
        category: "Alternative Materials",
        suggestion: `Consider M30/M35 instead of higher grade for ${item.description} if structural requirements permit`,
        potentialSaving: "5–15% on concrete cost",
      });
    }
    if (/brick|aac|block/i.test(text)) {
      suggestions.push({
        category: "Alternative Materials",
        suggestion: "Evaluate AAC blocks vs conventional bricks for reduced dead load and faster construction",
        potentialSaving: "10–20% on masonry labour",
      });
    }
    if (/excavat|earthwork/i.test(text)) {
      suggestions.push({
        category: "Alternative Construction Methods",
        suggestion: "Consider mechanical excavation vs manual for large volumes; optimize cut-fill balance",
        potentialSaving: "8–12% on earthwork",
      });
    }
    if (/paint|coating|finish/i.test(text)) {
      suggestions.push({
        category: "Life Cycle Cost",
        suggestion: "Evaluate premium coatings with longer maintenance intervals for reduced life-cycle cost",
        potentialSaving: "Lower maintenance over 10-year horizon",
      });
    }
    if (/equipment|machinery|crane/i.test(text)) {
      suggestions.push({
        category: "Maintainability",
        suggestion: "Specify equipment with local service support and standard spare parts availability",
        potentialSaving: "Reduced downtime and maintenance cost",
      });
    }
  }

  if (estimate.items.length > 5) {
    suggestions.push({
      category: "Cost Reduction",
      suggestion: "Bulk procurement of major materials (cement, steel) may yield 3–5% savings",
      potentialSaving: "3–5% on material cost",
    });
  }

  if (estimate.contingencyPercent > 15) {
    suggestions.push({
      category: "Cost Reduction",
      suggestion: "Review contingency — 10% is typical for detailed estimates with defined scope",
      potentialSaving: "Reduce contingency to 10% if scope is well-defined",
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      category: "General",
      suggestion: "Complete BOQ with rates before value engineering analysis",
      potentialSaving: "N/A",
    });
  }

  return suggestions.slice(0, 8);
};

export const detectDuplicateItems = (items: BoqItem[]): string[] => {
  const seen = new Map<string, string>();
  const duplicates: string[] = [];

  for (const item of items) {
    const key = item.description.toLowerCase().replace(/\s+/g, " ").trim();
    if (seen.has(key)) {
      duplicates.push(`${item.description} (duplicate of item ${seen.get(key)})`);
    } else {
      seen.set(key, item.itemNo);
    }
  }

  return duplicates;
};

export const formatValueEngineeringForPrompt = (
  suggestions: ValueEngineeringSuggestion[]
): string =>
  [
    "VALUE ENGINEERING SUGGESTIONS:",
    ...suggestions.map(
      (s) => `- [${s.category}] ${s.suggestion} (Saving: ${s.potentialSaving})`
    ),
  ].join("\n");

import { detectMissingCostItems } from "./costAnalyzer";
import { recommendUnit } from "./quantityEngine";
import { detectDuplicateItems } from "./valueEngineering";
import type { BoqItem, BoqReviewResult, EngineeringEstimate } from "./types";

export const createBoqItem = (
  description: string,
  quantity: number,
  unit?: string,
  rate?: number | null
): BoqItem => {
  const recommended = recommendUnit(description);
  const itemUnit = unit ?? recommended.unit;
  const itemRate = rate ?? null;
  return {
    id: crypto.randomUUID(),
    itemNo: "",
    description: description.trim(),
    unit: itemUnit,
    quantity,
    rate: itemRate,
    amount: itemRate !== null ? quantity * itemRate : null,
    category: "general",
    measurementMethod: recommended.measurementMethod,
    remarks: "",
  };
};

export const renumberBoqItems = (items: BoqItem[]): BoqItem[] =>
  items.map((item, index) => ({
    ...item,
    itemNo: `${index + 1}`,
  }));

export const addBoqItem = (
  estimate: EngineeringEstimate,
  description: string,
  quantity: number,
  unit?: string,
  rate?: number | null
): EngineeringEstimate => {
  const newItem = createBoqItem(description, quantity, unit, rate);
  const items = renumberBoqItems([...estimate.items, newItem]);
  return { ...estimate, items, updatedAt: Date.now() };
};

export const reviewBoq = (
  estimate: EngineeringEstimate,
  disciplineId: string | null
): BoqReviewResult => {
  const missingItems = detectMissingCostItems(estimate, disciplineId);
  const duplicateItems = detectDuplicateItems(estimate.items);
  const additionalSuggestions: string[] = [];

  if (!estimate.items.some((i) => /contingency|overhead/i.test(i.description))) {
    additionalSuggestions.push("Add contingency/overhead allowance item");
  }
  if (!estimate.items.some((i) => /testing|inspection/i.test(i.description))) {
    additionalSuggestions.push("Consider testing and inspection costs");
  }

  const optimizationHints: string[] = [];
  const unrated = estimate.items.filter((i) => i.rate === null);
  if (unrated.length > 0) {
    optimizationHints.push(`${unrated.length} item(s) without rates — apply SSR/SOR rates`);
  }
  if (estimate.items.length < 5) {
    optimizationHints.push("BOQ appears incomplete — add more work items for comprehensive estimate");
  }

  return {
    missingItems,
    duplicateItems,
    additionalSuggestions,
    optimizationHints,
  };
};

export const formatBoqForPrompt = (estimate: EngineeringEstimate): string => {
  if (estimate.items.length === 0) {
    return "BOQ is empty. Add items with 'Add item [description] quantity [number]'.";
  }

  const lines = estimate.items.map(
    (i) =>
      `${i.itemNo}. ${i.description} | ${i.quantity} ${i.unit}${i.rate !== null ? ` @ ₹${i.rate} = ₹${(i.amount ?? 0).toLocaleString()}` : ""}`
  );

  return [
    `BOQ: ${estimate.title} (${estimate.items.length} items)`,
    ...lines,
  ].join("\n");
};

export const formatBoqReviewForPrompt = (review: BoqReviewResult): string =>
  [
    "BOQ REVIEW:",
    review.missingItems.length > 0
      ? `Missing items:\n${review.missingItems.map((m) => `- ${m}`).join("\n")}`
      : "No obvious missing items detected",
    review.duplicateItems.length > 0
      ? `Duplicates:\n${review.duplicateItems.map((d) => `- ${d}`).join("\n")}`
      : "",
    review.additionalSuggestions.length > 0
      ? `Suggestions:\n${review.additionalSuggestions.map((s) => `- ${s}`).join("\n")}`
      : "",
    review.optimizationHints.length > 0
      ? `Optimization:\n${review.optimizationHints.map((h) => `- ${h}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

export const exportBoqAsCsv = (estimate: EngineeringEstimate): string => {
  const header = "Item No,Description,Unit,Quantity,Rate,Amount,Remarks";
  const rows = estimate.items.map((i) =>
    [
      i.itemNo,
      `"${i.description.replace(/"/g, '""')}"`,
      i.unit,
      i.quantity,
      i.rate ?? "",
      i.amount ?? "",
      `"${i.remarks.replace(/"/g, '""')}"`,
    ].join(",")
  );
  return [header, ...rows].join("\n");
};

export const compareBoqVersions = (
  estimateA: EngineeringEstimate,
  estimateB: EngineeringEstimate
): string => {
  const diff = estimateB.items.length - estimateA.items.length;
  const costDiff = estimateB.totalCost - estimateA.totalCost;
  return [
    `Comparing: ${estimateA.title} vs ${estimateB.title}`,
    `Items: ${estimateA.items.length} → ${estimateB.items.length} (${diff >= 0 ? "+" : ""}${diff})`,
    `Total: ₹${estimateA.totalCost.toLocaleString()} → ₹${estimateB.totalCost.toLocaleString()} (${costDiff >= 0 ? "+" : ""}₹${costDiff.toLocaleString()})`,
  ].join("\n");
};

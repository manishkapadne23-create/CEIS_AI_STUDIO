import type { BoqItem, CostBreakdown, EngineeringEstimate } from "./types";

const classifyItemCost = (
  item: BoqItem
): "material" | "labour" | "equipment" => {
  const text = item.description.toLowerCase();
  if (/labour|manpower|skilled|unskilled|mason|carpenter|fitter/i.test(text)) {
    return "labour";
  }
  if (/equipment|machinery|crane|excavator|hire|rental/i.test(text)) {
    return "equipment";
  }
  return "material";
};

export const calculateItemAmount = (item: BoqItem): number => {
  if (item.rate !== null) return item.quantity * item.rate;
  return item.amount ?? 0;
};

export const analyzeCosts = (estimate: EngineeringEstimate): CostBreakdown => {
  let materialCost = 0;
  let labourCost = 0;
  let equipmentCost = 0;

  for (const item of estimate.items) {
    const amount = calculateItemAmount(item);
    const category = classifyItemCost(item);
    if (category === "labour") labourCost += amount;
    else if (category === "equipment") equipmentCost += amount;
    else materialCost += amount;
  }

  const subtotal = materialCost + labourCost + equipmentCost;
  const indirectCost = estimate.indirectCost || subtotal * 0.1;
  const contingency =
    subtotal * (estimate.contingencyPercent / 100);
  const totalCost = subtotal + indirectCost + contingency;

  return {
    materialCost: Math.round(materialCost),
    labourCost: Math.round(labourCost),
    equipmentCost: Math.round(equipmentCost),
    indirectCost: Math.round(indirectCost),
    contingency: Math.round(contingency),
    subtotal: Math.round(subtotal),
    totalCost: Math.round(totalCost),
    engineeringRemarks:
      estimate.engineeringRemarks ||
      "Costs are indicative — verify rates from SSR/SOR and vendor quotations.",
  };
};

export const applyCostBreakdown = (
  estimate: EngineeringEstimate
): EngineeringEstimate => {
  const breakdown = analyzeCosts(estimate);
  return {
    ...estimate,
    materialCost: breakdown.materialCost,
    labourCost: breakdown.labourCost,
    equipmentCost: breakdown.equipmentCost,
    indirectCost: breakdown.indirectCost,
    totalCost: breakdown.totalCost,
    updatedAt: Date.now(),
  };
};

export const formatCostBreakdownForPrompt = (
  breakdown: CostBreakdown
): string =>
  [
    "COST BREAKDOWN:",
    `Material: ₹${breakdown.materialCost.toLocaleString()}`,
    `Labour: ₹${breakdown.labourCost.toLocaleString()}`,
    `Equipment: ₹${breakdown.equipmentCost.toLocaleString()}`,
    `Indirect: ₹${breakdown.indirectCost.toLocaleString()}`,
    `Contingency: ₹${breakdown.contingency.toLocaleString()}`,
    `Subtotal: ₹${breakdown.subtotal.toLocaleString()}`,
    `TOTAL: ₹${breakdown.totalCost.toLocaleString()}`,
    "",
    `Remarks: ${breakdown.engineeringRemarks}`,
  ].join("\n");

export const detectMissingCostItems = (
  estimate: EngineeringEstimate,
  disciplineId: string | null
): string[] => {
  const missing: string[] = [];
  const descriptions = estimate.items.map((i) => i.description.toLowerCase());

  const civilDefaults = [
    "Earthwork excavation",
    "Concrete work",
    "Reinforcement steel",
    "Formwork",
    "Waterproofing",
  ];
  const mechDefaults = [
    "Piping",
    "Insulation",
    "Testing & commissioning",
  ];
  const elecDefaults = [
    "Cable laying",
    "Earthing",
    "Panel installation",
    "Testing",
  ];

  let defaults = civilDefaults;
  if (disciplineId?.includes("mechanical")) defaults = mechDefaults;
  if (disciplineId?.includes("electrical")) defaults = elecDefaults;

  for (const item of defaults) {
    if (!descriptions.some((d) => d.includes(item.toLowerCase().slice(0, 8)))) {
      missing.push(item);
    }
  }

  return missing;
};

import type { EngineeringUnit, QuantityConversion, QuantityUnitType } from "./types";

const LENGTH_TO_M: Record<string, number> = {
  m: 1,
  km: 1000,
  mm: 0.001,
  ft: 0.3048,
  inch: 0.0254,
};

const AREA_TO_SQM: Record<string, number> = {
  sqm: 1,
  sqft: 0.092903,
  acre: 4046.86,
  hectare: 10000,
};

const VOLUME_TO_CUM: Record<string, number> = {
  cum: 1,
  cft: 0.0283168,
  ltr: 0.001,
  kl: 1,
};

const WEIGHT_TO_KG: Record<string, number> = {
  kg: 1,
  tonne: 1000,
  ton: 907.185,
  g: 0.001,
};

export const UNIT_TYPE_MAP: Record<string, QuantityUnitType> = {
  m: "length",
  km: "length",
  mm: "length",
  sqm: "area",
  sqft: "area",
  cum: "volume",
  cft: "volume",
  ltr: "volume",
  kg: "weight",
  tonne: "weight",
  nos: "count",
  kW: "capacity",
  kVA: "capacity",
};

export const recommendUnit = (
  itemDescription: string
): { unit: EngineeringUnit; measurementMethod: string } => {
  const text = itemDescription.toLowerCase();
  if (/concrete|earth|excavat|fill|masonry|plaster/i.test(text)) {
    return { unit: "cum", measurementMethod: "Volume measurement from drawings" };
  }
  if (/paint|carpet|tile|flooring|roofing/i.test(text)) {
    return { unit: "sqm", measurementMethod: "Area measurement from plan" };
  }
  if (/pipe|cable|wire|duct|rebar|steel\s+bar/i.test(text)) {
    return { unit: "m", measurementMethod: "Linear measurement from layout" };
  }
  if (/steel|reinforcement|structural\s+steel/i.test(text)) {
    return { unit: "kg", measurementMethod: "Weight from BBS/weight tables" };
  }
  if (/door|window|fixture|equipment|pump|valve/i.test(text)) {
    return { unit: "nos", measurementMethod: "Count from schedule" };
  }
  if (/transformer|generator|motor|panel/i.test(text)) {
    return { unit: "kVA", measurementMethod: "Rated capacity from specifications" };
  }
  return { unit: "nos", measurementMethod: "Count or measure as per item nature" };
};

export const convertUnit = (
  value: number,
  fromUnit: string,
  toUnit: string
): QuantityConversion | null => {
  const from = fromUnit.toLowerCase();
  const to = toUnit.toLowerCase();

  let baseValue: number | null = null;
  let result: number | null = null;

  if (LENGTH_TO_M[from] && LENGTH_TO_M[to]) {
    baseValue = value * LENGTH_TO_M[from];
    result = baseValue / LENGTH_TO_M[to];
  } else if (AREA_TO_SQM[from] && AREA_TO_SQM[to]) {
    baseValue = value * AREA_TO_SQM[from];
    result = baseValue / AREA_TO_SQM[to];
  } else if (VOLUME_TO_CUM[from] && VOLUME_TO_CUM[to]) {
    baseValue = value * VOLUME_TO_CUM[from];
    result = baseValue / VOLUME_TO_CUM[to];
  } else if (WEIGHT_TO_KG[from] && WEIGHT_TO_KG[to]) {
    baseValue = value * WEIGHT_TO_KG[from];
    result = baseValue / WEIGHT_TO_KG[to];
  }

  if (result === null) return null;

  return {
    fromValue: value,
    fromUnit,
    toValue: Math.round(result * 10000) / 10000,
    toUnit,
  };
};

export const parseConversionCommand = (
  message: string
): { value: number; fromUnit: string; toUnit: string } | null => {
  const match = message.match(
    /convert\s+([\d.]+)\s*(\w+)\s+(?:to|in)\s+(\w+)/i
  );
  if (!match) return null;
  return {
    value: parseFloat(match[1]),
    fromUnit: match[2],
    toUnit: match[3],
  };
};

export const formatQuantitySummary = (
  items: { description: string; quantity: number; unit: string }[]
): string => {
  if (items.length === 0) return "No quantity items recorded.";
  return items
    .map((i) => `- ${i.description}: ${i.quantity} ${i.unit}`)
    .join("\n");
};

export const formatUnitsForPrompt = (): string =>
  [
    "QUANTITY SUPPORT:",
    "Length: m, km, mm | Area: sqm, sqft | Volume: cum, cft, ltr",
    "Weight: kg, tonne | Count: nos | Capacity: kW, kVA",
    "Command: Convert 100 sqft to sqm",
  ].join("\n");

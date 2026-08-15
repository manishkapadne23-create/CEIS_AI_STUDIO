import type {
  KnowledgeCaptureFields,
  LessonCategory,
  LessonEntry,
  ProjectType,
} from "./types";

const EMPTY_CAPTURE: KnowledgeCaptureFields = {
  problem: "",
  rootCause: "",
  solution: "",
  engineeringDecision: "",
  engineeringAssumption: "",
  bestPractice: "",
  innovation: "",
  mistakeAvoided: "",
  recommendation: "",
  referenceDocuments: [],
};

export const resolveLessonCategory = (text: string): LessonCategory => {
  const t = text.toLowerCase();
  if (/construct|site|erection/i.test(t)) return "construction";
  if (/manufactur|production|fabricat/i.test(t)) return "manufacturing";
  if (/maintain|repair|overhaul/i.test(t)) return "maintenance";
  if (/qa|qc|quality|inspection|test/i.test(t)) return "qa-qc";
  if (/safety|hse|accident|hazard/i.test(t)) return "safety";
  if (/tender|bid|procurement/i.test(t)) return "tender";
  if (/contract|clause|agreement/i.test(t)) return "contracts";
  if (/claim|eot|variation|delay/i.test(t)) return "claims";
  if (/plan|schedule|programme/i.test(t)) return "planning";
  if (/cost|budget|estimate|boq/i.test(t)) return "cost";
  if (/tech|software|digital|automation/i.test(t)) return "technology";
  if (/material|concrete|steel|polymer/i.test(t)) return "materials";
  if (/equipment|machine|plant|tool/i.test(t)) return "equipment";
  return "design";
};

export const resolveProjectType = (text: string): ProjectType => {
  const t = text.toLowerCase();
  if (/infra|bridge|road|dam|tunnel/i.test(t)) return "infrastructure";
  if (/industrial|factory|plant/i.test(t)) return "industrial";
  if (/commercial|office|retail/i.test(t)) return "commercial";
  if (/residential|housing|apartment/i.test(t)) return "residential";
  if (/energy|power|solar|wind/i.test(t)) return "energy";
  if (/rail|metro|transport|airport/i.test(t)) return "transport";
  if (/water|wastewater|irrigation/i.test(t)) return "water";
  return "general";
};

export const extractKeywords = (text: string): string[] => {
  const stopWords = new Set(["the", "and", "for", "with", "from", "that", "this", "was", "were", "has", "have"]);
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3 && !stopWords.has(w))
    .slice(0, 12);
};

export const parseCaptureFromText = (input: string): Partial<KnowledgeCaptureFields> => {
  const capture: Partial<KnowledgeCaptureFields> = {};
  const patterns: [keyof KnowledgeCaptureFields, RegExp][] = [
    ["problem", /(?:problem|issue)[:\s]+(.+?)(?=(?:root\s*cause|solution|decision|assumption|best\s*practice|innovation|mistake|recommendation|reference)|$)/is],
    ["rootCause", /(?:root\s*cause)[:\s]+(.+?)(?=(?:solution|decision|assumption|best\s*practice|innovation|mistake|recommendation|reference)|$)/is],
    ["solution", /(?:solution)[:\s]+(.+?)(?=(?:decision|assumption|best\s*practice|innovation|mistake|recommendation|reference)|$)/is],
    ["engineeringDecision", /(?:engineering\s*decision|decision)[:\s]+(.+?)(?=(?:assumption|best\s*practice|innovation|mistake|recommendation|reference)|$)/is],
    ["engineeringAssumption", /(?:assumption|engineering\s*assumption)[:\s]+(.+?)(?=(?:best\s*practice|innovation|mistake|recommendation|reference)|$)/is],
    ["bestPractice", /(?:best\s*practice)[:\s]+(.+?)(?=(?:innovation|mistake|recommendation|reference)|$)/is],
    ["innovation", /(?:innovation)[:\s]+(.+?)(?=(?:mistake|recommendation|reference)|$)/is],
    ["mistakeAvoided", /(?:mistake\s*avoided|lesson)[:\s]+(.+?)(?=(?:recommendation|reference)|$)/is],
    ["recommendation", /(?:recommendation)[:\s]+(.+?)(?=reference|$)/is],
  ];

  for (const [field, pattern] of patterns) {
    const match = input.match(pattern);
    if (match?.[1]) capture[field] = match[1].trim() as never;
  }

  const refMatch = input.match(/(?:reference|documents?)[:\s]+(.+)$/is);
  if (refMatch?.[1]) {
    capture.referenceDocuments = refMatch[1]
      .split(/[,;]/)
      .map((r) => r.trim())
      .filter(Boolean);
  }

  return capture;
};

export const buildLessonEntry = (
  input: string,
  disciplineId: string | null,
  disciplineName: string | null,
  projectName: string | null
): LessonEntry => {
  const parsed = parseCaptureFromText(input);
  const category = resolveLessonCategory(input);
  const now = Date.now();
  const title =
    parsed.problem?.slice(0, 80) ||
    input.slice(0, 80) ||
    `Lesson — ${category}`;

  const capture: KnowledgeCaptureFields = {
    ...EMPTY_CAPTURE,
    ...parsed,
    problem: parsed.problem ?? input,
    solution: parsed.solution ?? "",
    recommendation: parsed.recommendation ?? "",
  };

  return {
    id: crypto.randomUUID(),
    title,
    category,
    disciplineId,
    disciplineName,
    projectType: resolveProjectType(input + (projectName ?? "")),
    standard: extractStandard(input),
    material: extractMaterial(input),
    technology: extractTechnology(input),
    keywords: extractKeywords(input),
    capture,
    createdAt: now,
    updatedAt: now,
  };
};

const extractStandard = (text: string): string | null => {
  const match = text.match(/\b(IS|IRC|ASTM|BS|EN|ISO|IEC|ASME|API|NFPA)\s*[\d:.]+[A-Z]*/i);
  return match ? match[0].toUpperCase() : null;
};

const extractMaterial = (text: string): string | null => {
  const materials = ["concrete", "steel", "timber", "aluminum", "polymer", "composite", "asphalt"];
  const found = materials.find((m) => text.toLowerCase().includes(m));
  return found ?? null;
};

const extractTechnology = (text: string): string | null => {
  const techs = ["bim", "gis", "iot", "ai", "plc", "scada", "cfd", "fem", "digital twin"];
  const found = techs.find((t) => text.toLowerCase().includes(t));
  return found?.toUpperCase() ?? null;
};

export const formatLessonEntry = (lesson: LessonEntry): string =>
  [
    `LESSON: ${lesson.title}`,
    `Category: ${lesson.category} | Project: ${lesson.projectType}`,
    lesson.standard ? `Standard: ${lesson.standard}` : "",
    lesson.material ? `Material: ${lesson.material}` : "",
    lesson.technology ? `Technology: ${lesson.technology}` : "",
    "",
    lesson.capture.problem ? `Problem: ${lesson.capture.problem}` : "",
    lesson.capture.rootCause ? `Root Cause: ${lesson.capture.rootCause}` : "",
    lesson.capture.solution ? `Solution: ${lesson.capture.solution}` : "",
    lesson.capture.engineeringDecision ? `Decision: ${lesson.capture.engineeringDecision}` : "",
    lesson.capture.engineeringAssumption ? `Assumption: ${lesson.capture.engineeringAssumption}` : "",
    lesson.capture.bestPractice ? `Best Practice: ${lesson.capture.bestPractice}` : "",
    lesson.capture.innovation ? `Innovation: ${lesson.capture.innovation}` : "",
    lesson.capture.mistakeAvoided ? `Mistake Avoided: ${lesson.capture.mistakeAvoided}` : "",
    lesson.capture.recommendation ? `Recommendation: ${lesson.capture.recommendation}` : "",
    lesson.capture.referenceDocuments.length > 0
      ? `References: ${lesson.capture.referenceDocuments.join("; ")}`
      : "",
    `Keywords: ${lesson.keywords.join(", ")}`,
  ]
    .filter(Boolean)
    .join("\n");

export const summarizeLessons = (lessons: LessonEntry[]): string => {
  if (lessons.length === 0) return "No lessons captured yet.";
  const byCategory = new Map<string, number>();
  for (const l of lessons) {
    byCategory.set(l.category, (byCategory.get(l.category) ?? 0) + 1);
  }
  return [
    `KNOWLEDGE SUMMARY — ${lessons.length} lesson(s) captured`,
    "",
    "By Category:",
    ...Array.from(byCategory.entries()).map(([cat, count]) => `- ${cat}: ${count}`),
    "",
    "Recent Lessons:",
    ...lessons.slice(0, 5).map((l, i) => `${i + 1}. [${l.category}] ${l.title}`),
  ].join("\n");
};

export const generateKnowledgeNote = (lesson: LessonEntry): string =>
  [
    `KNOWLEDGE NOTE — ${lesson.title}`,
    "",
    `When working on ${lesson.category} activities in ${lesson.disciplineName ?? "engineering"}:`,
    lesson.capture.bestPractice
      ? `✓ Best Practice: ${lesson.capture.bestPractice}`
      : lesson.capture.solution
        ? `✓ Solution: ${lesson.capture.solution}`
        : "",
    lesson.capture.mistakeAvoided ? `✗ Avoid: ${lesson.capture.mistakeAvoided}` : "",
    lesson.capture.recommendation ? `→ Recommendation: ${lesson.capture.recommendation}` : "",
    lesson.standard ? `Standard reference: ${lesson.standard}` : "",
  ]
    .filter(Boolean)
    .join("\n");

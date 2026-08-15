import type { TenderAnalysis } from "./types";

const extractMatch = (
  text: string,
  patterns: RegExp[]
): string | null => {
  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) return match[1].trim();
  }
  return null;
};

const extractList = (text: string, keywords: string[]): string[] => {
  const items: string[] = [];
  const lines = text.split(/\n|\.|;/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length < 10) continue;
    for (const kw of keywords) {
      if (new RegExp(kw, "i").test(trimmed) && !items.includes(trimmed)) {
        items.push(trimmed.slice(0, 200));
        break;
      }
    }
  }
  return items.slice(0, 10);
};

export const parseTenderInput = (
  input: string,
  disciplineName: string | null
): TenderAnalysis => {
  const text = input;

  const client = extractMatch(text, [
    /(?:client|employer|authority|department)[:\s]+([^\n.]+)/i,
    /(?:issued\s+by|on\s+behalf\s+of)[:\s]+([^\n.]+)/i,
  ]);

  const projectName = extractMatch(text, [
    /(?:project\s+name|name\s+of\s+(?:work|project))[:\s]+([^\n.]+)/i,
    /(?:tender\s+for)[:\s]+([^\n.]+)/i,
    /(?:work\s+of)[:\s]+([^\n.]+)/i,
  ]);

  const projectValue = extractMatch(text, [
    /(?:estimated\s+cost|project\s+value|tender\s+value|amount)[:\s]*[₹Rs.INR]*\s*([\d,.]+\s*(?:lakh|crore|cr|lakhs)?)/i,
    /[₹Rs]\s*([\d,.]+\s*(?:lakh|crore|cr)?)/i,
  ]);

  const bidDueDate = extractMatch(text, [
    /(?:bid\s+due|last\s+date|submission\s+deadline|closing\s+date)[:\s]+([^\n.]+)/i,
    /(?:due\s+date)[:\s]+([^\n.]+)/i,
  ]);

  const completionPeriod = extractMatch(text, [
    /(?:completion\s+period|time\s+for\s+completion|contract\s+period)[:\s]+([^\n.]+)/i,
    /(?:within)\s+(\d+\s*(?:months?|days?|years?))/i,
  ]);

  const standardsIdentified = extractList(text, [
    "IRC", "IS\\s*\\d", "IEC", "ASME", "API", "RDSO", "MoRTH", "NBC", "ASTM", "BS\\s*\\d",
  ]);

  const drawingReferences = extractList(text, [
    "drawing", "plan", "layout", "schedule", "GA\\s+drawing", "structural\\s+drawing",
  ]);

  const boqItems = extractList(text, [
    "BOQ", "bill\\s+of\\s+quantities", "schedule\\s+of\\s+rates", "quantity",
  ]);

  const eligibilityCriteria = extractList(text, [
    "eligib", "qualification", "turnover", "experience", "registration", "license",
  ]);

  const technicalCriteria = extractList(text, [
    "technical", "specification", "standard", "quality", "testing", "material",
  ]);

  const financialCriteria = extractList(text, [
    "EMD", "earnest", "bid\\s+security", "performance\\s+guarantee", "bank\\s+guarantee", "financial",
  ]);

  const experienceRequirements = extractList(text, [
    "experience", "similar\\s+work", "completed\\s+project", "years?\\s+of",
  ]);

  const importantDates = extractList(text, [
    "date", "deadline", "pre-?bid", "site\\s+visit", "opening", "submission",
  ]);

  const scopeOfWork = extractList(text, [
    "scope", "work\\s+includes", "shall\\s+include", "supply", "install", "construct", "design",
  ]);

  if (scopeOfWork.length === 0 && projectName) {
    scopeOfWork.push(`Engineering works for: ${projectName}`);
  }
  if (disciplineName && standardsIdentified.length === 0) {
    standardsIdentified.push(`Applicable ${disciplineName} standards and codes`);
  }

  return {
    client,
    projectName: projectName ?? (disciplineName ? `${disciplineName} Project` : null),
    projectValue,
    bidDueDate,
    completionPeriod,
    eligibilityCriteria,
    technicalCriteria,
    financialCriteria,
    experienceRequirements,
    importantDates,
    scopeOfWork,
    standardsIdentified,
    drawingReferences,
    boqItems,
  };
};

export const formatAnalysisForPrompt = (analysis: TenderAnalysis): string =>
  [
    analysis.client ? `Client: ${analysis.client}` : "",
    analysis.projectName ? `Project: ${analysis.projectName}` : "",
    analysis.projectValue ? `Value: ${analysis.projectValue}` : "",
    analysis.bidDueDate ? `Bid Due: ${analysis.bidDueDate}` : "",
    analysis.completionPeriod ? `Completion: ${analysis.completionPeriod}` : "",
    analysis.scopeOfWork.length > 0
      ? `Scope:\n${analysis.scopeOfWork.map((s) => `- ${s}`).join("\n")}`
      : "",
    analysis.standardsIdentified.length > 0
      ? `Standards: ${analysis.standardsIdentified.join(", ")}`
      : "",
    analysis.eligibilityCriteria.length > 0
      ? `Eligibility:\n${analysis.eligibilityCriteria.slice(0, 5).map((e) => `- ${e}`).join("\n")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

export const searchTenderContent = (
  workspace: { rawInput: string; analysis: TenderAnalysis },
  keyword: string
): string[] => {
  const kw = keyword.toLowerCase();
  const results: string[] = [];
  const text = workspace.rawInput.toLowerCase();

  if (text.includes(kw)) {
    const idx = text.indexOf(kw);
    results.push(workspace.rawInput.slice(Math.max(0, idx - 50), idx + 100));
  }

  const allItems = [
    ...workspace.analysis.eligibilityCriteria,
    ...workspace.analysis.technicalCriteria,
    ...workspace.analysis.standardsIdentified,
    ...workspace.analysis.boqItems,
    ...workspace.analysis.scopeOfWork,
  ];

  for (const item of allItems) {
    if (item.toLowerCase().includes(kw)) results.push(item);
  }

  return [...new Set(results)].slice(0, 8);
};

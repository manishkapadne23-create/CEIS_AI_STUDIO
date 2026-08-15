import type { ContractAnalysis, ContractClause, ContractTypeId } from "./types";

export const CONTRACT_TYPES: { id: ContractTypeId; name: string }[] = [
  { id: "epc", name: "EPC" },
  { id: "item-rate", name: "Item Rate" },
  { id: "lump-sum", name: "Lump Sum" },
  { id: "ppp", name: "PPP" },
  { id: "bot", name: "BOT" },
  { id: "ham", name: "HAM" },
  { id: "pmc", name: "PMC" },
  { id: "design-consultancy", name: "Design Consultancy" },
  { id: "supply", name: "Supply Contract" },
  { id: "maintenance", name: "Maintenance Contract" },
  { id: "service", name: "Service Contract" },
];

const extractMatch = (text: string, patterns: RegExp[]): string | null => {
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

export const resolveContractType = (text: string): ContractTypeId | null => {
  const normalized = text.toLowerCase();
  for (const type of CONTRACT_TYPES) {
    if (normalized.includes(type.name.toLowerCase()) || normalized.includes(type.id.replace(/-/g, " "))) {
      return type.id;
    }
  }
  if (/epc|engineering procurement/i.test(normalized)) return "epc";
  if (/lump\s*sum|fixed\s*price/i.test(normalized)) return "lump-sum";
  if (/item\s*rate|schedule\s*of\s*rates/i.test(normalized)) return "item-rate";
  if (/fidic/i.test(normalized)) return "epc";
  if (/bot|build\s*operate/i.test(normalized)) return "bot";
  if (/ham|hybrid/i.test(normalized)) return "ham";
  if (/ppp|public\s*private/i.test(normalized)) return "ppp";
  if (/pmc|project\s*management/i.test(normalized)) return "pmc";
  if (/consultancy|consulting/i.test(normalized)) return "design-consultancy";
  return null;
};

const CLAUSE_PATTERNS: { pattern: RegExp; title: string; category: ContractClause["category"]; risk: ContractClause["riskLevel"] }[] = [
  { pattern: /payment|milestone|interim\s+certificate/i, title: "Payment Terms", category: "general", risk: "medium" },
  { pattern: /liquidated\s+damages|penalty|delay\s+damages/i, title: "Liquidated Damages", category: "general", risk: "high" },
  { pattern: /defect\s+liability|DLP|maintenance\s+period/i, title: "Defect Liability Period", category: "general", risk: "medium" },
  { pattern: /termination|forfeit|default/i, title: "Termination Conditions", category: "general", risk: "high" },
  { pattern: /variation|change\s+order|extra\s+item/i, title: "Variation/Change Orders", category: "special", risk: "medium" },
  { pattern: /extension\s+of\s+time|EOT|time\s+extension/i, title: "Extension of Time", category: "general", risk: "medium" },
  { pattern: /insurance|indemnity|liability/i, title: "Insurance & Indemnity", category: "general", risk: "medium" },
  { pattern: /arbitration|dispute|adjudication/i, title: "Dispute Resolution", category: "general", risk: "low" },
  { pattern: /force\s+majeure/i, title: "Force Majeure", category: "general", risk: "low" },
  { pattern: /performance\s+security|bank\s+guarantee|retention/i, title: "Performance Security", category: "general", risk: "medium" },
  { pattern: /fidic/i, title: "FIDIC Conditions", category: "fidic", risk: "low" },
  { pattern: /gcc|general\s+conditions/i, title: "General Conditions", category: "government", risk: "low" },
  { pattern: /scc|special\s+conditions/i, title: "Special Conditions", category: "special", risk: "medium" },
  { pattern: /warranty|guarantee/i, title: "Warranty Obligations", category: "technical", risk: "medium" },
  { pattern: /testing|commissioning|handover/i, title: "Testing & Commissioning", category: "technical", risk: "medium" },
];

export const parseContractInput = (
  input: string,
  _disciplineName: string | null
): ContractAnalysis => {
  const typeId = resolveContractType(input);
  const typeName = typeId
    ? CONTRACT_TYPES.find((t) => t.id === typeId)?.name ?? null
    : null;

  const clauses: ContractClause[] = [];
  let clauseIndex = 0;
  for (const cp of CLAUSE_PATTERNS) {
    if (cp.pattern.test(input)) {
      clauseIndex += 1;
      clauses.push({
        id: `clause-${clauseIndex}`,
        number: `${clauseIndex}`,
        title: cp.title,
        category: cp.category,
        summary: `Identified reference to ${cp.title.toLowerCase()} in contract text`,
        riskLevel: cp.risk,
      });
    }
  }

  return {
    contractType: typeId,
    contractTypeName: typeName,
    employer: extractMatch(input, [
      /(?:employer|client|owner|authority)[:\s]+([^\n.]+)/i,
    ]),
    contractor: extractMatch(input, [
      /(?:contractor|vendor|supplier)[:\s]+([^\n.]+)/i,
    ]),
    projectName: extractMatch(input, [
      /(?:project|work|contract\s+for)[:\s]+([^\n.]+)/i,
    ]),
    contractValue: extractMatch(input, [
      /(?:contract\s+value|contract\s+price|amount)[:\s]*[₹Rs.INR]*\s*([\d,.]+\s*(?:lakh|crore|cr)?)/i,
    ]),
    commencementDate: extractMatch(input, [
      /(?:commencement|start\s+date)[:\s]+([^\n.]+)/i,
    ]),
    completionDate: extractMatch(input, [
      /(?:completion\s+date|time\s+for\s+completion)[:\s]+([^\n.]+)/i,
    ]),
    defectLiabilityPeriod: extractMatch(input, [
      /(?:defect\s+liability|DLP|maintenance\s+period)[:\s]+([^\n.]+)/i,
    ]),
    paymentTerms: extractList(input, ["payment", "milestone", "certificate", "retention", "advance"]),
    performanceObligations: extractList(input, ["shall", "obligation", "responsible", "ensure", "provide", "complete"]),
    deliverables: extractList(input, ["deliverable", "drawing", "report", "document", "as-built", "manual"]),
    insuranceRequirements: extractList(input, ["insurance", "indemnity", "cover", "policy"]),
    clauses,
  };
};

export const explainClause = (clauseTitle: string): string => {
  const explanations: Record<string, string> = {
    "Payment Terms": "Defines when and how the contractor receives payment — typically milestone-based with retention held until DLP completion.",
    "Liquidated Damages": "Pre-agreed damages for delay — contractor pays per day/week of delay beyond completion date. Review rate and cap.",
    "Defect Liability Period": "Period after completion during which contractor must rectify defects at own cost — typically 12-24 months.",
    "Termination Conditions": "Circumstances under which either party may terminate — review notice periods and consequences.",
    "Variation/Change Orders": "Process for scope changes — defines approval authority, pricing basis and time impact assessment.",
    "Extension of Time": "Contractor's right to claim time extension for qualifying events — must follow notice and substantiation requirements.",
    "Insurance & Indemnity": "Required insurance covers and indemnity obligations — verify adequacy and beneficiary clauses.",
    "Dispute Resolution": "Escalation path from negotiation to arbitration — note governing law and seat of arbitration.",
    "Force Majeure": "Events beyond control excusing performance — review definition, notice requirements and cost allocation.",
    "Performance Security": "BG or retention ensuring performance — verify amount, validity period and release conditions.",
  };
  return explanations[clauseTitle] ?? `Review ${clauseTitle} clause in context of overall contract risk allocation. This is engineering intelligence guidance — not legal advice.`;
};

export const searchContractContent = (
  workspace: { rawInput: string; analysis: ContractAnalysis },
  keyword: string
): string[] => {
  const kw = keyword.toLowerCase();
  const results: string[] = [];
  const text = workspace.rawInput.toLowerCase();

  if (text.includes(kw)) {
    const idx = text.indexOf(kw);
    results.push(workspace.rawInput.slice(Math.max(0, idx - 60), idx + 120));
  }

  for (const clause of workspace.analysis.clauses) {
    if (clause.title.toLowerCase().includes(kw) || clause.category.includes(kw)) {
      results.push(`${clause.title}: ${clause.summary}`);
    }
  }

  return [...new Set(results)].slice(0, 8);
};

export const formatAnalysisForPrompt = (analysis: ContractAnalysis): string =>
  [
    analysis.contractTypeName ? `Type: ${analysis.contractTypeName}` : "",
    analysis.employer ? `Employer: ${analysis.employer}` : "",
    analysis.contractor ? `Contractor: ${analysis.contractor}` : "",
    analysis.projectName ? `Project: ${analysis.projectName}` : "",
    analysis.contractValue ? `Value: ${analysis.contractValue}` : "",
    analysis.commencementDate ? `Commencement: ${analysis.commencementDate}` : "",
    analysis.completionDate ? `Completion: ${analysis.completionDate}` : "",
    analysis.defectLiabilityPeriod ? `DLP: ${analysis.defectLiabilityPeriod}` : "",
    analysis.clauses.length > 0
      ? `Clauses identified: ${analysis.clauses.map((c) => c.title).join(", ")}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

export const formatClauseRegister = (clauses: ContractClause[]): string =>
  clauses.length > 0
    ? clauses.map((c) => `${c.number}. [${c.riskLevel}] ${c.title} (${c.category})`).join("\n")
    : "No clauses extracted — provide contract text for analysis.";

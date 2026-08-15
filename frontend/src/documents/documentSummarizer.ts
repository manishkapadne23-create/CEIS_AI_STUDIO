import type { DocumentChatIntent } from "./types";

const DOCUMENT_CHAT_PATTERNS: Array<{
  intent: DocumentChatIntent;
  patterns: RegExp[];
  instructions: string;
}> = [
  {
    intent: "explain-document",
    patterns: [/explain\s+(this\s+)?document/i, /what\s+does\s+this\s+document/i],
    instructions:
      "Explain the document purpose, scope, and key technical content in plain engineering language.",
  },
  {
    intent: "summarize-section",
    patterns: [
      /summarize\s+section\s+(\d+|[\w.]+)/i,
      /summary\s+of\s+section/i,
    ],
    instructions:
      "Summarize the requested section with key points, requirements, and engineering implications.",
  },
  {
    intent: "list-standards",
    patterns: [
      /list\s+(all\s+)?standards/i,
      /standards\s+referred/i,
      /codes?\s+referenced/i,
    ],
    instructions:
      "List all standards and codes referenced in the document with clause/section context where available.",
  },
  {
    intent: "extract-boq",
    patterns: [
      /extract\s+boq/i,
      /boq\s+items/i,
      /bill\s+of\s+quantities/i,
      /quantity\s+items/i,
    ],
    instructions:
      "Extract BOQ/quantity items in tabular format with item description, unit, and quantity where available.",
  },
  {
    intent: "find-discrepancies",
    patterns: [/discrepanc/i, /inconsistenc/i, /conflict/i, /contradiction/i],
    instructions:
      "Identify discrepancies, inconsistencies, and conflicts within the document or against referenced standards.",
  },
  {
    intent: "missing-clauses",
    patterns: [/missing\s+clause/i, /highlight\s+missing/i, /gaps?\s+in/i],
    instructions:
      "Highlight missing clauses, incomplete specifications, and gaps against standard practice or referenced codes.",
  },
  {
    intent: "review-comments",
    patterns: [/review\s+comment/i, /generate\s+review/i, /review\s+notes/i],
    instructions:
      "Generate professional engineering review comments with severity, clause reference, and recommended action.",
  },
  {
    intent: "meeting-notes",
    patterns: [/meeting\s+notes/i, /minutes\s+of\s+meeting/i],
    instructions:
      "Generate structured meeting notes from document content: attendees, decisions, action items, and open points.",
  },
  {
    intent: "inspection-checklist",
    patterns: [
      /inspection\s+checklist/i,
      /generate\s+checklist\s+from\s+document/i,
    ],
    instructions:
      "Generate an inspection checklist derived from document requirements, acceptance criteria, and test methods.",
  },
  {
    intent: "executive-summary",
    patterns: [/executive\s+summary/i],
    instructions:
      "Generate a concise executive summary for management: scope, key findings, risks, and recommendations.",
  },
  {
    intent: "technical-summary",
    patterns: [/technical\s+summary/i],
    instructions:
      "Generate a technical summary covering design basis, specifications, quantities, standards, and engineering conclusions.",
  },
  {
    intent: "extract-specifications",
    patterns: [/extract\s+specification/i, /specification\s+extract/i],
    instructions:
      "Extract technical specifications, material requirements, and performance criteria in structured format.",
  },
  {
    intent: "extract-quantities",
    patterns: [/extract\s+quantit/i, /quantity\s+take[\s-]?off/i],
    instructions:
      "Extract quantities, measurements, and material take-off data from the document.",
  },
  {
    intent: "identify-risks",
    patterns: [/identify\s+risks?/i, /risk\s+in\s+document/i, /hazards?\s+in/i],
    instructions:
      "Identify technical, contractual, safety, and execution risks present in the document with mitigation suggestions.",
  },
];

const DOCUMENT_CONTEXT_TRIGGERS =
  /\b(document|drawing|specification|upload|pdf|clause|section|attachment|file)\b/i;

export const isDocumentIntelligenceQuery = (message: string): boolean =>
  DOCUMENT_CONTEXT_TRIGGERS.test(message) ||
  DOCUMENT_CHAT_PATTERNS.some((entry) =>
    entry.patterns.some((pattern) => pattern.test(message))
  );

export const detectDocumentChatIntent = (
  message: string
): DocumentChatIntent => {
  for (const entry of DOCUMENT_CHAT_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(message))) {
      return entry.intent;
    }
  }

  if (DOCUMENT_CONTEXT_TRIGGERS.test(message)) {
    return "general-document-query";
  }

  return "general-document-query";
};

export const getAnalysisInstructions = (
  intent: DocumentChatIntent
): string => {
  const match = DOCUMENT_CHAT_PATTERNS.find((entry) => entry.intent === intent);
  if (match) return match.instructions;

  const defaultInstructions: Record<DocumentChatIntent, string> = {
    "explain-document": "Explain the document.",
    "summarize-section": "Summarize the relevant section.",
    "list-standards": "List referenced standards.",
    "extract-boq": "Extract BOQ items.",
    "find-discrepancies": "Find discrepancies.",
    "missing-clauses": "Highlight missing clauses.",
    "review-comments": "Generate review comments.",
    "meeting-notes": "Generate meeting notes.",
    "inspection-checklist": "Generate inspection checklist.",
    "executive-summary": "Generate executive summary.",
    "technical-summary": "Generate technical summary.",
    "extract-specifications": "Extract specifications.",
    "extract-quantities": "Extract quantities.",
    "identify-risks": "Identify risks.",
    "general-document-query": "Assist with document understanding and engineering review.",
  };

  return defaultInstructions[intent];
};

export const buildDocumentAnalysisPrompt = (
  intent: DocumentChatIntent,
  documentNames: string[]
): string => {
  const instructions = getAnalysisInstructions(intent);

  return [
    `Document AI task: ${intent.replace(/-/g, " ")}`,
    `Target documents: ${documentNames.length > 0 ? documentNames.join(", ") : "active library documents"}`,
    "",
    "Capabilities to apply:",
    "- Summarize document",
    "- Explain technical terms",
    "- Extract tables, specifications, quantities, and standards",
    "- Identify risks and missing information",
    "- Generate executive summary, technical summary, and review notes",
    "",
    `Specific instruction: ${instructions}`,
    "",
    "If document content is not fully available, state assumptions and request the relevant section or file.",
  ].join("\n");
};

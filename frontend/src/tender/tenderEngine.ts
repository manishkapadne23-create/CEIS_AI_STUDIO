import {
  customizeChecklist,
  draftPreBidQuestion,
  formatAllChecklistsForPrompt,
  formatChecklistForPrompt,
  generateAllChecklists,
  generateChecklist,
} from "./checklistGenerator";
import { checkEligibility, formatEligibilityReport, getMissingDocuments } from "./eligibilityChecker";
import {
  buildTenderReport,
  buildTenderSummary,
  formatClarifications,
  formatTenderReportForPrompt,
} from "./reportGenerator";
import { analyzeTenderRisks, formatRiskReport, generateClarificationPoints } from "./riskAnalyzer";
import { formatScopeAnalysisForPrompt, identifyCriticalClauses } from "./tenderAnalyzer";
import {
  formatAnalysisForPrompt,
  parseTenderInput,
  searchTenderContent,
} from "./tenderParser";
import type {
  TenderEngineInput,
  TenderEngineResult,
  TenderExtensionHooks,
  TenderWorkspace,
} from "./types";

let extensionHooks: TenderExtensionHooks = {};

export const setTenderExtensionHooks = (hooks: TenderExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getTenderExtensionHooks = (): TenderExtensionHooks => extensionHooks;

const STORAGE_KEY = "sarathi.tender.workspaces";
const ACTIVE_KEY = "sarathi.tender.active";

let workspaceStore: TenderWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as TenderWorkspace[]) : [];
    activeWorkspaceId = localStorage.getItem(ACTIVE_KEY);
  } catch {
    workspaceStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceStore.slice(0, 50)));
  if (activeWorkspaceId) localStorage.setItem(ACTIVE_KEY, activeWorkspaceId);
  else localStorage.removeItem(ACTIVE_KEY);
};

const createWorkspace = (
  input: string,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null,
  projectName: string | null
): TenderWorkspace => {
  hydrate();
  const analysis = parseTenderInput(input, disciplineName);
  const risks = analyzeTenderRisks(analysis, input);
  const clarifications = generateClarificationPoints(analysis, risks).map((c, i) => ({
    id: `clar-${i}`,
    ...c,
  }));

  const now = Date.now();
  const workspace: TenderWorkspace = {
    id: crypto.randomUUID(),
    title: analysis.projectName ?? `Tender Review — ${disciplineName ?? "Engineering"}`,
    disciplineId,
    disciplineName,
    projectName: projectName ?? analysis.projectName,
    conversationId,
    rawInput: input,
    analysis,
    risks,
    missingDocuments: getMissingDocuments(analysis),
    criticalClauses: identifyCriticalClauses(input),
    checklists: generateAllChecklists(),
    clarifications,
    status: "reviewed",
    createdAt: now,
    updatedAt: now,
  };

  workspaceStore.unshift(workspace);
  activeWorkspaceId = workspace.id;
  persist();
  return workspace;
};

export const getActiveWorkspace = (): TenderWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const isTenderQuery = (message: string): boolean =>
  /\b(tender|bid|rfp|rfq|eoi|nit|pre-?bid|eligib|boq\s+review|tender\s+summary|tender\s+report|risk\s+report|bid\s+checklist|clarification|scope\s+of\s+work|emd|earnest)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const analyzeMatch = message.match(
    /^(?:analyze|review|understand|parse)\s+tender\s*[:\-]?\s*(.+)?$/is
  );
  if (analyzeMatch) return { action: "analyze", payload: analyzeMatch[1]?.trim() ?? message };

  const summaryMatch = message.match(/^tender\s+summary$/i);
  if (summaryMatch) return { action: "summary", payload: "" };

  const reportMatch = message.match(/^tender\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const eligibilityMatch = message.match(/^eligibility\s+(?:review|check|report)$/i);
  if (eligibilityMatch) return { action: "eligibility", payload: "" };

  const riskMatch = message.match(/^risk\s+report$/i);
  if (riskMatch) return { action: "risk", payload: "" };

  const checklistMatch = message.match(
    /^(?:bid|technical|commercial|qualification)\s+checklist$/i
  );
  if (checklistMatch) return { action: "checklist", payload: checklistMatch[0] };

  const allChecklistsMatch = message.match(/^(?:all\s+)?(?:tender\s+)?checklists?$/i);
  if (allChecklistsMatch) return { action: "all-checklists", payload: "" };

  const clarifyMatch = message.match(
    /^draft\s+(?:pre-?bid\s+)?(?:query|question)\s+(?:on\s+)?(.+)$/i
  );
  if (clarifyMatch) return { action: "clarify", payload: clarifyMatch[1].trim() };

  const searchMatch = message.match(
    /^search\s+tender\s+(?:for\s+)?(.+)$/i
  );
  if (searchMatch) return { action: "search", payload: searchMatch[1].trim() };

  const missingMatch = message.match(/^missing\s+documents?$/i);
  if (missingMatch) return { action: "missing-docs", payload: "" };

  return null;
};

/** Run Engineering Tender Intelligence Engine (ETIE) for a user turn. */
export const runTenderEngine = (
  input: TenderEngineInput
): TenderEngineResult => {
  let tenderAction: string | null = null;
  let reportAction: string | null = null;
  let activeWorkspace = getActiveWorkspace();

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "analyze": {
        activeWorkspace = createWorkspace(
          command.payload || input.userMessage,
          input.conversationId,
          input.disciplineId,
          input.disciplineName,
          input.projectName
        );
        tenderAction = [
          `Tender workspace created: ${activeWorkspace.title}`,
          formatAnalysisForPrompt(activeWorkspace.analysis),
          "",
          formatScopeAnalysisForPrompt(activeWorkspace.analysis),
          "",
          `Missing documents: ${activeWorkspace.missingDocuments.join("; ")}`,
          "",
          `Critical clauses: ${activeWorkspace.criticalClauses.slice(0, 3).join("; ")}`,
        ].join("\n");
        break;
      }
      case "summary": {
        if (!activeWorkspace) {
          tenderAction = "No active tender. Say 'Analyze tender' with tender details.";
          break;
        }
        tenderAction = buildTenderSummary(activeWorkspace);
        break;
      }
      case "report": {
        if (!activeWorkspace) {
          reportAction = "No active tender workspace.";
          break;
        }
        const eligibility = checkEligibility(activeWorkspace.analysis);
        const report = buildTenderReport(activeWorkspace, eligibility);
        reportAction = formatTenderReportForPrompt(report);
        break;
      }
      case "eligibility": {
        if (!activeWorkspace) {
          tenderAction = "No active tender workspace.";
          break;
        }
        tenderAction = formatEligibilityReport(checkEligibility(activeWorkspace.analysis));
        break;
      }
      case "risk": {
        if (!activeWorkspace) {
          tenderAction = "No active tender workspace.";
          break;
        }
        tenderAction = formatRiskReport(activeWorkspace.risks);
        break;
      }
      case "checklist": {
        const typeMap: Record<string, "bid-submission" | "technical-document" | "commercial-document" | "qualification"> = {
          "bid checklist": "bid-submission",
          "technical checklist": "technical-document",
          "commercial checklist": "commercial-document",
          "qualification checklist": "qualification",
        };
        const type = typeMap[command.payload.toLowerCase()] ?? "bid-submission";
        const checklist = activeWorkspace
          ? customizeChecklist(generateChecklist(type), activeWorkspace.analysis)
          : generateChecklist(type);
        tenderAction = formatChecklistForPrompt(checklist);
        break;
      }
      case "all-checklists": {
        const checklists = activeWorkspace
          ? activeWorkspace.checklists
          : generateAllChecklists();
        tenderAction = formatAllChecklistsForPrompt(checklists);
        break;
      }
      case "clarify": {
        if (!activeWorkspace) {
          tenderAction = draftPreBidQuestion(command.payload, "Please provide clarification on the above matter.");
        } else {
          tenderAction = draftPreBidQuestion(
            command.payload,
            `Regarding tender: ${activeWorkspace.title}`
          );
        }
        break;
      }
      case "search": {
        if (!activeWorkspace) {
          tenderAction = "No active tender. Analyze a tender first.";
          break;
        }
        const results = searchTenderContent(activeWorkspace, command.payload);
        tenderAction =
          results.length > 0
            ? `Search results for "${command.payload}":\n${results.map((r) => `- ${r}`).join("\n")}`
            : `No matches for "${command.payload}".`;
        break;
      }
      case "missing-docs": {
        if (!activeWorkspace) {
          tenderAction = "No active tender workspace.";
          break;
        }
        tenderAction = [
          "MISSING DOCUMENTS:",
          ...activeWorkspace.missingDocuments.map((d) => `- ${d}`),
        ].join("\n");
        break;
      }
    }
  }

  if (!tenderAction && !reportAction && isTenderQuery(input.userMessage)) {
    if (!activeWorkspace) {
      activeWorkspace = createWorkspace(
        input.userMessage,
        input.conversationId,
        input.disciplineId,
        input.disciplineName,
        input.projectName
      );
    }
    tenderAction = [
      formatAnalysisForPrompt(activeWorkspace.analysis),
      "",
      formatRiskReport(activeWorkspace.risks),
      "",
      "Clarifications:",
      formatClarifications(activeWorkspace.clarifications),
    ].join("\n");
  }

  const active =
    isTenderQuery(input.userMessage) ||
    activeWorkspace !== null ||
    tenderAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.documentAiEnabled) extensionNotes.push("Document AI enabled");
  if (extensionHooks.tenderComparisonId) extensionNotes.push(`Comparison: ${extensionHooks.tenderComparisonId}`);
  if (extensionHooks.corrigendumTrackingId) extensionNotes.push(`Corrigendum: ${extensionHooks.corrigendumTrackingId}`);
  if (extensionHooks.addendumTrackingId) extensionNotes.push(`Addendum: ${extensionHooks.addendumTrackingId}`);
  if (extensionHooks.contractIntelligenceId) extensionNotes.push(`Contract: ${extensionHooks.contractIntelligenceId}`);
  if (extensionHooks.pmisProcurementModuleId) extensionNotes.push(`PMIS: ${extensionHooks.pmisProcurementModuleId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Tender Intelligence Engine (ETIE)",
    "========================================",
    "AI-powered Tender Assistant — NOT an e-tender portal.",
    "Assists in understanding, preparing and reviewing engineering tenders.",
    "",
    tenderAction ? `TENDER:\n${tenderAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace
      ? `\nActive workspace: ${activeWorkspace.title} | ${activeWorkspace.risks.length} risks | ${activeWorkspace.clarifications.length} clarifications`
      : "",
    "",
    "ETIE COMMANDS:",
    "- Analyze tender [details] | Tender summary | Tender report",
    "- Eligibility review | Risk report | Missing documents",
    "- Bid checklist | Technical checklist | All checklists",
    "- Draft pre-bid query on [topic] | Search tender [keyword]",
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    tenderAction,
    reportAction,
    analysis: activeWorkspace?.analysis ?? null,
    riskCount: activeWorkspace?.risks.length ?? 0,
    promptAugmentation,
    summaryText: [
      active ? "etie-active" : "",
      activeWorkspace?.title ?? "",
      activeWorkspace ? `${activeWorkspace.risks.length} risks` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatTenderForPrompt = (result: TenderEngineResult): string =>
  result.promptAugmentation;

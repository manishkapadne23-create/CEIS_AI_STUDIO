import {
  explainClause,
  formatAnalysisForPrompt,
  formatClauseRegister,
  parseContractInput,
  searchContractContent,
} from "./clauseAnalyzer";
import {
  analyzeEotGuidance,
  analyzeVariation,
  assessClaim,
  formatClaimAssessment,
  resolveClaimType,
} from "./claimsEngine";
import {
  buildResponsibilityMatrix,
  formatResponsibilityMatrix,
  reviewDeliverables,
  reviewTimeObligations,
} from "./obligationMapper";
import {
  buildContractReport,
  formatContractReportForPrompt,
} from "./reportGenerator";
import {
  analyzeContractRisks,
  formatRiskRegister,
  identifyCriticalClauses,
  identifyMissingClauses,
} from "./riskAnalyzer";
import type {
  ContractEngineInput,
  ContractEngineResult,
  ContractExtensionHooks,
  ContractWorkspace,
} from "./types";

let extensionHooks: ContractExtensionHooks = {};

export const setContractExtensionHooks = (hooks: ContractExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getContractExtensionHooks = (): ContractExtensionHooks =>
  extensionHooks;

const STORAGE_KEY = "sarathi.contracts.workspaces";
const ACTIVE_KEY = "sarathi.contracts.active";

let workspaceStore: ContractWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as ContractWorkspace[]) : [];
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
): ContractWorkspace => {
  hydrate();
  const analysis = parseContractInput(input, disciplineName);
  const risks = analyzeContractRisks(analysis, input);
  const responsibilities = buildResponsibilityMatrix(analysis);
  const now = Date.now();

  const workspace: ContractWorkspace = {
    id: crypto.randomUUID(),
    title: analysis.projectName ?? `Contract Review — ${disciplineName ?? "Engineering"}`,
    disciplineId,
    disciplineName,
    projectName: projectName ?? analysis.projectName,
    conversationId,
    rawInput: input,
    analysis,
    risks,
    responsibilities,
    missingClauses: identifyMissingClauses(analysis),
    criticalClauses: identifyCriticalClauses(analysis),
    claims: [],
    status: "reviewed",
    createdAt: now,
    updatedAt: now,
  };

  workspaceStore.unshift(workspace);
  activeWorkspaceId = workspace.id;
  persist();
  return workspace;
};

export const getActiveWorkspace = (): ContractWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const updateWorkspace = (workspace: ContractWorkspace): void => {
  hydrate();
  const index = workspaceStore.findIndex((w) => w.id === workspace.id);
  if (index >= 0) {
    workspaceStore[index] = { ...workspace, updatedAt: Date.now() };
    persist();
  }
};

const isContractQuery = (message: string): boolean =>
  /\b(contract|clause|claim|eot|extension\s+of\s+time|variation|fidic|liquidated\s+damages|defect\s+liability|responsibility\s+matrix|risk\s+register|contract\s+report|contract\s+summary|delay\s+claim|boq|termination|insurance|arbitration)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const analyzeMatch = message.match(
    /^(?:analyze|review|understand|parse)\s+contract\s*[:\-]?\s*(.+)?$/is
  );
  if (analyzeMatch) return { action: "analyze", payload: analyzeMatch[1]?.trim() ?? message };

  const summaryMatch = message.match(/^contract\s+summary$/i);
  if (summaryMatch) return { action: "summary", payload: "" };

  const reportMatch = message.match(/^contract\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const riskMatch = message.match(/^risk\s+register$/i);
  if (riskMatch) return { action: "risk", payload: "" };

  const matrixMatch = message.match(/^responsibility\s+matrix$/i);
  if (matrixMatch) return { action: "matrix", payload: "" };

  const clauseMatch = message.match(/^explain\s+clause\s+(.+)$/i);
  if (clauseMatch) return { action: "explain", payload: clauseMatch[1].trim() };

  const claimMatch = message.match(
    /^(?:assess|prepare|claims?\s+guidance\s+(?:for|on)?)\s+(.+)$/i
  );
  if (claimMatch && resolveClaimType(claimMatch[1])) {
    return { action: "claim", payload: claimMatch[1].trim() };
  }

  const eotMatch = message.match(/^eot\s+guidance$/i);
  if (eotMatch) return { action: "eot", payload: "" };

  const variationMatch = message.match(/^variation\s+analysis$/i);
  if (variationMatch) return { action: "variation", payload: "" };

  const searchMatch = message.match(/^search\s+contract\s+(?:for\s+)?(.+)$/i);
  if (searchMatch) return { action: "search", payload: searchMatch[1].trim() };

  const deliverablesMatch = message.match(/^deliverable\s+review$/i);
  if (deliverablesMatch) return { action: "deliverables", payload: "" };

  const timeMatch = message.match(/^time\s+obligations?$/i);
  if (timeMatch) return { action: "time", payload: "" };

  const missingMatch = message.match(/^missing\s+clauses?$/i);
  if (missingMatch) return { action: "missing", payload: "" };

  return null;
};

/** Run Engineering Contract & Claims Intelligence Engine (ECCIE) for a user turn. */
export const runContractEngine = (
  input: ContractEngineInput
): ContractEngineResult => {
  let contractAction: string | null = null;
  let reportAction: string | null = null;
  let claimAction: string | null = null;
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
        contractAction = [
          `Contract workspace created: ${activeWorkspace.title}`,
          formatAnalysisForPrompt(activeWorkspace.analysis),
          "",
          formatRiskRegister(activeWorkspace.risks),
          "",
          `Missing clauses: ${activeWorkspace.missingClauses.join(", ") || "None identified"}`,
          `Critical clauses: ${activeWorkspace.criticalClauses.join(", ") || "None"}`,
        ].join("\n");
        break;
      }
      case "summary": {
        if (!activeWorkspace) {
          contractAction = "No active contract. Say 'Analyze contract' with contract details.";
          break;
        }
        contractAction = formatAnalysisForPrompt(activeWorkspace.analysis);
        break;
      }
      case "report": {
        if (!activeWorkspace) {
          reportAction = "No active contract workspace.";
          break;
        }
        reportAction = formatContractReportForPrompt(buildContractReport(activeWorkspace));
        break;
      }
      case "risk": {
        if (!activeWorkspace) {
          contractAction = "No active contract workspace.";
          break;
        }
        contractAction = formatRiskRegister(activeWorkspace.risks);
        break;
      }
      case "matrix": {
        if (!activeWorkspace) {
          contractAction = "No active contract workspace.";
          break;
        }
        contractAction = formatResponsibilityMatrix(activeWorkspace.responsibilities);
        break;
      }
      case "explain": {
        contractAction = explainClause(command.payload);
        break;
      }
      case "claim": {
        const claimType = resolveClaimType(command.payload);
        if (!claimType) {
          claimAction = "Claim type not recognized. Try: delay claim, variation claim, EOT.";
          break;
        }
        const assessment = assessClaim(claimType, input.userMessage);
        if (activeWorkspace) {
          activeWorkspace.claims.push(assessment);
          updateWorkspace(activeWorkspace);
        }
        claimAction = formatClaimAssessment(assessment);
        break;
      }
      case "eot": {
        claimAction = [
          "EXTENSION OF TIME GUIDANCE:",
          ...analyzeEotGuidance(input.userMessage).map((g) => `- ${g}`),
        ].join("\n");
        break;
      }
      case "variation": {
        contractAction = [
          "VARIATION ANALYSIS:",
          ...analyzeVariation(input.userMessage).map((v) => `- ${v}`),
        ].join("\n");
        break;
      }
      case "search": {
        if (!activeWorkspace) {
          contractAction = "No active contract. Analyze a contract first.";
          break;
        }
        const results = searchContractContent(activeWorkspace, command.payload);
        contractAction =
          results.length > 0
            ? results.map((r) => `- ${r}`).join("\n")
            : `No matches for "${command.payload}".`;
        break;
      }
      case "deliverables": {
        if (!activeWorkspace) {
          contractAction = "No active contract workspace.";
          break;
        }
        contractAction = reviewDeliverables(activeWorkspace.analysis)
          .map((d) => `- ${d}`)
          .join("\n");
        break;
      }
      case "time": {
        if (!activeWorkspace) {
          contractAction = "No active contract workspace.";
          break;
        }
        contractAction = reviewTimeObligations(activeWorkspace.analysis)
          .map((t) => `- ${t}`)
          .join("\n");
        break;
      }
      case "missing": {
        if (!activeWorkspace) {
          contractAction = "No active contract workspace.";
          break;
        }
        contractAction = [
          "MISSING CLAUSES:",
          ...activeWorkspace.missingClauses.map((c) => `- ${c}`),
        ].join("\n");
        break;
      }
    }
  }

  if (!contractAction && !reportAction && !claimAction && isContractQuery(input.userMessage)) {
    if (!activeWorkspace) {
      activeWorkspace = createWorkspace(
        input.userMessage,
        input.conversationId,
        input.disciplineId,
        input.disciplineName,
        input.projectName
      );
    }
    contractAction = [
      formatAnalysisForPrompt(activeWorkspace.analysis),
      "",
      formatClauseRegister(activeWorkspace.analysis.clauses),
      "",
      formatRiskRegister(activeWorkspace.risks),
    ].join("\n");
  }

  const active =
    isContractQuery(input.userMessage) ||
    activeWorkspace !== null ||
    contractAction !== null ||
    reportAction !== null ||
    claimAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.fidicIntegrationId) extensionNotes.push(`FIDIC: ${extensionHooks.fidicIntegrationId}`);
  if (extensionHooks.governmentContractId) extensionNotes.push(`Gov contracts: ${extensionHooks.governmentContractId}`);
  if (extensionHooks.pppAgreementId) extensionNotes.push(`PPP: ${extensionHooks.pppAgreementId}`);
  if (extensionHooks.arbitrationSupportId) extensionNotes.push(`Arbitration: ${extensionHooks.arbitrationSupportId}`);
  if (extensionHooks.disputeResolutionId) extensionNotes.push(`Disputes: ${extensionHooks.disputeResolutionId}`);
  if (extensionHooks.pmisContractAdminId) extensionNotes.push(`PMIS: ${extensionHooks.pmisContractAdminId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Contract & Claims Intelligence (ECCIE)",
    "========================================",
    "Engineering contract intelligence — NOT legal advice.",
    "Assists in understanding, reviewing and preparing contract and claims documentation.",
    "",
    contractAction ? `CONTRACT:\n${contractAction}` : "",
    claimAction ? `CLAIMS:\n${claimAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace
      ? `\nActive workspace: ${activeWorkspace.title} | ${activeWorkspace.risks.length} risks | ${activeWorkspace.claims.length} claims`
      : "",
    "",
    "ECCIE COMMANDS:",
    "- Analyze contract [details] | Contract summary | Contract report",
    "- Risk register | Responsibility matrix | Missing clauses",
    "- Explain clause [name] | Assess delay claim | EOT guidance",
    "- Variation analysis | Deliverable review | Search contract [keyword]",
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    contractAction,
    reportAction,
    claimAction,
    riskCount: activeWorkspace?.risks.length ?? 0,
    promptAugmentation,
    summaryText: [
      active ? "eccie-active" : "",
      activeWorkspace?.title ?? "",
      activeWorkspace ? `${activeWorkspace.risks.length} risks` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatContractForPrompt = (result: ContractEngineResult): string =>
  result.promptAugmentation;

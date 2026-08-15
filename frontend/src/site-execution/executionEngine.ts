import {
  CHECKLIST_TEMPLATE_COUNT,
  formatChecklist,
  generateChecklist,
  resolveChecklistType,
} from "./checklistEngine";
import {
  createInspectionRecord,
  formatInspectionGuidance,
  formatInspectionMethods,
  formatInspectionRecord,
  searchInspectionMethods,
} from "./inspectionEngine";
import {
  createQualityRecord,
  formatNcrReport,
  formatQualityGuidance,
  identifyNonConformance,
  suggestCorrectiveActions,
  verifyMaterial,
} from "./qualityEngine";
import {
  formatSiteReport,
  generateDailyProgressReport,
  generateInspectionReport,
  generateQualityReport,
  generateSafetyObservation,
  generateSiteInstruction,
  generateSiteObservationReport,
  generateWorkCompletionRecord,
} from "./siteReports";
import {
  formatExecutionSequence,
  formatTroubleshooting,
  getCommissioningGuidance,
  getConstructionGuidance,
  searchExecutionProcedures,
  searchSafetyPractices,
  troubleshootIssue,
} from "./troubleshootingEngine";
import type {
  ExecutionEngineInput,
  ExecutionEngineResult,
  ExecutionExtensionHooks,
  ExecutionPhase,
  SiteActivityType,
  SiteExecutionWorkspace,
} from "./types";
import { CHECKLIST_TYPES, EXECUTION_PHASES } from "./types";

let extensionHooks: ExecutionExtensionHooks = {};

export const setExecutionExtensionHooks = (hooks: ExecutionExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getExecutionExtensionHooks = (): ExecutionExtensionHooks => extensionHooks;

const STORAGE_KEY = "sarathi.site-execution.workspaces";
const ACTIVE_KEY = "sarathi.site-execution.active";

let workspaceStore: SiteExecutionWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as SiteExecutionWorkspace[]) : [];
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

const resolveActivityType = (text: string): SiteActivityType => {
  const t = text.toLowerCase();
  if (/concrete|rebar|formwork/i.test(t)) return "concrete";
  if (/steel|structural/i.test(t)) return "steel";
  if (/electrical|cable|wiring/i.test(t)) return "electrical";
  if (/mechanical|equipment|machine/i.test(t)) return "mechanical";
  if (/piping|pipe|plumbing/i.test(t)) return "piping";
  if (/hvac|duct|ventilation/i.test(t)) return "hvac";
  if (/finish|paint|tile/i.test(t)) return "finishing";
  return "general";
};

const resolvePhase = (message: string): ExecutionPhase => {
  const m = message.toLowerCase();
  if (/commission/i.test(m)) return "commissioning";
  if (/test/i.test(m)) return "testing";
  if (/inspect/i.test(m)) return "inspection";
  if (/install/i.test(m)) return "installation";
  if (/manufactur/i.test(m)) return "manufacturing";
  if (/handover|hand\s*over/i.test(m)) return "handover";
  return "construction";
};

const createWorkspace = (
  title: string,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null,
  projectName: string | null,
  message: string
): SiteExecutionWorkspace => {
  hydrate();
  const now = Date.now();
  const ws: SiteExecutionWorkspace = {
    id: crypto.randomUUID(),
    title: title || `Site Execution — ${disciplineName ?? "Engineering"}`,
    disciplineId,
    disciplineName,
    conversationId,
    projectName: (projectName ?? title) || null,
    activityType: resolveActivityType(message),
    phase: resolvePhase(message),
    checklists: [],
    inspections: [],
    qualityRecords: [],
    reports: [],
    observations: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };
  workspaceStore.unshift(ws);
  activeWorkspaceId = ws.id;
  persist();
  return ws;
};

export const getActiveSiteWorkspace = (): SiteExecutionWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const updateWorkspace = (ws: SiteExecutionWorkspace): void => {
  hydrate();
  const i = workspaceStore.findIndex((w) => w.id === ws.id);
  if (i >= 0) {
    workspaceStore[i] = { ...ws, updatedAt: Date.now() };
    persist();
  }
};

const isExecutionQuery = (message: string): boolean =>
  /\b(site\s+execution|construction\s+guidance|installation\s+guidance|execution\s+sequence|inspection\s+guidance|quality\s+guidance|safety\s+guidance|testing\s+guidance|commissioning|daily\s+(?:site\s+)?checklist|inspection\s+checklist|daily\s+progress|inspection\s+report|site\s+observation|quality\s+report|safety\s+observation|work\s+completion|site\s+instruction|troubleshoot|non[\s-]?conformance|ncr)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const startMatch = message.match(
    /^(?:start\s+site(?:\s+execution)?|create\s+site(?:\s+execution)?(?:\s+workspace)?|site\s+execution\s+workspace)\s*(?:for\s+)?(.+)?$/i
  );
  if (startMatch) return { action: "start", payload: startMatch[1]?.trim() ?? "" };

  const checklistMatch = message.match(
    /^(?:(daily\s+site|inspection|material|equipment|labour|labor|safety|permit)\s+)?checklist$/i
  );
  if (checklistMatch) return { action: "checklist", payload: checklistMatch[1]?.trim() ?? "daily site" };

  const constructionMatch = message.match(/^construction\s+guidance(?:\s+(.+))?$/i);
  if (constructionMatch) return { action: "construction", payload: constructionMatch[1]?.trim() ?? "" };

  const installMatch = message.match(/^installation\s+guidance(?:\s+(.+))?$/i);
  if (installMatch) return { action: "installation", payload: installMatch[1]?.trim() ?? "" };

  const sequenceMatch = message.match(/^execution\s+sequence(?:\s+(.+))?$/i);
  if (sequenceMatch) return { action: "sequence", payload: sequenceMatch[1]?.trim() ?? "" };

  const inspectGuideMatch = message.match(/^inspection\s+guidance(?:\s+(.+))?$/i);
  if (inspectGuideMatch) return { action: "inspect-guide", payload: inspectGuideMatch[1]?.trim() ?? "" };

  const qualityMatch = message.match(/^quality\s+guidance(?:\s+(.+))?$/i);
  if (qualityMatch) return { action: "quality", payload: qualityMatch[1]?.trim() ?? "" };

  const safetyMatch = message.match(/^safety\s+guidance$/i);
  if (safetyMatch) return { action: "safety", payload: "" };

  const testingMatch = message.match(/^testing\s+guidance(?:\s+(.+))?$/i);
  if (testingMatch) return { action: "testing", payload: testingMatch[1]?.trim() ?? "" };

  const commissioningMatch = message.match(/^commissioning\s+guidance(?:\s+(.+))?$/i);
  if (commissioningMatch) return { action: "commissioning", payload: commissioningMatch[1]?.trim() ?? "" };

  const progressMatch = message.match(/^daily\s+progress\s+report$/i);
  if (progressMatch) return { action: "daily-progress", payload: "" };

  const inspectReportMatch = message.match(/^inspection\s+report(?:\s+(.+))?$/i);
  if (inspectReportMatch) return { action: "inspect-report", payload: inspectReportMatch[1]?.trim() ?? "" };

  const observeMatch = message.match(/^site\s+observation(?:\s+report)?(?:\s+(.+))?$/i);
  if (observeMatch) return { action: "observation", payload: observeMatch[1]?.trim() ?? "" };

  const qualityReportMatch = message.match(/^quality\s+report$/i);
  if (qualityReportMatch) return { action: "quality-report", payload: "" };

  const safetyObsMatch = message.match(/^safety\s+observation(?:\s+(.+))?$/i);
  if (safetyObsMatch) return { action: "safety-obs", payload: safetyObsMatch[1]?.trim() ?? "" };

  const completionMatch = message.match(/^work\s+completion(?:\s+record)?(?:\s+(.+))?$/i);
  if (completionMatch) return { action: "completion", payload: completionMatch[1]?.trim() ?? "" };

  const instructionMatch = message.match(/^site\s+instruction(?:\s+(.+))?$/i);
  if (instructionMatch) return { action: "instruction", payload: instructionMatch[1]?.trim() ?? "" };

  const troubleshootMatch = message.match(/^troubleshoot(?:\s+(.+))?$/i);
  if (troubleshootMatch) return { action: "troubleshoot", payload: troubleshootMatch[1]?.trim() ?? message };

  const ncrMatch = message.match(/^non[\s-]?conformance(?:\s+(.+))?$/i);
  if (ncrMatch) return { action: "ncr", payload: ncrMatch[1]?.trim() ?? "" };

  const recordInspectMatch = message.match(/^record\s+inspection[:\s]+(.+)$/is);
  if (recordInspectMatch) return { action: "record-inspect", payload: recordInspectMatch[1].trim() };

  const verifyMaterialMatch = message.match(/^verify\s+material(?:\s+(.+))?$/i);
  if (verifyMaterialMatch) return { action: "verify-material", payload: verifyMaterialMatch[1]?.trim() ?? "" };

  const searchMatch = message.match(/^search\s+(?:execution|procedure|checklist)(?:\s+(.+))?$/i);
  if (searchMatch) return { action: "search", payload: searchMatch[1]?.trim() ?? "" };

  const searchSafetyMatch = message.match(/^search\s+safety(?:\s+(.+))?$/i);
  if (searchSafetyMatch) return { action: "search-safety", payload: searchSafetyMatch[1]?.trim() ?? "" };

  const searchInspectMatch = message.match(/^search\s+inspection(?:\s+(.+))?$/i);
  if (searchInspectMatch) return { action: "search-inspect", payload: searchInspectMatch[1]?.trim() ?? "" };

  const phasesMatch = message.match(/^execution\s+phases?$/i);
  if (phasesMatch) return { action: "phases", payload: "" };

  return null;
};

/** Run Engineering Site Execution Intelligence Engine (ESEIE) for a user turn. */
export const runExecutionEngine = (
  input: ExecutionEngineInput
): ExecutionEngineResult => {
  let executionAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;
  let activeWorkspace = getActiveSiteWorkspace();

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "start": {
        activeWorkspace = createWorkspace(
          command.payload ? `Site: ${command.payload}` : "",
          input.conversationId,
          input.disciplineId,
          input.disciplineName,
          command.payload || input.projectName || null,
          input.userMessage
        );
        executionAction = [
          `Site Execution Workspace: ${activeWorkspace.title}`,
          `Discipline: ${activeWorkspace.disciplineName ?? "General"}`,
          `Phase: ${activeWorkspace.phase}`,
          `Activity: ${activeWorkspace.activityType}`,
          "",
          "Available: Daily site checklist, Inspection guidance, Quality guidance, Troubleshoot [issue]",
        ].join("\n");
        break;
      }
      case "checklist": {
        if (!activeWorkspace) {
          activeWorkspace = createWorkspace(
            "",
            input.conversationId,
            input.disciplineId,
            input.disciplineName,
            input.projectName ?? null,
            input.userMessage
          );
        }
        const type = resolveChecklistType(command.payload);
        const checklist = generateChecklist(
          type,
          activeWorkspace.phase,
          input.disciplineName
        );
        activeWorkspace.checklists.unshift(checklist);
        updateWorkspace(activeWorkspace);
        executionAction = formatChecklist(checklist);
        break;
      }
      case "construction": {
        const activity = command.payload || activeWorkspace?.activityType || "construction work";
        executionAction = [
          `CONSTRUCTION GUIDANCE — ${activity}`,
          ...getConstructionGuidance(activity, input.disciplineName).map((g, i) => `${i + 1}. ${g}`),
        ].join("\n");
        break;
      }
      case "installation": {
        const activity = command.payload || "equipment installation";
        executionAction = formatExecutionSequence(activity, "installation");
        break;
      }
      case "sequence": {
        const activity = command.payload || activeWorkspace?.activityType || "general work";
        executionAction = formatExecutionSequence(
          activity,
          activeWorkspace?.phase ?? "construction"
        );
        break;
      }
      case "inspect-guide": {
        const activity = command.payload || activeWorkspace?.activityType || "field work";
        executionAction = formatInspectionGuidance(
          activity,
          input.disciplineName,
          activeWorkspace?.phase ?? "inspection"
        );
        break;
      }
      case "quality": {
        const activity = command.payload || activeWorkspace?.activityType || "site work";
        executionAction = formatQualityGuidance(activity);
        break;
      }
      case "safety": {
        const practices = searchSafetyPractices("");
        executionAction = [
          "SAFETY GUIDANCE — Key Site Safety Practices:",
          ...practices.map((p, i) => `${i + 1}. ${p}`),
        ].join("\n");
        break;
      }
      case "testing": {
        const activity = command.payload || "system testing";
        executionAction = [
          `TESTING GUIDANCE — ${activity}`,
          "1. Verify test equipment calibration certificates",
          "2. Review approved test procedure and acceptance criteria",
          "3. Ensure area is safe and isolated for testing",
          "4. Record ambient conditions if relevant",
          "5. Execute tests step by step per procedure",
          "6. Document all readings and observations",
          "7. Compare results against specification limits",
          "8. Issue test report with pass/fail determination",
        ].join("\n");
        break;
      }
      case "commissioning": {
        const system = command.payload || activeWorkspace?.activityType || "system";
        executionAction = [
          `COMMISSIONING GUIDANCE — ${system}`,
          ...getCommissioningGuidance(system).map((g, i) => `${i + 1}. ${g}`),
        ].join("\n");
        break;
      }
      case "daily-progress": {
        if (!activeWorkspace) {
          reportAction = "No active site workspace. Say 'Start site execution [project]'.";
          break;
        }
        const report = generateDailyProgressReport(activeWorkspace);
        activeWorkspace.reports.unshift(report);
        updateWorkspace(activeWorkspace);
        reportAction = formatSiteReport(report);
        break;
      }
      case "inspect-report": {
        if (!activeWorkspace) {
          reportAction = "No active site workspace.";
          break;
        }
        const activity = command.payload || activeWorkspace.activityType;
        const report = generateInspectionReport(activeWorkspace, activity);
        activeWorkspace.reports.unshift(report);
        updateWorkspace(activeWorkspace);
        reportAction = formatSiteReport(report);
        break;
      }
      case "observation": {
        if (!activeWorkspace) {
          activeWorkspace = createWorkspace(
            "",
            input.conversationId,
            input.disciplineId,
            input.disciplineName,
            input.projectName ?? null,
            input.userMessage
          );
        }
        if (command.payload) activeWorkspace.observations.unshift(command.payload);
        const report = generateSiteObservationReport(activeWorkspace, command.payload);
        activeWorkspace.reports.unshift(report);
        updateWorkspace(activeWorkspace);
        reportAction = formatSiteReport(report);
        break;
      }
      case "quality-report": {
        if (!activeWorkspace) {
          reportAction = "No active site workspace.";
          break;
        }
        const report = generateQualityReport(activeWorkspace);
        activeWorkspace.reports.unshift(report);
        updateWorkspace(activeWorkspace);
        reportAction = formatSiteReport(report);
        break;
      }
      case "safety-obs": {
        const report = generateSafetyObservation(command.payload);
        if (activeWorkspace) {
          activeWorkspace.reports.unshift(report);
          if (command.payload) activeWorkspace.observations.unshift(`Safety: ${command.payload}`);
          updateWorkspace(activeWorkspace);
        }
        reportAction = formatSiteReport(report);
        break;
      }
      case "completion": {
        if (!activeWorkspace) {
          reportAction = "No active site workspace.";
          break;
        }
        const activity = command.payload || activeWorkspace.activityType;
        const report = generateWorkCompletionRecord(activeWorkspace, activity);
        activeWorkspace.reports.unshift(report);
        updateWorkspace(activeWorkspace);
        reportAction = formatSiteReport(report);
        break;
      }
      case "instruction": {
        const topic = command.payload || "General site instruction";
        const report = generateSiteInstruction(topic, "");
        if (activeWorkspace) {
          activeWorkspace.reports.unshift(report);
          updateWorkspace(activeWorkspace);
        }
        reportAction = formatSiteReport(report);
        break;
      }
      case "troubleshoot": {
        const result = troubleshootIssue(command.payload, input.disciplineName);
        executionAction = formatTroubleshooting(result);
        break;
      }
      case "ncr": {
        const ncrs = identifyNonConformance(command.payload || input.userMessage);
        const actions = suggestCorrectiveActions(ncrs);
        if (activeWorkspace) {
          const record = createQualityRecord(
            command.payload || "Site activity",
            false,
            "reject",
            ncrs
          );
          activeWorkspace.qualityRecords.unshift(record);
          updateWorkspace(activeWorkspace);
        }
        executionAction = formatNcrReport(command.payload || input.userMessage, actions);
        break;
      }
      case "record-inspect": {
        if (!activeWorkspace) {
          activeWorkspace = createWorkspace(
            "",
            input.conversationId,
            input.disciplineId,
            input.disciplineName,
            input.projectName ?? null,
            input.userMessage
          );
        }
        const record = createInspectionRecord(
          command.payload,
          [command.payload],
          "conditional",
          null
        );
        activeWorkspace.inspections.unshift(record);
        updateWorkspace(activeWorkspace);
        executionAction = formatInspectionRecord(record);
        break;
      }
      case "verify-material": {
        const material = command.payload || "delivered material";
        const verification = verifyMaterial(material, null);
        executionAction = [
          `MATERIAL VERIFICATION — ${material}`,
          "",
          "Checks:",
          ...verification.checks.map((c, i) => `${i + 1}. ${c}`),
          "",
          "Required Documents:",
          ...verification.documents.map((d) => `- ${d}`),
        ].join("\n");
        break;
      }
      case "search": {
        const results = searchExecutionProcedures(command.payload);
        searchResultCount = results.length;
        executionAction = results.length > 0
          ? ["EXECUTION PROCEDURES:", ...results.map((r, i) => `${i + 1}. ${r}`)].join("\n")
          : "No matching procedures found.";
        break;
      }
      case "search-safety": {
        const results = searchSafetyPractices(command.payload);
        searchResultCount = results.length;
        executionAction = results.length > 0
          ? ["SAFETY PRACTICES:", ...results.map((r, i) => `${i + 1}. ${r}`)].join("\n")
          : "No matching safety practices found.";
        break;
      }
      case "search-inspect": {
        const results = searchInspectionMethods(command.payload);
        searchResultCount = results.length;
        executionAction = formatInspectionMethods(results);
        break;
      }
      case "phases": {
        executionAction = [
          "EXECUTION PHASES:",
          ...EXECUTION_PHASES.map((p) => `- ${p.label} (${p.id})`),
          "",
          "CHECKLIST TYPES:",
          ...CHECKLIST_TYPES.map((c) => `- ${c.label}`),
        ].join("\n");
        break;
      }
    }
  }

  if (!executionAction && !reportAction && isExecutionQuery(input.userMessage)) {
    if (!activeWorkspace) {
      executionAction = [
        "Engineering Site Execution Intelligence (ESEIE)",
        "AI Site Engineering Assistant — NOT a Project Management System.",
        "",
        "Start with: Start site execution [project name]",
        `Phases: ${EXECUTION_PHASES.map((p) => p.label).join(", ")}`,
        `Checklists: ${CHECKLIST_TYPES.map((c) => c.label).join(", ")}`,
      ].join("\n");
    } else {
      const checklist = generateChecklist("daily-site", activeWorkspace.phase, input.disciplineName);
      executionAction = formatChecklist(checklist);
    }
  }

  const active =
    isExecutionQuery(input.userMessage) ||
    activeWorkspace !== null ||
    executionAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.offlineMobileModeId) extensionNotes.push(`Offline Mobile: ${extensionHooks.offlineMobileModeId}`);
  if (extensionHooks.voiceCommandsId) extensionNotes.push(`Voice: ${extensionHooks.voiceCommandsId}`);
  if (extensionHooks.imageBasedSiteReviewId) extensionNotes.push(`Image Review: ${extensionHooks.imageBasedSiteReviewId}`);
  if (extensionHooks.videoAssistanceId) extensionNotes.push(`Video: ${extensionHooks.videoAssistanceId}`);
  if (extensionHooks.droneIntegrationId) extensionNotes.push(`Drone: ${extensionHooks.droneIntegrationId}`);
  if (extensionHooks.bimSiteReviewId) extensionNotes.push(`BIM Site: ${extensionHooks.bimSiteReviewId}`);
  if (extensionHooks.pmisSiteModuleId) extensionNotes.push(`PMIS Site: ${extensionHooks.pmisSiteModuleId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Site Execution Intelligence Engine (ESEIE)",
    "========================================",
    "AI Site Engineering Assistant — NOT a Project Management System.",
    "",
    executionAction ? `SITE EXECUTION:\n${executionAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace
      ? `\nActive workspace: ${activeWorkspace.title} (${activeWorkspace.phase})`
      : "",
    "",
    "ESEIE COMMANDS:",
    "- Start site execution [project] | Daily site checklist | Inspection/Material/Safety checklist",
    "- Construction guidance [activity] | Execution sequence [work] | Inspection guidance",
    "- Quality guidance | Safety guidance | Commissioning guidance [system]",
    "- Daily progress report | Inspection report | Quality report | Safety observation",
    "- Troubleshoot [issue] | Non-conformance [description] | Verify material [name]",
    "- Search execution [keyword] | Search safety [keyword] | Search inspection [keyword]",
    `- Checklist templates: ${CHECKLIST_TEMPLATE_COUNT}`,
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    executionAction,
    reportAction,
    searchResultCount,
    promptAugmentation,
    summaryText: [
      active ? "eseie-active" : "",
      activeWorkspace?.title ?? "",
      searchResultCount > 0 ? `${searchResultCount} results` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatExecutionForPrompt = (result: ExecutionEngineResult): string =>
  result.promptAugmentation;

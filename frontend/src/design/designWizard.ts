import {
  captureStepInput,
  formatStepGuidance,
  getActiveDesignContext,
  startDesign,
  suggestMissingInputs,
} from "./designEngine";
import {
  addFavoriteDesign,
  getActiveDesignSession,
  getFavoriteDesigns,
  getRecentDesigns,
  getSavedDesigns,
  pauseDesignSession,
  saveDesignSession,
} from "./designHistory";
import {
  formatLibrarySummary,
  resolveCategoryFromText,
} from "./designTemplates";
import { DESIGN_TEMPLATES } from "./designTemplates";
import {
  buildDesignReport,
  buildProgressSummary,
  formatDesignReportForPrompt,
} from "./designReports";
import {
  formatValidationForPrompt,
  getDesignLimitations,
  validateDesignSession,
} from "./designValidator";
import type {
  DesignExtensionHooks,
  DesignSearchQuery,
  DesignSearchResult,
  DesignWizardInput,
  DesignWizardResult,
} from "./types";

let extensionHooks: DesignExtensionHooks = {};

export const setDesignExtensionHooks = (
  hooks: DesignExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getDesignExtensionHooks = (): DesignExtensionHooks =>
  extensionHooks;

const searchDesignTemplates = (
  query: DesignSearchQuery
): DesignSearchResult => {
  let templates = [...DESIGN_TEMPLATES];

  if (query.disciplineId) {
    templates = templates.filter((t) => t.disciplineId === query.disciplineId);
  }
  if (query.category) {
    templates = templates.filter((t) => t.category === query.category);
  }
  if (query.standard) {
    const std = query.standard.toLowerCase();
    templates = templates.filter((t) =>
      t.suggestedStandards.some((s) => s.toLowerCase().includes(std))
    );
  }
  if (query.keyword) {
    const kw = query.keyword.toLowerCase();
    templates = templates.filter(
      (t) =>
        t.title.toLowerCase().includes(kw) ||
        t.description.toLowerCase().includes(kw)
    );
  }

  const limit = query.limit ?? 10;
  return { query, templates: templates.slice(0, limit), totalCount: templates.length };
};

const formatSearchResults = (result: DesignSearchResult): string => {
  if (result.templates.length === 0) {
    return "No design templates found. Try 'Start structural design' or 'List designs'.";
  }
  return [
    `Found ${result.totalCount} design template(s):`,
    ...result.templates.map(
      (t, i) => `${i + 1}. ${t.title} — ${t.description.slice(0, 80)}`
    ),
    "",
    'Say "Start [design type] design" to begin the Design Wizard.',
  ].join("\n");
};

const isDesignWizardQuery = (message: string): boolean =>
  /\b(design\s+wizard|start\s+design|design\s+step|next\s+design\s+step|design\s+report|design\s+summary|list\s+designs?|search\s+designs?|structural\s+design|foundation\s+design|bridge\s+design|save\s+design|favorite\s+design)\b/i.test(
    message
  );

const parseDesignCommand = (
  message: string
): { action: string; payload: string } | null => {
  const startMatch = message.match(
    /^(?:start|begin|open)\s+(?:design\s+)?(?:wizard\s+)?(?:for\s+)?(.+?)(?:\s+design)?$/i
  );
  if (startMatch) return { action: "start", payload: startMatch[1].trim() };

  const nextMatch = message.match(
    /^(?:next\s+design\s+step|design\s+step|advance\s+design)$/i
  );
  if (nextMatch) return { action: "next", payload: "" };

  const reportMatch = message.match(/^design\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const listMatch = message.match(/^(?:list|show)\s+designs?(?:\s+for\s+(.+))?$/i);
  if (listMatch) return { action: "list", payload: listMatch[1]?.trim() ?? "" };

  const searchMatch = message.match(
    /^(?:search)\s+designs?\s*(?:for\s+)?(.+)?$/i
  );
  if (searchMatch) return { action: "search", payload: searchMatch[1]?.trim() ?? "" };

  const saveMatch = message.match(/^save\s+design$/i);
  if (saveMatch) return { action: "save", payload: "" };

  const favoriteMatch = message.match(/^favorite\s+design$/i);
  if (favoriteMatch) return { action: "favorite", payload: "" };

  const pauseMatch = message.match(/^pause\s+design$/i);
  if (pauseMatch) return { action: "pause", payload: "" };

  return null;
};

/** Run Engineering Design Wizard (EDW) for a user turn. */
export const runDesignWizard = (
  input: DesignWizardInput
): DesignWizardResult => {
  let designAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;
  let validation = null;

  const command = parseDesignCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "start": {
        const result = startDesign(
          command.payload,
          input.disciplineId,
          input.disciplineName,
          input.conversationId
        );
        if (result) {
          const { session, template } = result;
          const currentStep = template.steps[0];
          designAction = [
            `Design Wizard started: ${session.title}`,
            formatStepGuidance(currentStep, template, 1),
          ].join("\n\n");
        } else {
          designAction = `Design template not found for: ${command.payload}. Try 'List designs'.`;
        }
        break;
      }
      case "next": {
        const ctx = getActiveDesignContext();
        if (ctx) {
          captureStepInput(ctx.session.id, input.userMessage, ctx.template);
          const updated = getActiveDesignContext();
          if (updated?.currentStep) {
            designAction = formatStepGuidance(
              updated.currentStep,
              updated.template,
              updated.session.currentStepIndex + 1
            );
          } else {
            designAction = "Design complete! Say 'Design report' to generate documentation.";
          }
        } else {
          designAction = "No active design. Say 'Start [type] design' to begin.";
        }
        break;
      }
      case "report": {
        const ctx = getActiveDesignContext();
        if (ctx) {
          const report = buildDesignReport(ctx.session, ctx.template);
          reportAction = formatDesignReportForPrompt(report);
        } else {
          reportAction = "No active design session. Start a design first.";
        }
        break;
      }
      case "list": {
        const result = command.payload
          ? searchDesignTemplates({ keyword: command.payload, disciplineId: input.disciplineId })
          : searchDesignTemplates({ disciplineId: input.disciplineId ?? undefined, limit: 10 });
        searchResultCount = result.totalCount;
        designAction = formatSearchResults(result);
        break;
      }
      case "search": {
        const result = searchDesignTemplates({
          keyword: command.payload || undefined,
          disciplineId: input.disciplineId,
          category: resolveCategoryFromText(command.payload) ?? undefined,
          standard: /\b(irc|is\s*\d|iec|asme|api)\b/i.test(command.payload)
            ? command.payload
            : undefined,
        });
        searchResultCount = result.totalCount;
        designAction = formatSearchResults(result);
        break;
      }
      case "save": {
        const session = getActiveDesignSession();
        designAction = session && saveDesignSession(session.id)
          ? `Design saved: ${session.title}`
          : "No active design to save.";
        break;
      }
      case "favorite": {
        const session = getActiveDesignSession();
        designAction = session && addFavoriteDesign(session.id)
          ? `Added to favorites: ${session.title}`
          : "No active design to favorite.";
        break;
      }
      case "pause": {
        const session = getActiveDesignSession();
        designAction = session && pauseDesignSession(session.id)
          ? `Design paused: ${session.title}`
          : "No active design to pause.";
        break;
      }
    }
  }

  const activeContext = getActiveDesignContext();
  if (activeContext && !designAction && !reportAction) {
    const { session, template, currentStep } = activeContext;
    validation = validateDesignSession(session, template);
    const missing = currentStep
      ? suggestMissingInputs(currentStep, input.userMessage)
      : [];

    designAction = [
      buildProgressSummary(session, template),
      currentStep
        ? formatStepGuidance(currentStep, template, session.currentStepIndex + 1)
        : "",
      missing.length > 0
        ? `\nMISSING INPUTS (please provide):\n${missing.map((m) => `- ${m}`).join("\n")}`
        : "",
      "",
      formatValidationForPrompt(validation),
      "",
      "DESIGN LIMITATIONS:",
      ...getDesignLimitations(template, session).map((l) => `- ${l}`),
    ]
      .filter(Boolean)
      .join("\n");
  } else if (!designAction && isDesignWizardQuery(input.userMessage)) {
    const result = searchDesignTemplates({
      keyword: input.userMessage,
      disciplineId: input.disciplineId,
    });
    searchResultCount = result.totalCount;
    designAction = formatSearchResults(result);
  }

  const active =
    isDesignWizardQuery(input.userMessage) ||
    activeContext !== null ||
    designAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.cadIntegrationId) extensionNotes.push(`CAD: ${extensionHooks.cadIntegrationId}`);
  if (extensionHooks.bimIntegrationId) extensionNotes.push(`BIM: ${extensionHooks.bimIntegrationId}`);
  if (extensionHooks.femSoftwareId) extensionNotes.push(`FEM: ${extensionHooks.femSoftwareId}`);
  if (extensionHooks.simulationSoftwareId) extensionNotes.push(`Simulation: ${extensionHooks.simulationSoftwareId}`);
  if (extensionHooks.pmisDesignModuleId) extensionNotes.push(`PMIS: ${extensionHooks.pmisDesignModuleId}`);

  const recentCount = getRecentDesigns().length;
  const savedCount = getSavedDesigns().length;
  const favoriteCount = getFavoriteDesigns().length;

  const promptAugmentation = [
    "========================================",
    "Engineering Design Wizard (EDW)",
    "========================================",
    "AI-assisted design guidance — NOT design software. Guides structured engineering design processes.",
    "",
    formatLibrarySummary(),
    `History: ${recentCount} recent | ${savedCount} saved | ${favoriteCount} favorites`,
    "",
    designAction ? `DESIGN:\n${designAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    "",
    "12-STEP DESIGN PROCESS:",
    "Problem Definition → Design Criteria → Inputs → Standards → Assumptions → Methodology → Calculations → Alternatives → Risks → Validation → Recommendations → Summary",
    "",
    "EDW COMMANDS:",
    "- Start [design type] design | Next design step | Design report",
    "- List designs | Search designs [keyword] | Save design | Favorite design",
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    active ? "edw-active" : "",
    activeContext ? activeContext.session.title : "",
    activeContext
      ? `${activeContext.session.completedStepIds.length}/12`
      : "",
    searchResultCount > 0 ? `${searchResultCount} templates` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    activeSession: activeContext?.session ?? null,
    currentStep: activeContext?.currentStep ?? null,
    designAction,
    reportAction,
    validation,
    searchResultCount,
    promptAugmentation,
    summaryText,
  };
};

export const formatDesignWizardForPrompt = (
  result: DesignWizardResult
): string => result.promptAugmentation;

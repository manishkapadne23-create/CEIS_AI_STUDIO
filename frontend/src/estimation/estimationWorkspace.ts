import {
  addBoqItem,
  exportBoqAsCsv,
  formatBoqForPrompt,
  formatBoqReviewForPrompt,
  reviewBoq,
} from "./boqEngine";
import { analyzeCosts, applyCostBreakdown, formatCostBreakdownForPrompt } from "./costAnalyzer";
import {
  createEstimate,
  ESTIMATE_TEMPLATES,
  ESTIMATION_TYPES,
  formatLibrarySummary,
  getActiveEstimate,
  resolveEstimationType,
  searchEstimateTemplates,
  updateEstimate,
} from "./estimationEngine";
import {
  buildCostSummaryOnly,
  buildEstimateReport,
  formatEstimateReportForPrompt,
} from "./estimateReports";
import {
  convertUnit,
  formatUnitsForPrompt,
  parseConversionCommand,
} from "./quantityEngine";
import {
  formatValueEngineeringForPrompt,
  generateValueEngineeringSuggestions,
} from "./valueEngineering";
import type {
  EstimationEngineInput,
  EstimationEngineResult,
  EstimationExtensionHooks,
} from "./types";

let extensionHooks: EstimationExtensionHooks = {};

export const setEstimationExtensionHooks = (
  hooks: EstimationExtensionHooks
): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getEstimationExtensionHooks = (): EstimationExtensionHooks =>
  extensionHooks;

const isEstimationQuery = (message: string): boolean =>
  /\b(estimate|estimation|boq|bill\s+of\s+quantities|cost\s+summary|value\s+engineering|quantity|add\s+item|create\s+estimate|review\s+boq|export\s+boq|convert\s+\d)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const createMatch = message.match(
    /^(?:create|start|new)\s+(?:estimate|boq)\s*(?:for\s+)?(.+)?$/i
  );
  if (createMatch) return { action: "create", payload: createMatch[1]?.trim() ?? "" };

  const addMatch = message.match(
    /^add\s+item\s+(.+?)\s+quantity\s+([\d.]+)(?:\s+(\w+))?(?:\s+(?:rate|@)\s*([\d.]+))?$/i
  );
  if (addMatch) {
    return {
      action: "add-item",
      payload: `${addMatch[1]}|${addMatch[2]}|${addMatch[3] ?? ""}|${addMatch[4] ?? ""}`,
    };
  }

  const reviewMatch = message.match(/^review\s+boq$/i);
  if (reviewMatch) return { action: "review-boq", payload: "" };

  const exportMatch = message.match(/^export\s+boq$/i);
  if (exportMatch) return { action: "export-boq", payload: "" };

  const costMatch = message.match(/^cost\s+summary$/i);
  if (costMatch) return { action: "cost-summary", payload: "" };

  const reportMatch = message.match(/^estimate\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const veMatch = message.match(/^value\s+engineering$/i);
  if (veMatch) return { action: "value-engineering", payload: "" };

  const listMatch = message.match(/^(?:list|show)\s+estimates?$/i);
  if (listMatch) return { action: "list", payload: "" };

  const searchMatch = message.match(
    /^(?:search)\s+estimates?\s*(?:for\s+)?(.+)?$/i
  );
  if (searchMatch) return { action: "search", payload: searchMatch[1]?.trim() ?? "" };

  const convertMatch = parseConversionCommand(message);
  if (convertMatch) {
    return {
      action: "convert",
      payload: `${convertMatch.value}|${convertMatch.fromUnit}|${convertMatch.toUnit}`,
    };
  }

  return null;
};

const findTemplateForCreate = (
  payload: string,
  disciplineId: string | null
) => {
  const typeId = resolveEstimationType(payload);
  let templates = disciplineId
    ? ESTIMATE_TEMPLATES.filter((t) => t.disciplineId === disciplineId)
    : ESTIMATE_TEMPLATES;

  if (typeId) {
    templates = templates.filter((t) => t.estimationType === typeId);
  } else if (payload) {
    templates = searchEstimateTemplates(payload, disciplineId);
  }

  return templates[0] ?? ESTIMATE_TEMPLATES.find(
    (t) => t.disciplineId === (disciplineId ?? "civil-engineering")
  ) ?? ESTIMATE_TEMPLATES[0];
};

/** Run Engineering Estimation & Cost Intelligence Engine for a user turn. */
export const runEstimationEngine = (
  input: EstimationEngineInput
): EstimationEngineResult => {
  let estimationAction: string | null = null;
  let reportAction: string | null = null;
  let boqAction: string | null = null;
  let costBreakdown = null;
  let searchResultCount = 0;

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "create": {
        const template = findTemplateForCreate(command.payload, input.disciplineId);
        const estimate = createEstimate(
          template,
          input.conversationId,
          input.disciplineId,
          input.disciplineName,
          input.projectName
        );
        estimationAction = [
          `Estimate created: ${estimate.title}`,
          `Suggested work items (${estimate.items.length}):`,
          ...estimate.items.map((i) => `- ${i.itemNo}. ${i.description} (${i.unit})`),
          "",
          "Add quantities with: Add item [description] quantity [number] [unit] rate [amount]",
        ].join("\n");
        break;
      }
      case "add-item": {
        const [desc, qty, unit, rate] = command.payload.split("|");
        let estimate = getActiveEstimate();
        if (!estimate) {
          estimationAction = "No active estimate. Create one with 'Create estimate'.";
          break;
        }
        estimate = addBoqItem(
          estimate,
          desc,
          parseFloat(qty),
          unit || undefined,
          rate ? parseFloat(rate) : null
        );
        estimate = applyCostBreakdown(estimate);
        updateEstimate(estimate);
        estimationAction = `Added: ${desc} — ${qty} ${unit || "nos"}\n${formatBoqForPrompt(estimate)}`;
        costBreakdown = analyzeCosts(estimate);
        break;
      }
      case "review-boq": {
        const estimate = getActiveEstimate();
        if (!estimate) {
          boqAction = "No active estimate. Create one first.";
          break;
        }
        const review = reviewBoq(estimate, input.disciplineId);
        boqAction = formatBoqReviewForPrompt(review);
        break;
      }
      case "export-boq": {
        const estimate = getActiveEstimate();
        if (!estimate) {
          boqAction = "No active BOQ to export.";
          break;
        }
        const csv = exportBoqAsCsv(estimate);
        boqAction = `BOQ exported (${estimate.items.length} items):\n${csv.slice(0, 800)}${csv.length > 800 ? "\n[...]" : ""}`;
        break;
      }
      case "cost-summary": {
        const estimate = getActiveEstimate();
        if (!estimate) {
          estimationAction = "No active estimate.";
          break;
        }
        costBreakdown = analyzeCosts(estimate);
        estimationAction = formatCostBreakdownForPrompt(costBreakdown);
        break;
      }
      case "report": {
        const estimate = getActiveEstimate();
        if (!estimate) {
          reportAction = "No active estimate. Create one first.";
          break;
        }
        const breakdown = analyzeCosts(estimate);
        const report = buildEstimateReport(estimate, breakdown);
        reportAction = formatEstimateReportForPrompt(report);
        break;
      }
      case "value-engineering": {
        const estimate = getActiveEstimate();
        if (!estimate) {
          estimationAction = "No active estimate for value engineering.";
          break;
        }
        const suggestions = generateValueEngineeringSuggestions(estimate);
        estimationAction = formatValueEngineeringForPrompt(suggestions);
        break;
      }
      case "list": {
        const templates = searchEstimateTemplates("", input.disciplineId);
        searchResultCount = templates.length;
        estimationAction = [
          `Estimation types: ${ESTIMATION_TYPES.map((t) => t.name).join(", ")}`,
          "",
          `Templates for discipline (${templates.length}):`,
          ...templates.slice(0, 8).map((t) => `- ${t.title}`),
          "",
          'Say "Create BOQ estimate" or "Create preliminary estimate" to start.',
        ].join("\n");
        break;
      }
      case "search": {
        const templates = searchEstimateTemplates(command.payload, input.disciplineId);
        searchResultCount = templates.length;
        estimationAction =
          templates.length > 0
            ? templates.map((t, i) => `${i + 1}. ${t.title}`).join("\n")
            : "No templates found.";
        break;
      }
      case "convert": {
        const [val, from, to] = command.payload.split("|");
        const result = convertUnit(parseFloat(val), from, to);
        estimationAction = result
          ? `${result.fromValue} ${result.fromUnit} = ${result.toValue} ${result.toUnit}`
          : `Cannot convert ${from} to ${to}`;
        break;
      }
    }
  }

  const activeEstimate = getActiveEstimate();
  if (activeEstimate && !estimationAction && !reportAction && !boqAction) {
    costBreakdown = analyzeCosts(activeEstimate);
    estimationAction = [
      `Active estimate: ${activeEstimate.title}`,
      formatBoqForPrompt(activeEstimate),
      "",
      buildCostSummaryOnly(activeEstimate),
    ].join("\n\n");
  } else if (!estimationAction && isEstimationQuery(input.userMessage)) {
    const templates = searchEstimateTemplates(input.userMessage, input.disciplineId);
    searchResultCount = templates.length;
    if (templates.length > 0) {
      estimationAction = templates
        .slice(0, 5)
        .map((t) => `- ${t.title}`)
        .join("\n");
    }
  }

  const active =
    isEstimationQuery(input.userMessage) ||
    activeEstimate !== null ||
    estimationAction !== null ||
    reportAction !== null ||
    boqAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.ssrIntegrationId) extensionNotes.push(`SSR: ${extensionHooks.ssrIntegrationId}`);
  if (extensionHooks.sorIntegrationId) extensionNotes.push(`SOR: ${extensionHooks.sorIntegrationId}`);
  if (extensionHooks.governmentScheduleId) extensionNotes.push(`Gov schedule: ${extensionHooks.governmentScheduleId}`);
  if (extensionHooks.vendorPriceDatabaseId) extensionNotes.push(`Vendor DB: ${extensionHooks.vendorPriceDatabaseId}`);
  if (extensionHooks.liveMaterialPricesEnabled) extensionNotes.push("Live material prices enabled");
  if (extensionHooks.pmisCostModuleId) extensionNotes.push(`PMIS: ${extensionHooks.pmisCostModuleId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Estimation & Cost Intelligence (ECIE)",
    "========================================",
    "AI-assisted estimation — NOT an ERP or accounting system.",
    "",
    formatLibrarySummary(),
    "",
    estimationAction ? `ESTIMATION:\n${estimationAction}` : "",
    boqAction ? `BOQ:\n${boqAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    "",
    formatUnitsForPrompt(),
    "",
    "ECIE COMMANDS:",
    "- Create estimate [type] | Add item [desc] quantity [n] [unit] rate [amount]",
    "- Review BOQ | Export BOQ | Cost summary | Estimate report",
    "- Value engineering | List estimates | Convert 100 sqft to sqm",
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const summaryText = [
    active ? "ecie-active" : "",
    activeEstimate ? activeEstimate.title : "",
    activeEstimate ? `${activeEstimate.items.length} items` : "",
    costBreakdown ? `₹${costBreakdown.totalCost}` : "",
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    active,
    activeEstimate,
    estimationAction,
    reportAction,
    boqAction,
    costBreakdown,
    searchResultCount,
    promptAugmentation,
    summaryText,
  };
};

export const formatEstimationForPrompt = (
  result: EstimationEngineResult
): string => result.promptAugmentation;

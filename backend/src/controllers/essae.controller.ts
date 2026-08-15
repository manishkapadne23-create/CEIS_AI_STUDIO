import { Request } from "express";

import {
  compareScenarios,
  createDefaultScenario,
  createScenario,
  createSimulationWorkspace,
  duplicateScenario,
  exportScenarioResults,
  getEssaeConfig,
  getScenario,
  getScenarioComparison,
  getSimulationWorkspace,
  listScenarioComparisons,
  listSimulationWorkspaces,
  runAdHocSimulation,
  runScenarioSimulation,
  analyzeSimulationFromChat,
  updateScenario,
  updateSimulationWorkspace,
} from "../services/essae.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendError, sendSuccess } from "../utils/apiResponse.js";

const param = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

export const getEssaeConfigController = asyncHandler(async (_req, res) => {
  sendSuccess(res, getEssaeConfig());
});

export const listWorkspacesController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const workspaces = await listSimulationWorkspaces(req.user.id);
  sendSuccess(res, workspaces);
});

export const createWorkspaceController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  if (!req.body.name) {
    return sendError(res, 400, "ESSAE_INVALID_INPUT", "name is required.");
  }
  const workspace = await createSimulationWorkspace(req.user.id, req.body);
  sendSuccess(res, workspace);
});

export const getWorkspaceController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const workspace = await getSimulationWorkspace(req.user.id, param(req.params.workspaceId));
  if (!workspace) {
    return sendError(res, 404, "ESSAE_NOT_FOUND", "Workspace not found.");
  }
  sendSuccess(res, workspace);
});

export const updateWorkspaceController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  await updateSimulationWorkspace(req.user.id, param(req.params.workspaceId), req.body);
  const workspace = await getSimulationWorkspace(req.user.id, param(req.params.workspaceId));
  sendSuccess(res, workspace);
});

export const createScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  if (!req.body.scenario) {
    return sendError(res, 400, "ESSAE_INVALID_INPUT", "scenario is required.");
  }
  const scenario = await createScenario(
    req.user.id,
    param(req.params.workspaceId),
    req.body.scenario
  );
  sendSuccess(res, scenario);
});

export const getScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const scenario = await getScenario(req.user.id, param(req.params.scenarioId));
  if (!scenario) {
    return sendError(res, 404, "ESSAE_NOT_FOUND", "Scenario not found.");
  }
  sendSuccess(res, scenario);
});

export const updateScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const scenario = await updateScenario(req.user.id, param(req.params.scenarioId), req.body);
  sendSuccess(res, scenario);
});

export const duplicateScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const scenario = await duplicateScenario(req.user.id, param(req.params.scenarioId));
  sendSuccess(res, scenario);
});

export const runScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const result = await runScenarioSimulation(
    req.user.id,
    param(req.params.scenarioId),
    req.body.saveResults !== false
  );
  sendSuccess(res, result, {
    meta: {
      valid: result.validation.valid,
      recommendedOptionId: result.results.recommendedOptionId,
    },
  });
});

export const runAdHocSimulationController = asyncHandler(async (req: Request, res) => {
  if (!req.body.scenario) {
    return sendError(res, 400, "ESSAE_INVALID_INPUT", "scenario is required.");
  }
  const result = runAdHocSimulation(req.body.scenario);
  sendSuccess(res, result, {
    meta: {
      valid: result.validation.valid,
      recommendedOptionId: result.results.recommendedOptionId,
    },
  });
});

export const compareScenariosController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  if (!req.body.scenarioIds?.length || !req.body.title) {
    return sendError(
      res,
      400,
      "ESSAE_INVALID_INPUT",
      "title and scenarioIds are required."
    );
  }
  const comparison = await compareScenarios(req.user.id, req.body);
  sendSuccess(res, comparison);
});

export const listComparisonsController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const comparisons = await listScenarioComparisons(
    req.user.id,
    typeof req.query.workspaceId === "string" ? req.query.workspaceId : undefined
  );
  sendSuccess(res, comparisons);
});

export const exportScenarioController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const exportPayload = await exportScenarioResults(req.user.id, param(req.params.scenarioId));
  sendSuccess(res, exportPayload);
});

export const getDefaultScenarioController = asyncHandler(async (req: Request, res) => {
  const scenarioType = req.query.scenarioType;
  if (typeof scenarioType !== "string") {
    return sendError(res, 400, "ESSAE_INVALID_INPUT", "scenarioType query is required.");
  }
  const scenario = createDefaultScenario(
    scenarioType as Parameters<typeof createDefaultScenario>[0],
    typeof req.query.disciplineName === "string" ? req.query.disciplineName : null
  );
  sendSuccess(res, { scenario });
});

export const analyzeAssistantController = asyncHandler(async (req: Request, res) => {
  if (!req.body.message || typeof req.body.message !== "string") {
    return sendError(res, 400, "ESSAE_INVALID_INPUT", "message is required.");
  }

  const result = analyzeSimulationFromChat({
    message: req.body.message,
    disciplineId: req.body.disciplineId ?? null,
    disciplineName: req.body.disciplineName ?? null,
    projectContext: req.body.projectContext ?? null,
    primaryIntent: req.body.primaryIntent ?? null,
    moduleId: req.body.moduleId ?? null,
  });

  sendSuccess(res, result, {
    meta: {
      enabled: result.enabled,
      valid: result.validation.valid,
      recommendedOptionId: result.results.recommendedOptionId,
    },
  });
});

export const getComparisonController = asyncHandler(async (req: Request, res) => {
  if (!req.user?.id) {
    return sendError(res, 401, "UNAUTHORIZED", "Authentication required.");
  }
  const comparison = await getScenarioComparison(req.user.id, param(req.params.comparisonId));
  if (!comparison) {
    return sendError(res, 404, "ESSAE_NOT_FOUND", "Comparison not found.");
  }
  sendSuccess(res, comparison);
});

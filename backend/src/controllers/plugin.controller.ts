import { Request, Response } from "express";

import { recordMetric } from "../monitoring/metrics.js";
import {
  disablePlugin,
  enablePlugin,
  getPluginHealth,
  installPlugin,
  listPlugins,
  removePlugin,
  rollbackPlugin,
} from "../services/plugin.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { ValidationError } from "../utils/AppError.js";
import type { ServerPlugin } from "../plugins/types.js";

const asParam = (value: string | string[]): string =>
  Array.isArray(value) ? value[0] : value;

export const getPlugins = asyncHandler(async (_req: Request, res: Response) => {
  sendSuccess(res, listPlugins());
});

export const getPluginsHealth = asyncHandler(async (_req: Request, res: Response) => {
  const start = Date.now();
  const health = await getPluginHealth();
  recordMetric("plugins.health", Date.now() - start);
  sendSuccess(res, { plugins: health });
});

export const installPluginHandler = asyncHandler(async (req: Request, res: Response) => {
  const plugin = req.body as ServerPlugin;
  if (!plugin?.manifest?.id) {
    throw new ValidationError("Plugin manifest with id is required.");
  }

  const record = await installPlugin(plugin);
  sendSuccess(res, { plugin: record }, { status: 201 });
});

export const enablePluginHandler = asyncHandler(async (req: Request, res: Response) => {
  const pluginId = asParam(req.params.pluginId);
  const record = await enablePlugin(pluginId);
  sendSuccess(res, { plugin: record });
});

export const disablePluginHandler = asyncHandler(async (req: Request, res: Response) => {
  const pluginId = asParam(req.params.pluginId);
  const record = await disablePlugin(pluginId);
  sendSuccess(res, { plugin: record });
});

export const removePluginHandler = asyncHandler(async (req: Request, res: Response) => {
  const pluginId = asParam(req.params.pluginId);
  await removePlugin(pluginId);
  sendSuccess(res, { removed: pluginId });
});

export const rollbackPluginHandler = asyncHandler(async (req: Request, res: Response) => {
  const pluginId = asParam(req.params.pluginId);
  const record = await rollbackPlugin(pluginId);
  sendSuccess(res, { plugin: record });
});

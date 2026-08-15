import { auditLogger } from "../infrastructure/logger/index.js";
import type { PluginHealth, ServerPlugin } from "./types.js";

export interface SandboxResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export const runInPluginSandbox = async <T>(
  pluginId: string,
  operation: string,
  fn: () => T | Promise<T>
): Promise<SandboxResult<T>> => {
  try {
    const data = await fn();
    return { success: true, data };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : `Plugin ${pluginId} failed during ${operation}`;

    auditLogger.info("plugin.sandbox_failure", {
      pluginId,
      operation,
      error: message,
    });

    return { success: false, error: message };
  }
};

export const activateServerPluginSafely = async (
  plugin: ServerPlugin
): Promise<SandboxResult<void>> =>
  runInPluginSandbox(plugin.manifest.id, "activate", async () => {
    if (plugin.activate) {
      await plugin.activate();
    }
  });

export const deactivateServerPluginSafely = async (
  plugin: ServerPlugin
): Promise<SandboxResult<void>> =>
  runInPluginSandbox(plugin.manifest.id, "deactivate", async () => {
    if (plugin.deactivate) {
      await plugin.deactivate();
    }
  });

export const checkServerPluginHealthSafely = async (
  plugin: ServerPlugin
): Promise<PluginHealth> => {
  const result = await runInPluginSandbox(plugin.manifest.id, "healthCheck", async () => {
    if (plugin.onHealthCheck) {
      return plugin.onHealthCheck();
    }
    return {
      id: plugin.manifest.id,
      status: "healthy" as const,
      lastCheckedAt: Date.now(),
    };
  });

  if (result.success && result.data) {
    return result.data;
  }

  return {
    id: plugin.manifest.id,
    status: "failed",
    message: result.error,
    lastCheckedAt: Date.now(),
  };
};

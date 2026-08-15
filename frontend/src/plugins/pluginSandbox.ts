import type { PluginContext, PluginHealth, SarathiPlugin } from "./types";

export interface SandboxResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

const defaultHealth = (pluginId: string): PluginHealth => ({
  id: pluginId,
  status: "healthy",
  lastCheckedAt: Date.now(),
});

export const runInSandbox = async <T>(
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
    console.warn(`[PluginSandbox] ${pluginId}.${operation}:`, message);
    return { success: false, error: message };
  }
};

export const activatePluginSafely = async (
  plugin: SarathiPlugin,
  context: PluginContext
): Promise<SandboxResult<void>> =>
  runInSandbox(plugin.manifest.id, "activate", async () => {
    if (plugin.activate) {
      await plugin.activate(context);
    }
  });

export const deactivatePluginSafely = async (
  plugin: SarathiPlugin
): Promise<SandboxResult<void>> =>
  runInSandbox(plugin.manifest.id, "deactivate", async () => {
    if (plugin.deactivate) {
      await plugin.deactivate();
    }
  });

export const checkPluginHealthSafely = async (
  plugin: SarathiPlugin
): Promise<PluginHealth> => {
  const result = await runInSandbox(plugin.manifest.id, "healthCheck", async () => {
    if (plugin.onHealthCheck) {
      return plugin.onHealthCheck();
    }
    return defaultHealth(plugin.manifest.id);
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

export const getPromptAugmentationSafely = async (
  plugin: SarathiPlugin,
  input: {
    userMessage: string;
    disciplineId: string | null;
    moduleId: string | null;
  }
): Promise<string | null> => {
  const result = await runInSandbox(plugin.manifest.id, "getPromptAugmentation", () => {
    if (!plugin.getPromptAugmentation) {
      return null;
    }
    return plugin.getPromptAugmentation(input);
  });

  return result.success ? (result.data ?? null) : null;
};

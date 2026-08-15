import {
  disablePlugin,
  enablePlugin,
  installPlugin,
  listInstalledPlugins,
  loadPlugin,
  removePlugin,
  rollbackPlugin,
  updatePlugin,
} from "./pluginLoader";
import { initializePluginStoreCatalog, listStoreCatalog } from "./pluginMarketplace";
import {
  discoverPlugins,
  getInstallRecord,
  listInstallRecords,
  listPluginDefinitions,
} from "./pluginRegistry";
import { checkPluginHealthSafely, getPromptAugmentationSafely } from "./pluginSandbox";
import { registerBuiltInPlugins } from "./builtInPlugins";
import type { PluginHealth, PluginLifecycleAction, SarathiPlugin } from "./types";

let initialized = false;

const auditLog = (action: PluginLifecycleAction, pluginId: string, detail?: string): void => {
  console.info(`[PluginManager] ${action}`, { pluginId, detail, at: new Date().toISOString() });
};

export const initializePluginManager = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  initializePluginStoreCatalog();
  registerBuiltInPlugins();

  const builtIns = listPluginDefinitions();
  for (const plugin of builtIns) {
    await installPlugin(plugin);
    await enablePlugin(plugin.manifest.id);
  }

  initialized = true;
};

export const getPluginManagerHealth = async (): Promise<PluginHealth[]> => {
  const enabled = listInstallRecords().filter(
    (record) => record.manifest.status === "enabled"
  );

  const results: PluginHealth[] = [];
  for (const record of enabled) {
    const plugin = listPluginDefinitions().find(
      (item) => item.manifest.id === record.manifest.id
    );
    if (!plugin) {
      results.push({
        id: record.manifest.id,
        status: "failed",
        message: "Plugin definition missing",
        lastCheckedAt: Date.now(),
      });
      continue;
    }
    results.push(await checkPluginHealthSafely(plugin));
  }

  return results;
};

export const collectPluginPromptAugmentations = async (input: {
  userMessage: string;
  disciplineId: string | null;
  moduleId: string | null;
}): Promise<string[]> => {
  const augmentations: string[] = [];

  for (const record of listInstallRecords()) {
    if (record.manifest.status !== "enabled") {
      continue;
    }

    const plugin = listPluginDefinitions().find(
      (item) => item.manifest.id === record.manifest.id
    );
    if (!plugin?.getPromptAugmentation) {
      continue;
    }

    const augmentation = await getPromptAugmentationSafely(plugin, input);
    if (augmentation?.trim()) {
      augmentations.push(augmentation);
    }
  }

  return augmentations;
};

export const getAggregatedContributions = () => {
  const contributions = listInstalledPlugins().map((record) => record.contributions);
  return {
    pages: contributions.flatMap((item) => item.pages),
    widgets: contributions.flatMap((item) => item.widgets),
    aiPrompts: contributions.flatMap((item) => item.aiPrompts),
    calculators: contributions.flatMap((item) => item.calculators),
    templates: contributions.flatMap((item) => item.templates),
    reports: contributions.flatMap((item) => item.reports),
    menuItems: contributions.flatMap((item) => item.menuItems),
    actions: contributions.flatMap((item) => item.actions),
    commands: contributions.flatMap((item) => item.commands),
  };
};

export const pluginManager = {
  initialize: initializePluginManager,
  discover: discoverPlugins,
  listDefinitions: listPluginDefinitions,
  listInstalled: listInstalledPlugins,
  listStore: listStoreCatalog,
  getInstallRecord,
  load: loadPlugin,
  install: async (plugin: SarathiPlugin) => {
    auditLog("install", plugin.manifest.id);
    await installPlugin(plugin);
  },
  enable: async (pluginId: string) => {
    auditLog("enable", pluginId);
    await enablePlugin(pluginId);
  },
  disable: async (pluginId: string) => {
    auditLog("disable", pluginId);
    await disablePlugin(pluginId);
  },
  update: async (plugin: SarathiPlugin) => {
    auditLog("update", plugin.manifest.id);
    await updatePlugin(plugin);
  },
  rollback: async (pluginId: string) => {
    auditLog("rollback", pluginId);
    await rollbackPlugin(pluginId);
  },
  remove: async (pluginId: string) => {
    auditLog("remove", pluginId);
    await removePlugin(pluginId);
  },
  health: getPluginManagerHealth,
  contributions: getAggregatedContributions,
  promptAugmentations: collectPluginPromptAugmentations,
};

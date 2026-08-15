import { createPluginAPI } from "./pluginAPI";
import {
  createInstallRecord,
  getInstallRecord,
  getPluginDefinition,
  listInstallRecords,
  registerPluginDefinition,
  removeInstallRecord,
  setInstallRecord,
} from "./pluginRegistry";
import {
  activatePluginSafely,
  deactivatePluginSafely,
} from "./pluginSandbox";
import type {
  PluginContext,
  PluginManifest,
  SarathiPlugin,
} from "./types";

const validateDependencies = (manifest: PluginManifest): void => {
  for (const dependencyId of manifest.dependencies) {
    const dependency = getInstallRecord(dependencyId);
    if (!dependency || dependency.manifest.status !== "enabled") {
      throw new Error(
        `Plugin ${manifest.id} requires enabled dependency: ${dependencyId}`
      );
    }
  }
};

const validateSignature = (plugin: SarathiPlugin): void => {
  if (!plugin.manifest.signature) {
    return;
  }

  const expected = plugin.manifest.signature;
  const payload = [
    plugin.manifest.id,
    plugin.manifest.version,
    plugin.manifest.author,
  ].join(":");

  let checksum = 0;
  for (let i = 0; i < payload.length; i++) {
    checksum = (checksum + payload.charCodeAt(i) * (i + 1)) % 1_000_000;
  }

  if (expected !== `sarathi-${checksum}`) {
    throw new Error(`Invalid plugin signature for ${plugin.manifest.id}`);
  }
};

export const loadPlugin = (plugin: SarathiPlugin): void => {
  registerPluginDefinition(plugin);
};

export const installPlugin = async (plugin: SarathiPlugin): Promise<void> => {
  validateSignature(plugin);
  loadPlugin(plugin);

  const record = createInstallRecord(plugin.manifest, plugin.contributions);
  record.manifest.status = "installed";
  setInstallRecord(record);
};

export const enablePlugin = async (
  pluginId: string,
  context?: Partial<PluginContext>
): Promise<void> => {
  const plugin = getPluginDefinition(pluginId);
  const record = getInstallRecord(pluginId);

  if (!plugin || !record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }

  validateDependencies(plugin.manifest);

  const activationContext: PluginContext = {
    pluginId,
    permissions: plugin.manifest.permissions,
    disciplineId: context?.disciplineId ?? null,
    moduleId: context?.moduleId ?? null,
  };

  const activation = await activatePluginSafely(plugin, activationContext);
  if (!activation.success) {
    setInstallRecord({
      ...record,
      manifest: { ...record.manifest, status: "error" },
    });
    throw new Error(activation.error ?? `Failed to enable ${pluginId}`);
  }

  const api = createPluginAPI(pluginId);
  plugin.contributions?.pages?.forEach((page) => api.registerPage(page));
  plugin.contributions?.widgets?.forEach((widget) => api.registerWidget(widget));
  plugin.contributions?.aiPrompts?.forEach((prompt) => api.registerAIPrompt(prompt));
  plugin.contributions?.calculators?.forEach((calculator) =>
    api.registerCalculator(calculator)
  );
  plugin.contributions?.templates?.forEach((template) => api.registerTemplate(template));
  plugin.contributions?.reports?.forEach((report) => api.registerReport(report));
  plugin.contributions?.menuItems?.forEach((item) => api.registerMenuItem(item));
  plugin.contributions?.actions?.forEach((action) => api.registerAction(action));
  plugin.contributions?.commands?.forEach((command) => api.registerCommand(command));

  setInstallRecord({
    ...record,
    manifest: { ...record.manifest, status: "enabled" },
    enabledAt: Date.now(),
  });
};

export const disablePlugin = async (pluginId: string): Promise<void> => {
  const plugin = getPluginDefinition(pluginId);
  const record = getInstallRecord(pluginId);

  if (!plugin || !record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }

  await deactivatePluginSafely(plugin);
  setInstallRecord({
    ...record,
    manifest: { ...record.manifest, status: "disabled" },
    enabledAt: null,
  });
};

export const updatePlugin = async (
  plugin: SarathiPlugin
): Promise<void> => {
  const record = getInstallRecord(plugin.manifest.id);
  if (!record) {
    return installPlugin(plugin);
  }

  const wasEnabled = record.manifest.status === "enabled";
  if (wasEnabled) {
    await disablePlugin(plugin.manifest.id);
  }

  setInstallRecord({
    ...createInstallRecord(plugin.manifest, plugin.contributions),
    installedAt: record.installedAt,
    previousVersions: [...record.previousVersions, record.manifest.version],
    manifest: { ...plugin.manifest, status: "installed" },
  });

  loadPlugin(plugin);

  if (wasEnabled) {
    await enablePlugin(plugin.manifest.id);
  }
};

export const rollbackPlugin = async (pluginId: string): Promise<void> => {
  const record = getInstallRecord(pluginId);
  if (!record || record.previousVersions.length === 0) {
    throw new Error(`No previous version available for ${pluginId}`);
  }

  const previousVersion = record.previousVersions[record.previousVersions.length - 1];
  setInstallRecord({
    ...record,
    manifest: { ...record.manifest, version: previousVersion, status: "disabled" },
    previousVersions: record.previousVersions.slice(0, -1),
    enabledAt: null,
  });
};

export const removePlugin = async (pluginId: string): Promise<void> => {
  const record = getInstallRecord(pluginId);
  if (!record) {
    return;
  }

  if (record.manifest.status === "enabled") {
    await disablePlugin(pluginId);
  }

  removeInstallRecord(pluginId);
};

export const listInstalledPlugins = () => listInstallRecords();

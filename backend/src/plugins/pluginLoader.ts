import { auditLogger } from "../infrastructure/logger/index.js";
import {
  getServerInstallRecord,
  getServerPlugin,
  listServerInstallRecords,
  listServerPlugins,
  registerServerPlugin,
  removeServerInstallRecord,
  setServerInstallRecord,
} from "./pluginRegistry.js";
import {
  activateServerPluginSafely,
  checkServerPluginHealthSafely,
  deactivateServerPluginSafely,
} from "./pluginSandbox.js";
import type { PluginInstallRecord, PluginManifest, ServerPlugin } from "./types.js";

const validateSignature = (manifest: PluginManifest): void => {
  if (!manifest.signature) {
    return;
  }

  const payload = [manifest.id, manifest.version, manifest.author].join(":");
  let checksum = 0;
  for (let i = 0; i < payload.length; i++) {
    checksum = (checksum + payload.charCodeAt(i) * (i + 1)) % 1_000_000;
  }

  if (manifest.signature !== `sarathi-${checksum}`) {
    throw new Error(`Invalid plugin signature for ${manifest.id}`);
  }
};

const validateDependencies = (manifest: PluginManifest): void => {
  for (const dependencyId of manifest.dependencies) {
    const dependency = getServerInstallRecord(dependencyId);
    if (!dependency || dependency.manifest.status !== "enabled") {
      throw new Error(`Plugin ${manifest.id} requires enabled dependency: ${dependencyId}`);
    }
  }
};

export const loadServerPlugin = (plugin: ServerPlugin): void => {
  registerServerPlugin(plugin);
};

export const installServerPlugin = async (plugin: ServerPlugin): Promise<void> => {
  validateSignature(plugin.manifest);
  loadServerPlugin(plugin);

  const record: PluginInstallRecord = {
    manifest: { ...plugin.manifest, status: "installed" },
    installedAt: Date.now(),
    enabledAt: null,
    previousVersions: [],
  };

  setServerInstallRecord(record);
  auditLogger.info("plugin.install", { pluginId: plugin.manifest.id });
};

export const enableServerPlugin = async (pluginId: string): Promise<void> => {
  const plugin = getServerPlugin(pluginId);
  const record = getServerInstallRecord(pluginId);

  if (!plugin || !record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }

  validateDependencies(plugin.manifest);

  const activation = await activateServerPluginSafely(plugin);
  if (!activation.success) {
    setServerInstallRecord({
      ...record,
      manifest: { ...record.manifest, status: "error" },
    });
    throw new Error(activation.error ?? `Failed to enable ${pluginId}`);
  }

  setServerInstallRecord({
    ...record,
    manifest: { ...record.manifest, status: "enabled" },
    enabledAt: Date.now(),
  });

  auditLogger.info("plugin.enable", { pluginId });
};

export const disableServerPlugin = async (pluginId: string): Promise<void> => {
  const plugin = getServerPlugin(pluginId);
  const record = getServerInstallRecord(pluginId);

  if (!plugin || !record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }

  await deactivateServerPluginSafely(plugin);
  setServerInstallRecord({
    ...record,
    manifest: { ...record.manifest, status: "disabled" },
    enabledAt: null,
  });

  auditLogger.info("plugin.disable", { pluginId });
};

export const updateServerPlugin = async (plugin: ServerPlugin): Promise<void> => {
  const record = getServerInstallRecord(plugin.manifest.id);
  if (!record) {
    return installServerPlugin(plugin);
  }

  const wasEnabled = record.manifest.status === "enabled";
  if (wasEnabled) {
    await disableServerPlugin(plugin.manifest.id);
  }

  setServerInstallRecord({
    manifest: { ...plugin.manifest, status: "installed" },
    installedAt: record.installedAt,
    enabledAt: null,
    previousVersions: [...record.previousVersions, record.manifest.version],
  });

  loadServerPlugin(plugin);

  if (wasEnabled) {
    await enableServerPlugin(plugin.manifest.id);
  }

  auditLogger.info("plugin.update", { pluginId: plugin.manifest.id });
};

export const rollbackServerPlugin = async (pluginId: string): Promise<void> => {
  const record = getServerInstallRecord(pluginId);
  if (!record || record.previousVersions.length === 0) {
    throw new Error(`No previous version available for ${pluginId}`);
  }

  const previousVersion = record.previousVersions[record.previousVersions.length - 1];
  setServerInstallRecord({
    ...record,
    manifest: { ...record.manifest, version: previousVersion, status: "disabled" },
    previousVersions: record.previousVersions.slice(0, -1),
    enabledAt: null,
  });

  auditLogger.info("plugin.rollback", { pluginId, version: previousVersion });
};

export const removeServerPlugin = async (pluginId: string): Promise<void> => {
  const record = getServerInstallRecord(pluginId);
  if (!record) {
    return;
  }

  if (record.manifest.status === "enabled") {
    await disableServerPlugin(pluginId);
  }

  removeServerInstallRecord(pluginId);
  auditLogger.info("plugin.remove", { pluginId });
};

export const getServerPluginHealth = async () => {
  const enabled = listServerInstallRecords().filter(
    (record) => record.manifest.status === "enabled"
  );

  const results = [];
  for (const record of enabled) {
    const plugin = listServerPlugins().find((item) => item.manifest.id === record.manifest.id);
    if (!plugin) {
      results.push({
        id: record.manifest.id,
        status: "failed" as const,
        message: "Plugin definition missing",
        lastCheckedAt: Date.now(),
      });
      continue;
    }
    results.push(await checkServerPluginHealthSafely(plugin));
  }

  return results;
};

import type { PluginInstallRecord, PluginManifest, ServerPlugin } from "./types.js";

const plugins = new Map<string, ServerPlugin>();
const installRecords = new Map<string, PluginInstallRecord>();

export const registerServerPlugin = (plugin: ServerPlugin): void => {
  plugins.set(plugin.manifest.id, plugin);
};

export const getServerPlugin = (id: string): ServerPlugin | undefined =>
  plugins.get(id);

export const listServerPlugins = (): ServerPlugin[] => Array.from(plugins.values());

export const discoverServerPlugins = (filter?: {
  type?: PluginManifest["type"];
  status?: PluginManifest["status"];
}): ServerPlugin[] =>
  listServerPlugins().filter((plugin) => {
    if (filter?.type && plugin.manifest.type !== filter.type) {
      return false;
    }
    if (filter?.status && plugin.manifest.status !== filter.status) {
      return false;
    }
    return true;
  });

export const setServerInstallRecord = (record: PluginInstallRecord): void => {
  installRecords.set(record.manifest.id, record);
};

export const getServerInstallRecord = (id: string): PluginInstallRecord | undefined =>
  installRecords.get(id);

export const listServerInstallRecords = (): PluginInstallRecord[] =>
  Array.from(installRecords.values());

export const removeServerInstallRecord = (id: string): boolean =>
  installRecords.delete(id);

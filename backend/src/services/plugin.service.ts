import { pluginManager } from "../plugins/index.js";
import type { ServerPlugin } from "../plugins/types.js";

export const initializePlugins = async (): Promise<void> => {
  await pluginManager.initialize();
};

export const listPlugins = () => ({
  installed: pluginManager.installed(),
  available: pluginManager.list(),
  store: pluginManager.store(),
});

export const getPluginHealth = async () => pluginManager.health();

export const installPlugin = async (plugin: ServerPlugin) => {
  await pluginManager.install(plugin);
  return pluginManager.installed().find((item) => item.manifest.id === plugin.manifest.id);
};

export const enablePlugin = async (pluginId: string) => {
  await pluginManager.enable(pluginId);
  return pluginManager.installed().find((item) => item.manifest.id === pluginId);
};

export const disablePlugin = async (pluginId: string) => {
  await pluginManager.disable(pluginId);
  return pluginManager.installed().find((item) => item.manifest.id === pluginId);
};

export const removePlugin = async (pluginId: string) => {
  await pluginManager.remove(pluginId);
};

export const rollbackPlugin = async (pluginId: string) => {
  await pluginManager.rollback(pluginId);
  return pluginManager.installed().find((item) => item.manifest.id === pluginId);
};

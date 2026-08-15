import { auditLogger } from "../infrastructure/logger/index.js";
import { getServerInstallRecord, setServerInstallRecord } from "./pluginRegistry.js";
import type { PluginPermission } from "./types.js";

export interface ServerPluginRouteRegistration {
  method: "get" | "post" | "put" | "delete";
  path: string;
  handlerId: string;
}

export interface ServerPluginCommandRegistration {
  id: string;
  name: string;
  handlerId: string;
}

export interface ServerPluginContributions {
  routes: ServerPluginRouteRegistration[];
  commands: ServerPluginCommandRegistration[];
}

const contributions = new Map<string, ServerPluginContributions>();

const emptyContributions = (): ServerPluginContributions => ({
  routes: [],
  commands: [],
});

const assertPermission = (pluginId: string, permission: PluginPermission): void => {
  const record = getServerInstallRecord(pluginId);
  if (!record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }
  if (!record.manifest.permissions.includes(permission)) {
    throw new Error(`Plugin ${pluginId} lacks permission: ${permission}`);
  }
};

export const createServerPluginAPI = (pluginId: string) => ({
  registerRoute: (route: ServerPluginRouteRegistration): void => {
    assertPermission(pluginId, "write");
    const current = contributions.get(pluginId) ?? emptyContributions();
    contributions.set(pluginId, {
      ...current,
      routes: [...current.routes, route],
    });
    auditLogger.info("plugin.api.register_route", { pluginId, path: route.path });
  },
  registerCommand: (command: ServerPluginCommandRegistration): void => {
    assertPermission(pluginId, "write");
    const current = contributions.get(pluginId) ?? emptyContributions();
    contributions.set(pluginId, {
      ...current,
      commands: [...current.commands, command],
    });
    auditLogger.info("plugin.api.register_command", { pluginId, commandId: command.id });
  },
});

export const getServerPluginContributions = (
  pluginId: string
): ServerPluginContributions => contributions.get(pluginId) ?? emptyContributions();

export const listAllServerPluginContributions = (): Record<string, ServerPluginContributions> =>
  Object.fromEntries(contributions.entries());

export const markPluginEnabledInRecord = (pluginId: string): void => {
  const record = getServerInstallRecord(pluginId);
  if (!record) {
    return;
  }
  setServerInstallRecord({
    ...record,
    manifest: { ...record.manifest, status: "enabled" },
    enabledAt: Date.now(),
  });
};

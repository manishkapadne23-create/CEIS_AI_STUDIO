import {
  getInstallRecord,
  mergeContributions,
  setInstallRecord,
} from "./pluginRegistry";
import type {
  PluginActionRegistration,
  PluginAIPromptRegistration,
  PluginCalculatorRegistration,
  PluginCommandRegistration,
  PluginContributions,
  PluginMenuItemRegistration,
  PluginPageRegistration,
  PluginPermission,
  PluginReportRegistration,
  PluginTemplateRegistration,
  PluginWidgetRegistration,
} from "./types";

const assertPermission = (
  pluginId: string,
  required: PluginPermission
): void => {
  const record = getInstallRecord(pluginId);
  if (!record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }
  if (!record.manifest.permissions.includes(required)) {
    throw new Error(`Plugin ${pluginId} lacks permission: ${required}`);
  }
};

const updateContributions = (
  pluginId: string,
  updater: (current: PluginContributions) => PluginContributions
): void => {
  const record = getInstallRecord(pluginId);
  if (!record) {
    throw new Error(`Plugin ${pluginId} is not installed.`);
  }
  setInstallRecord({
    ...record,
    contributions: updater(record.contributions),
  });
};

export const createPluginAPI = (pluginId: string) => ({
  registerPage: (page: PluginPageRegistration): void => {
    assertPermission(pluginId, "read");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { pages: [page] })
    );
  },
  registerWidget: (widget: PluginWidgetRegistration): void => {
    assertPermission(pluginId, "read");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { widgets: [widget] })
    );
  },
  registerAIPrompt: (prompt: PluginAIPromptRegistration): void => {
    assertPermission(pluginId, "ai-access");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { aiPrompts: [prompt] })
    );
  },
  registerCalculator: (calculator: PluginCalculatorRegistration): void => {
    assertPermission(pluginId, "knowledge-access");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { calculators: [calculator] })
    );
  },
  registerTemplate: (template: PluginTemplateRegistration): void => {
    assertPermission(pluginId, "reports");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { templates: [template] })
    );
  },
  registerReport: (report: PluginReportRegistration): void => {
    assertPermission(pluginId, "reports");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { reports: [report] })
    );
  },
  registerMenuItem: (item: PluginMenuItemRegistration): void => {
    assertPermission(pluginId, "read");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { menuItems: [item] })
    );
  },
  registerAction: (action: PluginActionRegistration): void => {
    assertPermission(pluginId, "write");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { actions: [action] })
    );
  },
  registerCommand: (command: PluginCommandRegistration): void => {
    assertPermission(pluginId, "write");
    updateContributions(pluginId, (current) =>
      mergeContributions(current, { commands: [command] })
    );
  },
});

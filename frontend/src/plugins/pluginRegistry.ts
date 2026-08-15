import type {
  PluginContributions,
  PluginInstallRecord,
  PluginManifest,
  SarathiPlugin,
} from "./types";

const emptyContributions = (): PluginContributions => ({
  pages: [],
  widgets: [],
  aiPrompts: [],
  calculators: [],
  templates: [],
  reports: [],
  menuItems: [],
  actions: [],
  commands: [],
});

const plugins = new Map<string, SarathiPlugin>();
const installRecords = new Map<string, PluginInstallRecord>();

export const registerPluginDefinition = (plugin: SarathiPlugin): void => {
  plugins.set(plugin.manifest.id, plugin);
};

export const getPluginDefinition = (id: string): SarathiPlugin | undefined =>
  plugins.get(id);

export const listPluginDefinitions = (): SarathiPlugin[] =>
  Array.from(plugins.values());

export const discoverPlugins = (filter?: {
  type?: PluginManifest["type"];
  disciplineId?: string;
  moduleId?: string;
  status?: PluginManifest["status"];
}): SarathiPlugin[] =>
  listPluginDefinitions().filter((plugin) => {
    if (filter?.type && plugin.manifest.type !== filter.type) {
      return false;
    }
    if (
      filter?.disciplineId &&
      plugin.manifest.supportedDisciplines.length > 0 &&
      !plugin.manifest.supportedDisciplines.includes(filter.disciplineId)
    ) {
      return false;
    }
    if (
      filter?.moduleId &&
      plugin.manifest.supportedModules.length > 0 &&
      !plugin.manifest.supportedModules.includes(filter.moduleId)
    ) {
      return false;
    }
    if (filter?.status && plugin.manifest.status !== filter.status) {
      return false;
    }
    return true;
  });

export const setInstallRecord = (record: PluginInstallRecord): void => {
  installRecords.set(record.manifest.id, record);
};

export const getInstallRecord = (id: string): PluginInstallRecord | undefined =>
  installRecords.get(id);

export const listInstallRecords = (): PluginInstallRecord[] =>
  Array.from(installRecords.values());

export const removeInstallRecord = (id: string): boolean =>
  installRecords.delete(id);

export const mergeContributions = (
  base: PluginContributions,
  additions: Partial<PluginContributions>
): PluginContributions => ({
  pages: [...base.pages, ...(additions.pages ?? [])],
  widgets: [...base.widgets, ...(additions.widgets ?? [])],
  aiPrompts: [...base.aiPrompts, ...(additions.aiPrompts ?? [])],
  calculators: [...base.calculators, ...(additions.calculators ?? [])],
  templates: [...base.templates, ...(additions.templates ?? [])],
  reports: [...base.reports, ...(additions.reports ?? [])],
  menuItems: [...base.menuItems, ...(additions.menuItems ?? [])],
  actions: [...base.actions, ...(additions.actions ?? [])],
  commands: [...base.commands, ...(additions.commands ?? [])],
});

export const createInstallRecord = (
  manifest: PluginManifest,
  contributions: Partial<PluginContributions> = {}
): PluginInstallRecord => ({
  manifest,
  installedAt: Date.now(),
  enabledAt: null,
  previousVersions: [],
  contributions: mergeContributions(emptyContributions(), contributions),
});

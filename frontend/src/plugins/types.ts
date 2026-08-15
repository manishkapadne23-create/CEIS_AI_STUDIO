export type PluginType =
  | "engineering"
  | "calculator"
  | "standards"
  | "document"
  | "workflow"
  | "professional-tool"
  | "learning"
  | "ai-provider"
  | "notification"
  | "marketplace"
  | "institution"
  | "pmis";

export type PluginPermission =
  | "read"
  | "write"
  | "ai-access"
  | "knowledge-access"
  | "documents"
  | "projects"
  | "reports"
  | "settings";

export type PluginStatus =
  | "installed"
  | "enabled"
  | "disabled"
  | "error"
  | "updating";

export type PluginStoreCategory =
  | "official"
  | "third-party"
  | "premium"
  | "institution"
  | "enterprise"
  | "community"
  | "government"
  | "university";

export type PluginLifecycleAction =
  | "install"
  | "enable"
  | "disable"
  | "update"
  | "rollback"
  | "remove";

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  type: PluginType;
  supportedDisciplines: string[];
  supportedModules: string[];
  dependencies: string[];
  permissions: PluginPermission[];
  status: PluginStatus;
  signature?: string;
  storeCategory?: PluginStoreCategory;
  minPlatformVersion?: string;
}

export interface PluginPageRegistration {
  id: string;
  title: string;
  route: string;
  disciplineIds?: string[];
}

export interface PluginWidgetRegistration {
  id: string;
  title: string;
  moduleId?: string;
  renderHint?: string;
}

export interface PluginAIPromptRegistration {
  id: string;
  title: string;
  promptTemplate: string;
  disciplines?: string[];
}

export interface PluginCalculatorRegistration {
  id: string;
  calculatorId: string;
  title: string;
}

export interface PluginTemplateRegistration {
  id: string;
  title: string;
  category: string;
}

export interface PluginReportRegistration {
  id: string;
  title: string;
  format: "pdf" | "docx" | "xlsx" | "html";
}

export interface PluginMenuItemRegistration {
  id: string;
  label: string;
  path: string;
  icon?: string;
}

export interface PluginActionRegistration {
  id: string;
  label: string;
  command: string;
}

export interface PluginCommandRegistration {
  id: string;
  name: string;
  description: string;
  handlerId: string;
}

export interface PluginContributions {
  pages: PluginPageRegistration[];
  widgets: PluginWidgetRegistration[];
  aiPrompts: PluginAIPromptRegistration[];
  calculators: PluginCalculatorRegistration[];
  templates: PluginTemplateRegistration[];
  reports: PluginReportRegistration[];
  menuItems: PluginMenuItemRegistration[];
  actions: PluginActionRegistration[];
  commands: PluginCommandRegistration[];
}

export interface PluginHealth {
  id: string;
  status: "healthy" | "degraded" | "failed";
  message?: string;
  lastCheckedAt: number;
}

export interface PluginContext {
  pluginId: string;
  permissions: PluginPermission[];
  disciplineId: string | null;
  moduleId: string | null;
}

export interface SarathiPlugin {
  manifest: PluginManifest;
  contributions?: Partial<PluginContributions>;
  activate?: (context: PluginContext) => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
  onHealthCheck?: () => Promise<PluginHealth>;
  getPromptAugmentation?: (input: {
    userMessage: string;
    disciplineId: string | null;
    moduleId: string | null;
  }) => string | null;
}

export interface PluginInstallRecord {
  manifest: PluginManifest;
  installedAt: number;
  enabledAt: number | null;
  previousVersions: string[];
  contributions: PluginContributions;
}

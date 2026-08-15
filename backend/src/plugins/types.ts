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
}

export interface PluginHealth {
  id: string;
  status: "healthy" | "degraded" | "failed";
  message?: string;
  lastCheckedAt: number;
}

export interface ServerPlugin {
  manifest: PluginManifest;
  activate?: () => void | Promise<void>;
  deactivate?: () => void | Promise<void>;
  onHealthCheck?: () => Promise<PluginHealth>;
}

export interface PluginInstallRecord {
  manifest: PluginManifest;
  installedAt: number;
  enabledAt: number | null;
  previousVersions: string[];
}

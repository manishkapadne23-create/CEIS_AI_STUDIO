import { auditLogger } from "../infrastructure/logger/index.js";
import {
  disableServerPlugin,
  enableServerPlugin,
  getServerPluginHealth,
  installServerPlugin,
  loadServerPlugin,
  removeServerPlugin,
  rollbackServerPlugin,
  updateServerPlugin,
} from "./pluginLoader.js";
import { initializePluginStore, listStoreCatalog } from "./pluginMarketplace.js";
import {
  discoverServerPlugins,
  listServerInstallRecords,
  listServerPlugins,
} from "./pluginRegistry.js";
import type { ServerPlugin } from "./types.js";

let initialized = false;

const checksumSignature = (id: string, version: string, author: string): string => {
  const payload = [id, version, author].join(":");
  let checksum = 0;
  for (let i = 0; i < payload.length; i++) {
    checksum = (checksum + payload.charCodeAt(i) * (i + 1)) % 1_000_000;
  }
  return `sarathi-${checksum}`;
};

const registerBuiltInServerPlugins = (): void => {
  const builtIns: ServerPlugin[] = [
    {
      manifest: {
        id: "sarathi-core-engineering",
        name: "Sarathi Core Engineering",
        version: "1.0.0",
        author: "CEIS",
        description: "Core engineering intelligence plugin.",
        type: "engineering",
        supportedDisciplines: ["*"],
        supportedModules: ["*"],
        dependencies: [],
        permissions: ["read", "ai-access", "knowledge-access"],
        status: "installed",
        signature: checksumSignature("sarathi-core-engineering", "1.0.0", "CEIS"),
        storeCategory: "official",
      },
    },
    {
      manifest: {
        id: "sarathi-ai-provider-bridge",
        name: "AI Provider Bridge",
        version: "1.0.0",
        author: "CEIS",
        description: "Connects Sarathi AI provider layer as an installable plugin.",
        type: "ai-provider",
        supportedDisciplines: ["*"],
        supportedModules: ["ai"],
        dependencies: ["sarathi-core-engineering"],
        permissions: ["ai-access", "settings"],
        status: "installed",
        signature: checksumSignature("sarathi-ai-provider-bridge", "1.0.0", "CEIS"),
        storeCategory: "official",
      },
    },
  ];

  builtIns.forEach(loadServerPlugin);
};

export const initializePluginManager = async (): Promise<void> => {
  if (initialized) {
    return;
  }

  initializePluginStore();
  registerBuiltInServerPlugins();

  for (const plugin of listServerPlugins()) {
    await installServerPlugin(plugin);
    await enableServerPlugin(plugin.manifest.id);
  }

  initialized = true;
  auditLogger.info("plugin.manager_initialized", {
    pluginCount: listServerInstallRecords().length,
  });
};

export const pluginManager = {
  initialize: initializePluginManager,
  discover: discoverServerPlugins,
  list: listServerPlugins,
  installed: listServerInstallRecords,
  store: listStoreCatalog,
  install: installServerPlugin,
  enable: enableServerPlugin,
  disable: disableServerPlugin,
  update: updateServerPlugin,
  rollback: rollbackServerPlugin,
  remove: removeServerPlugin,
  health: getServerPluginHealth,
};

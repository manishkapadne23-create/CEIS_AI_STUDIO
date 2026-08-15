import { describe, expect, it } from "vitest";

import {
  disableServerPlugin,
  enableServerPlugin,
  installServerPlugin,
  loadServerPlugin,
} from "../../src/plugins/pluginLoader.js";
import { initializePluginStore, listStoreCatalog } from "../../src/plugins/pluginMarketplace.js";
import { initializePluginManager } from "../../src/plugins/pluginManager.js";
import { listServerInstallRecords } from "../../src/plugins/pluginRegistry.js";
import type { ServerPlugin } from "../../src/plugins/types.js";

const testPlugin = (): ServerPlugin => ({
  manifest: {
    id: "test-plugin",
    name: "Test Plugin",
    version: "1.0.0",
    author: "CEIS",
    description: "Test plugin for framework validation.",
    type: "engineering",
    supportedDisciplines: ["civil"],
    supportedModules: ["assistant"],
    dependencies: [],
    permissions: ["read"],
    status: "installed",
    signature: "sarathi-12345",
  },
});

describe("Plugin Framework", () => {
  it("initializes built-in plugins and store catalog", async () => {
    initializePluginStore();
    await initializePluginManager();

    const installed = listServerInstallRecords();
    expect(installed.length).toBeGreaterThanOrEqual(2);
    expect(listStoreCatalog().length).toBeGreaterThanOrEqual(2);
  });

  it("supports install, enable, disable lifecycle", async () => {
    const plugin = testPlugin();

    let checksum = 0;
    const payload = [plugin.manifest.id, plugin.manifest.version, plugin.manifest.author].join(":");
    for (let i = 0; i < payload.length; i++) {
      checksum = (checksum + payload.charCodeAt(i) * (i + 1)) % 1_000_000;
    }
    plugin.manifest.signature = `sarathi-${checksum}`;

    loadServerPlugin(plugin);
    await installServerPlugin(plugin);
    await enableServerPlugin(plugin.manifest.id);

    const enabled = listServerInstallRecords().find(
      (record) => record.manifest.id === plugin.manifest.id
    );
    expect(enabled?.manifest.status).toBe("enabled");

    await disableServerPlugin(plugin.manifest.id);
    const disabled = listServerInstallRecords().find(
      (record) => record.manifest.id === plugin.manifest.id
    );
    expect(disabled?.manifest.status).toBe("disabled");
  });
});

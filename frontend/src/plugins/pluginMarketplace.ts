import type { PluginManifest, PluginStoreCategory } from "./types";

export interface PluginStoreListing {
  manifest: PluginManifest;
  storeCategory: PluginStoreCategory;
  pricing: "free" | "premium" | "enterprise";
  verified: boolean;
  downloadUrl?: string;
}

const storeCatalog: PluginStoreListing[] = [];

export const registerStoreListing = (listing: PluginStoreListing): void => {
  const existingIndex = storeCatalog.findIndex(
    (item) => item.manifest.id === listing.manifest.id
  );

  if (existingIndex >= 0) {
    storeCatalog[existingIndex] = listing;
    return;
  }

  storeCatalog.push(listing);
};

export const listStoreCatalog = (filter?: {
  category?: PluginStoreCategory;
  type?: PluginManifest["type"];
}): PluginStoreListing[] =>
  storeCatalog.filter((listing) => {
    if (filter?.category && listing.storeCategory !== filter.category) {
      return false;
    }
    if (filter?.type && listing.manifest.type !== filter.type) {
      return false;
    }
    return true;
  });

export const getStoreListing = (pluginId: string): PluginStoreListing | undefined =>
  storeCatalog.find((listing) => listing.manifest.id === pluginId);

export const initializePluginStoreCatalog = (): void => {
  if (storeCatalog.length > 0) {
    return;
  }

  const officialPlugins: PluginStoreListing[] = [
    {
      manifest: {
        id: "sarathi-core-engineering",
        name: "Sarathi Core Engineering",
        version: "1.0.0",
        author: "CEIS",
        description: "Core engineering intelligence capabilities for Sarathi AI.",
        type: "engineering",
        supportedDisciplines: ["*"],
        supportedModules: ["*"],
        dependencies: [],
        permissions: ["read", "ai-access", "knowledge-access"],
        status: "enabled",
        storeCategory: "official",
      },
      storeCategory: "official",
      pricing: "free",
      verified: true,
    },
    {
      manifest: {
        id: "sarathi-standards-pack",
        name: "Standards & Codes Pack",
        version: "1.0.0",
        author: "CEIS",
        description: "Standards metadata and code reference extensions.",
        type: "standards",
        supportedDisciplines: ["civil", "structural", "mechanical", "electrical"],
        supportedModules: ["standards", "compliance"],
        dependencies: ["sarathi-core-engineering"],
        permissions: ["read", "knowledge-access"],
        status: "installed",
        storeCategory: "official",
      },
      storeCategory: "official",
      pricing: "free",
      verified: true,
    },
  ];

  const enterprisePlugins: PluginStoreListing[] = [
    {
      manifest: {
        id: "sarathi-pmis-bridge",
        name: "PMIS Bridge (Preview)",
        version: "0.1.0",
        author: "CEIS",
        description: "Future-ready PMIS integration module for enterprise deployments.",
        type: "pmis",
        supportedDisciplines: ["*"],
        supportedModules: ["projects", "site-execution", "contracts"],
        dependencies: ["sarathi-core-engineering"],
        permissions: ["read", "write", "projects", "reports"],
        status: "installed",
        storeCategory: "enterprise",
      },
      storeCategory: "enterprise",
      pricing: "enterprise",
      verified: true,
    },
  ];

  [...officialPlugins, ...enterprisePlugins].forEach(registerStoreListing);
};

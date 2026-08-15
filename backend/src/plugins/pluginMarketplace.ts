import type { PluginManifest, PluginStoreCategory } from "./types.js";

export interface PluginStoreListing {
  manifest: PluginManifest;
  storeCategory: PluginStoreCategory;
  pricing: "free" | "premium" | "enterprise";
  verified: boolean;
}

const storeCatalog: PluginStoreListing[] = [];

export const registerStoreListing = (listing: PluginStoreListing): void => {
  const index = storeCatalog.findIndex((item) => item.manifest.id === listing.manifest.id);
  if (index >= 0) {
    storeCatalog[index] = listing;
    return;
  }
  storeCatalog.push(listing);
};

export const listStoreCatalog = (category?: PluginStoreCategory): PluginStoreListing[] =>
  category
    ? storeCatalog.filter((listing) => listing.storeCategory === category)
    : [...storeCatalog];

export const initializePluginStore = (): void => {
  if (storeCatalog.length > 0) {
    return;
  }

  registerStoreListing({
    manifest: {
      id: "sarathi-core-engineering",
      name: "Sarathi Core Engineering",
      version: "1.0.0",
      author: "CEIS",
      description: "Core engineering intelligence capabilities.",
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
  });

  registerStoreListing({
    manifest: {
      id: "sarathi-pmis-bridge",
      name: "PMIS Bridge (Preview)",
      version: "0.1.0",
      author: "CEIS",
      description: "Enterprise PMIS integration module.",
      type: "pmis",
      supportedDisciplines: ["*"],
      supportedModules: ["projects"],
      dependencies: ["sarathi-core-engineering"],
      permissions: ["read", "write", "projects", "reports"],
      status: "installed",
      storeCategory: "enterprise",
    },
    storeCategory: "enterprise",
    pricing: "enterprise",
    verified: true,
  });
};

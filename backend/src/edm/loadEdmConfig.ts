import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

let cachedModuleConfig: EdmModuleConfig | null = null;
let cachedDocumentTypes: EdmDocumentTypeConfig[] | null = null;
let cachedProjectTypes: EdmProjectTypeConfig[] | null = null;
let cachedSearchFacets: EdmSearchFacetConfig[] | null = null;

const readConfig = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export interface EdmModuleConfig {
  version: string;
  schema: string;
  module: {
    id: string;
    name: string;
    shortName: string;
    description: string;
    apiBasePath: string;
  };
  embedding: {
    defaultModelId: string;
    defaultDimensions: number;
    statusOnRegister: string;
    storage: string;
    futureProvider: string;
  };
  search: {
    defaultLimit: number;
    maxLimit: number;
    keywordStrategy: string;
    semanticStrategy: string;
  };
}

export interface EdmDocumentTypeConfig {
  id: string;
  label: string;
  mimeTypes: string[];
  extensions: string[];
  active: boolean;
}

export interface EdmProjectTypeConfig {
  id: string;
  label: string;
}

export interface EdmSearchFacetConfig {
  id: string;
  label: string;
  queryParam: string;
  type: string;
  configRef?: string;
  reference?: string;
}

export const loadEdmModuleConfig = (): EdmModuleConfig => {
  if (!cachedModuleConfig) {
    cachedModuleConfig = readConfig<EdmModuleConfig>("module.json");
  }
  return cachedModuleConfig;
};

export const loadEdmDocumentTypes = (): EdmDocumentTypeConfig[] => {
  if (!cachedDocumentTypes) {
    cachedDocumentTypes = readConfig<{ documentTypes: EdmDocumentTypeConfig[] }>(
      "documentTypes.json"
    ).documentTypes.filter((entry) => entry.active);
  }
  return cachedDocumentTypes;
};

export const loadEdmProjectTypes = (): EdmProjectTypeConfig[] =>
  readConfig<{ projectTypes: EdmProjectTypeConfig[] }>("projectTypes.json")
    .projectTypes;

export const loadEdmSearchFacets = (): EdmSearchFacetConfig[] =>
  readConfig<{ facets: EdmSearchFacetConfig[] }>("searchFacets.json").facets;

export const getEdmDocumentTypeById = (id: string) =>
  loadEdmDocumentTypes().find((entry) => entry.id === id);

export const getEdmPublicConfig = () => {
  const moduleConfig = loadEdmModuleConfig();
  return {
    module: moduleConfig.module,
    embedding: moduleConfig.embedding,
    search: moduleConfig.search,
    documentTypes: loadEdmDocumentTypes(),
    projectTypes: loadEdmProjectTypes(),
    searchFacets: loadEdmSearchFacets(),
  };
};

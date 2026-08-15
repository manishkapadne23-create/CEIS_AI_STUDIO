const PROTECTED_KNOWLEDGE_PREFIXES = [
  "/api/knowledge-base",
  "/api/edm",
  "/api/engineering-domains",
  "/api/v1/knowledge-base",
  "/api/v1/edm",
  "/api/v1/engineering-domains",
];

export const isProtectedKnowledgePath = (path: string): boolean =>
  PROTECTED_KNOWLEDGE_PREFIXES.some((prefix) => path.startsWith(prefix));

export const knowledgeProtectionPolicy = () => ({
  serverSideOnly: true,
  clientBundleExposure: false,
  protectedAssets: [
    "engineering-standards-metadata",
    "engineering-templates",
    "engineering-calculators",
    "engineering-workflows",
    "engineering-knowledge-graph",
    "engineering-memory",
    "engineering-decision-trees",
  ],
  enforcement: "authenticated-api-access",
});

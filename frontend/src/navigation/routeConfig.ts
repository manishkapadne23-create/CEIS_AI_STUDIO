export const APP_ROUTES = {
  login: "/",
  dashboard: "/dashboard",
  dashboardDiscipline: "/dashboard/:disciplineSlug",
  chat: "/chat",
  chatDiscipline: "/chat/:disciplineSlug",
  chatModule: "/chat/:disciplineSlug/:moduleId",
  engineeringHub: "/engineering-hub",
  engineeringHubSection: "/engineering-hub/:section",
  engineering: "/engineering",
  learning: "/learning",
  documents: "/documents",
  engineeringTools: "/engineering-tools",
  subscription: "/subscription",
  wallet: "/wallet",
  notifications: "/notifications",
  settings: "/settings",
  profile: "/profile",
  help: "/help",
  pmis: "/pmis",
  app: "/app",
  search: "/search",
  decisionIntelligence: "/decision-intelligence",
  standardsIntelligence: "/standards-intelligence",
  knowledgeGraph: "/knowledge-graph",
  engineeringMemory: "/memory",
  knowledgeDiscipline: "/knowledge/:disciplineSlug",
  knowledgeWorkspace: "/knowledge/:disciplineSlug/:specializationSlug",
} as const;

export const ENGINEERING_HUB_SECTIONS = [
  "news",
  "events",
  "webinars",
  "jobs",
  "opportunities",
  "promotions",
] as const;

export type EngineeringHubSection = (typeof ENGINEERING_HUB_SECTIONS)[number];

export const isEngineeringHubSection = (
  value: string
): value is EngineeringHubSection =>
  ENGINEERING_HUB_SECTIONS.includes(value as EngineeringHubSection);

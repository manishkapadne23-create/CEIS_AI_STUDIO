import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import type { ModuleRouteDecision } from "./types";

interface ModuleRouteRule {
  moduleId: WorkspaceCategoryId;
  patterns: RegExp[];
  reason: string;
  priority: number;
}

const MODULE_ROUTE_RULES: ModuleRouteRule[] = [
  {
    moduleId: "standards",
    patterns: [
      /\bexplain\s+(is|irc|iec|astm|nbc|morth|bs|iso)\b/i,
      /\bwhat\s+(is|does)\s+(is|irc)\s*\d+/i,
      /\bstandards?\s+(and\s+)?codes?\b/i,
      /\bcode\s+interpretation\b/i,
      /\bcompliance\s+with\s+(is|irc)/i,
    ],
    reason: "User is asking about standards and codes",
    priority: 10,
  },
  {
    moduleId: "calculators",
    patterns: [
      /\bcalculate\b/i,
      /\bcomputation\b/i,
      /\bsizing\b/i,
      /\bestimate\s+(the\s+)?(quantity|volume|load)/i,
      /\bearthwork\b/i,
      /\bmix\s+design\b/i,
    ],
    reason: "User needs an engineering calculation",
    priority: 9,
  },
  {
    moduleId: "professional-tools",
    patterns: [
      /\bgenerate\s+boq\b/i,
      /\bprepare\s+boq\b/i,
      /\bcreate\s+boq\b/i,
      /\bbill\s+of\s+quantities\b/i,
      /\bgenerate\s+report\b/i,
      /\bmethod\s+statement\b/i,
      /\brate\s+analysis\b/i,
      /\bestimation\s+tool\b/i,
    ],
    reason: "User needs professional engineering tools",
    priority: 9,
  },
  {
    moduleId: "documents",
    patterns: [
      /\bupload\s+(drawing|document|file|pdf)\b/i,
      /\battach\s+(drawing|document)\b/i,
      /\btemplate\b/i,
      /\bdrawing\s+review\b/i,
      /\bdocument\s+library\b/i,
    ],
    reason: "User is working with documents or drawings",
    priority: 8,
  },
  {
    moduleId: "learning-hub",
    patterns: [
      /\blearn\b/i,
      /\btutorial\b/i,
      /\bcourse\b/i,
      /\btraining\b/i,
      /\bhow\s+to\s+learn\b/i,
      /\breference\s+material\b/i,
    ],
    reason: "User is seeking learning resources",
    priority: 7,
  },
];

type ModuleRouterCallback = (
  moduleId: WorkspaceCategoryId,
  reason: string
) => void;

let moduleRouterCallback: ModuleRouterCallback | null = null;

export const registerCopilotModuleRouter = (
  callback: ModuleRouterCallback | null
): void => {
  moduleRouterCallback = callback;
};

export const resolveModuleRoute = (
  message: string,
  currentModuleId: WorkspaceCategoryId | null
): ModuleRouteDecision | null => {
  let bestMatch: { rule: ModuleRouteRule; match: string } | null = null;

  for (const rule of MODULE_ROUTE_RULES) {
    for (const pattern of rule.patterns) {
      const match = message.match(pattern);
      if (match) {
        if (
          !bestMatch ||
          rule.priority > bestMatch.rule.priority
        ) {
          bestMatch = { rule, match: match[0] };
        }
      }
    }
  }

  if (!bestMatch) return null;

  const { rule, match } = bestMatch;
  const shouldSwitch = currentModuleId !== rule.moduleId;

  return {
    shouldSwitch,
    moduleId: rule.moduleId,
    reason: rule.reason,
    confidence: rule.priority / 10,
    triggerPhrase: match,
  };
};

export const applyCopilotModuleRoute = (
  decision: ModuleRouteDecision | null
): boolean => {
  if (!decision?.shouldSwitch || !moduleRouterCallback) return false;
  moduleRouterCallback(decision.moduleId, decision.reason);
  return true;
};

export const getModuleRouteRules = (): typeof MODULE_ROUTE_RULES =>
  MODULE_ROUTE_RULES;

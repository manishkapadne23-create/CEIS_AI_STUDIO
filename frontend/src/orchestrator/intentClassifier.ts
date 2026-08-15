import type { EngineeringIntent, IntentClassification } from "./types";

interface IntentRule {
  intent: EngineeringIntent;
  patterns: RegExp[];
  priority: number;
}

const INTENT_RULES: IntentRule[] = [
  {
    intent: "comparison",
    patterns: [
      /\bcompare\b/i,
      /\bversus\b/i,
      /\bvs\.?\b/i,
      /\bdifference between\b/i,
      /\bwhich is better\b/i,
    ],
    priority: 10,
  },
  {
    intent: "standards",
    patterns: [
      /\bexplain\s+(is|irc|iec|astm|nbc|morth|bs|iso)\b/i,
      /\bwhat\s+(is|does)\s+(is|irc)\s*\d+/i,
      /\bstandards?\s+(and\s+)?codes?\b/i,
      /\bcode\s+interpretation\b/i,
      /\bcompliance\s+with\b/i,
    ],
    priority: 10,
  },
  {
    intent: "calculation",
    patterns: [
      /\bcalculate\b/i,
      /\bcomputation\b/i,
      /\bsizing\b/i,
      /\bearthwork\b/i,
      /\bmix\s+design\b/i,
      /\bload\s+calculation\b/i,
    ],
    priority: 9,
  },
  {
    intent: "report-generation",
    patterns: [
      /\bgenerate\s+report\b/i,
      /\bprepare\s+report\b/i,
      /\bwrite\s+report\b/i,
      /\bengineering\s+report\b/i,
      /\bexecutive\s+summary\b/i,
    ],
    priority: 9,
  },
  {
    intent: "checklist",
    patterns: [
      /\bchecklist\b/i,
      /\binspection\s+checklist\b/i,
      /\bprepare\s+checklist\b/i,
      /\bcreate\s+checklist\b/i,
    ],
    priority: 9,
  },
  {
    intent: "quantity",
    patterns: [
      /\bgenerate\s+boq\b/i,
      /\bprepare\s+boq\b/i,
      /\bbill\s+of\s+quantities\b/i,
      /\bquantity\s+survey\b/i,
      /\bmeasurement\s+sheet\b/i,
    ],
    priority: 9,
  },
  {
    intent: "estimation",
    patterns: [
      /\bestimate\b/i,
      /\bcost\s+estimate\b/i,
      /\brate\s+analysis\b/i,
      /\bbudget\b/i,
      /\bpricing\b/i,
    ],
    priority: 8,
  },
  {
    intent: "qa-qc",
    patterns: [
      /\bqa\s*\/\s*qc\b/i,
      /\bquality\s+assurance\b/i,
      /\bquality\s+control\b/i,
      /\binspection\s+procedure\b/i,
      /\btesting\s+protocol\b/i,
    ],
    priority: 8,
  },
  {
    intent: "tender",
    patterns: [
      /\btender\b/i,
      /\bbid\s+document\b/i,
      /\brfp\b/i,
      /\bprocurement\b/i,
    ],
    priority: 8,
  },
  {
    intent: "contracts",
    patterns: [
      /\bcontract\b/i,
      /\bagreement\b/i,
      /\bterms\s+and\s+conditions\b/i,
      /\bscope\s+of\s+work\b/i,
    ],
    priority: 7,
  },
  {
    intent: "claims",
    patterns: [
      /\bclaim\b/i,
      /\bextension\s+of\s+time\b/i,
      /\bdelay\s+claim\b/i,
      /\bdispute\b/i,
    ],
    priority: 7,
  },
  {
    intent: "workflow",
    patterns: [
      /\bworkflow\b/i,
      /\bprocedure\b/i,
      /\bstep[\s-]by[\s-]step\b/i,
      /\bprocess\s+for\b/i,
      /\bnext\s+step\b/i,
    ],
    priority: 7,
  },
  {
    intent: "document",
    patterns: [
      /\bupload\s+(drawing|document|file|pdf)\b/i,
      /\breview\s+drawing\b/i,
      /\bdrawing\s+review\b/i,
      /\bdocument\s+library\b/i,
      /\btemplate\b/i,
    ],
    priority: 7,
  },
  {
    intent: "design",
    patterns: [
      /\bdesign\b/i,
      /\bpavement\s+design\b/i,
      /\bfoundation\s+design\b/i,
      /\bstructural\s+design\b/i,
      /\bbridge\s+design\b/i,
      /\blayout\b/i,
    ],
    priority: 7,
  },
  {
    intent: "planning",
    patterns: [
      /\bplanning\b/i,
      /\bmaster\s+plan\b/i,
      /\bscheduling\b/i,
      /\bprogramme\b/i,
      /\bproject\s+plan\b/i,
    ],
    priority: 6,
  },
  {
    intent: "construction",
    patterns: [
      /\bconstruction\b/i,
      /\bmethod\s+statement\b/i,
      /\bsite\s+execution\b/i,
      /\bexecution\s+plan\b/i,
    ],
    priority: 6,
  },
  {
    intent: "maintenance",
    patterns: [
      /\bmaintenance\b/i,
      /\brepair\b/i,
      /\brefurbishment\b/i,
      /\basset\s+management\b/i,
    ],
    priority: 6,
  },
  {
    intent: "learning",
    patterns: [
      /\blearn\b/i,
      /\btutorial\b/i,
      /\bcourse\b/i,
      /\btraining\b/i,
      /\bhow\s+to\s+learn\b/i,
    ],
    priority: 6,
  },
  {
    intent: "research",
    patterns: [
      /\bresearch\b/i,
      /\bliterature\b/i,
      /\breference\s+material\b/i,
      /\btechnical\s+paper\b/i,
    ],
    priority: 5,
  },
];

const FOLLOW_UP_INTENT_MAP: Record<string, EngineeringIntent> = {
  compare: "comparison",
  "generate-report": "report-generation",
  "prepare-checklist": "checklist",
  "create-boq": "quantity",
};

export const classifyEngineeringIntent = (
  message: string,
  followUpIntent?: string | null
): IntentClassification => {
  const matches: Array<{ intent: EngineeringIntent; priority: number; phrase: string }> = [];

  for (const rule of INTENT_RULES) {
    for (const pattern of rule.patterns) {
      const match = message.match(pattern);
      if (match) {
        matches.push({
          intent: rule.intent,
          priority: rule.priority,
          phrase: match[0],
        });
      }
    }
  }

  if (followUpIntent && FOLLOW_UP_INTENT_MAP[followUpIntent]) {
    const mapped = FOLLOW_UP_INTENT_MAP[followUpIntent];
    if (!matches.some((m) => m.intent === mapped)) {
      matches.push({ intent: mapped, priority: 8, phrase: followUpIntent });
    }
  }

  if (matches.length === 0) {
    return {
      primaryIntent: "general-question",
      secondaryIntents: [],
      confidence: 0.5,
      triggerPhrase: null,
    };
  }

  matches.sort((a, b) => b.priority - a.priority);
  const primary = matches[0];
  const secondaryIntents = [
    ...new Set(
      matches.slice(1).map((m) => m.intent).filter((i) => i !== primary.intent)
    ),
  ];

  return {
    primaryIntent: primary.intent,
    secondaryIntents,
    confidence: primary.priority / 10,
    triggerPhrase: primary.phrase,
  };
};

export const getIntentLabel = (intent: EngineeringIntent): string =>
  intent
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

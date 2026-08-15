import type {
  ComparisonAlternative,
  ComparisonCriterion,
  ComparisonTable,
} from "./types";

export interface KnownComparisonTemplate {
  id: string;
  patterns: RegExp[];
  title: string;
  alternatives: [string, string];
  criteria: ComparisonCriterion[];
  disciplineHints: string[];
}

const DEFAULT_CRITERIA: ComparisonCriterion[] = [
  { id: "cost", label: "Cost", description: "Initial and life-cycle cost considerations" },
  { id: "time", label: "Time", description: "Construction, procurement, and schedule impact" },
  { id: "safety", label: "Safety", description: "Construction and operational safety" },
  { id: "environment", label: "Environmental Impact", description: "Sustainability and environmental footprint" },
  { id: "maintainability", label: "Maintainability", description: "Ease of maintenance and service life" },
  { id: "scalability", label: "Future Scalability", description: "Adaptability and future expansion" },
  { id: "standards", label: "Applicable Standards", description: "Code and specification compliance" },
];

export const KNOWN_COMPARISON_TEMPLATES: KnownComparisonTemplate[] = [
  {
    id: "rigid-vs-flexible-pavement",
    patterns: [/rigid\s+pavement.*flexible|flexible\s+pavement.*rigid/i, /rigid\s+vs\.?\s+flexible/i],
    title: "Rigid Pavement vs Flexible Pavement",
    alternatives: ["Rigid Pavement (CC Pavement)", "Flexible Pavement (Bituminous)"],
    criteria: [
      ...DEFAULT_CRITERIA,
      { id: "traffic", label: "Traffic Loading", description: "Suitability for design traffic and axle loads" },
      { id: "subgrade", label: "Subgrade Sensitivity", description: "Performance on varying subgrade conditions" },
    ],
    disciplineHints: ["civil", "railway"],
  },
  {
    id: "steel-vs-psc-bridge",
    patterns: [/steel\s+bridge.*psc|psc\s+bridge.*steel/i, /steel\s+vs\.?\s+psc/i],
    title: "Steel Bridge vs PSC Bridge",
    alternatives: ["Steel Bridge", "Prestressed Concrete (PSC) Bridge"],
    criteria: [
      ...DEFAULT_CRITERIA,
      { id: "span", label: "Span Capability", description: "Suitability for span length and geometry" },
      { id: "durability", label: "Durability", description: "Corrosion, fatigue, and service life" },
    ],
    disciplineHints: ["civil", "railway"],
  },
  {
    id: "solar-vs-wind",
    patterns: [/solar.*wind|wind.*solar/i, /solar\s+vs\.?\s+wind/i],
    title: "Solar vs Wind Energy",
    alternatives: ["Solar PV", "Wind Power"],
    criteria: [
      ...DEFAULT_CRITERIA,
      { id: "resource", label: "Resource Availability", description: "Site-specific solar irradiance vs wind potential" },
      { id: "grid", label: "Grid Integration", description: "Interconnection and intermittency management" },
    ],
    disciplineHints: ["renewable-energy", "electrical"],
  },
  {
    id: "precast-vs-cast-in-situ",
    patterns: [/precast.*cast[\s-]in[\s-]situ|cast[\s-]in[\s-]situ.*precast/i],
    title: "Precast vs Cast-in-Situ Construction",
    alternatives: ["Precast Construction", "Cast-in-Situ Construction"],
    criteria: DEFAULT_CRITERIA,
    disciplineHints: ["civil"],
  },
  {
    id: "open-vs-bored-tunnel",
    patterns: [/open\s+cut.*tunnel|bored\s+tunnel|cut[\s-]and[\s-]cover.*bored/i],
    title: "Open Cut vs Bored Tunnel",
    alternatives: ["Open Cut / Cut-and-Cover", "Bored Tunnel (TBM/NATM)"],
    criteria: DEFAULT_CRITERIA,
    disciplineHints: ["civil", "mining"],
  },
];

const COMPARISON_TRIGGERS =
  /\b(compare|comparison|versus|vs\.?|difference between|which is better|evaluate alternatives|pros and cons|trade[\s-]off)\b/i;

const VS_PATTERN =
  /(?:compare|between|versus|vs\.?)\s+(.+?)\s+(?:and|vs\.?|versus|with|or)\s+(.+?)(?:\?|$|\.)/i;

const OR_PATTERN = /(.+?)\s+or\s+(.+?)(?:\?|$|\.)/i;

export const isComparisonQuery = (message: string): boolean =>
  COMPARISON_TRIGGERS.test(message);

export const matchKnownComparison = (
  message: string
): KnownComparisonTemplate | null => {
  for (const template of KNOWN_COMPARISON_TEMPLATES) {
    if (template.patterns.some((pattern) => pattern.test(message))) {
      return template;
    }
  }
  return null;
};

export const extractAlternativesFromMessage = (
  message: string
): [string, string] | null => {
  const vsMatch = message.match(VS_PATTERN);
  if (vsMatch) {
    return [vsMatch[1].trim(), vsMatch[2].trim()];
  }

  const orMatch = message.match(OR_PATTERN);
  if (orMatch && COMPARISON_TRIGGERS.test(message)) {
    return [orMatch[1].trim(), orMatch[2].trim()];
  }

  return null;
};

const buildMarkdownTableSkeleton = (
  title: string,
  alternatives: ComparisonAlternative[],
  criteria: ComparisonCriterion[]
): string => {
  const headers = ["Criterion", ...alternatives.map((alt) => alt.name)];
  const separator = headers.map(() => "---");
  const rows = criteria.map(
    (criterion) =>
      `| ${criterion.label} | ${alternatives.map(() => "[Advantages / Disadvantages / Rating]").join(" | ")} |`
  );

  return [
    `## ${title}`,
    "",
    `| ${headers.join(" | ")} |`,
    `| ${separator.join(" | ")} |`,
    ...rows,
    "",
    "**Legend:** Use ✓/✗, Low/Medium/High, or brief engineering notes per cell.",
    "**Include:** Advantages, Disadvantages, Cost, Time, Safety, Environmental Impact, Maintainability, Scalability, Applicable Standards.",
  ].join("\n");
};

export const buildComparisonTable = (message: string): ComparisonTable | null => {
  if (!isComparisonQuery(message)) {
    return null;
  }

  const known = matchKnownComparison(message);
  if (known) {
    const alternatives: ComparisonAlternative[] = known.alternatives.map(
      (name, index) => ({ id: `alt-${index}`, name })
    );
    return {
      title: known.title,
      alternatives,
      criteria: known.criteria,
      knownTemplateId: known.id,
      markdownSkeleton: buildMarkdownTableSkeleton(
        known.title,
        alternatives,
        known.criteria
      ),
    };
  }

  const extracted = extractAlternativesFromMessage(message);
  if (extracted) {
    const alternatives: ComparisonAlternative[] = extracted.map((name, index) => ({
      id: `alt-${index}`,
      name,
    }));
    const title = `${extracted[0]} vs ${extracted[1]}`;
    return {
      title,
      alternatives,
      criteria: DEFAULT_CRITERIA,
      markdownSkeleton: buildMarkdownTableSkeleton(
        title,
        alternatives,
        DEFAULT_CRITERIA
      ),
    };
  }

  if (COMPARISON_TRIGGERS.test(message)) {
    return {
      title: "Engineering Alternatives Comparison",
      alternatives: [
        { id: "alt-0", name: "Alternative A" },
        { id: "alt-1", name: "Alternative B" },
      ],
      criteria: DEFAULT_CRITERIA,
      markdownSkeleton: buildMarkdownTableSkeleton(
        "Engineering Alternatives Comparison",
        [
          { id: "alt-0", name: "Alternative A" },
          { id: "alt-1", name: "Alternative B" },
        ],
        DEFAULT_CRITERIA
      ),
    };
  }

  return null;
};

export const formatComparisonForPrompt = (
  table: ComparisonTable | null
): string => {
  if (!table) return "";

  return [
    "COMPARISON TABLE (generate structured markdown):",
    table.markdownSkeleton,
    "",
    "For each alternative also provide:",
    "- Advantages",
    "- Disadvantages",
    "- Cost Considerations",
    "- Time Considerations",
    "- Safety Considerations",
    "- Environmental Impact",
    "- Maintainability",
    "- Future Scalability",
    "- Applicable Standards",
  ].join("\n");
};

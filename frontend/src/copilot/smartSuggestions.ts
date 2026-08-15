import type { CopilotContextSnapshot, CopilotSuggestion } from "./types";

interface TopicSuggestionRule {
  patterns: RegExp[];
  suggestions: Array<{
    category: CopilotSuggestion["category"];
    title: string;
    description: string;
    moduleId?: CopilotSuggestion["moduleId"];
    priority: number;
  }>;
}

const TOPIC_SUGGESTION_RULES: TopicSuggestionRule[] = [
  {
    patterns: [/m\s*40|m40\s*concrete|design\s+m\d+\s*concrete|concrete\s+mix/i],
    suggestions: [
      { category: "standards", title: "IS 456", description: "Plain and reinforced concrete code", moduleId: "standards", priority: 10 },
      { category: "standards", title: "IS 10262", description: "Concrete mix proportioning", moduleId: "standards", priority: 9 },
      { category: "calculators", title: "Concrete Mix Calculator", description: "Design concrete mix for target grade", moduleId: "calculators", priority: 9 },
      { category: "checklists", title: "Cube Test Checklist", description: "Field and lab cube testing checklist", moduleId: "professional-tools", priority: 8 },
      { category: "templates", title: "Material Specification", description: "Concrete material specification template", moduleId: "professional-tools", priority: 8 },
      { category: "templates", title: "Concrete Inspection Format", description: "Site concrete inspection format", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/flexible\s+pavement|irc\s*37|pavement\s+design/i],
    suggestions: [
      { category: "standards", title: "IRC 37", description: "Flexible pavement design guidelines", moduleId: "standards", priority: 10 },
      { category: "standards", title: "IRC 58", description: "Rigid pavement design guidelines", moduleId: "standards", priority: 8 },
      { category: "calculators", title: "Traffic Calculator", description: "Design traffic and loading analysis", moduleId: "calculators", priority: 9 },
      { category: "calculators", title: "CBR Calculator", description: "Subgrade CBR-based design inputs", moduleId: "calculators", priority: 9 },
      { category: "workflows", title: "Pavement Design Workflow", description: "Guided pavement design workflow", moduleId: "professional-tools", priority: 8 },
      { category: "templates", title: "BOQ Template", description: "Pavement works BOQ template", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/rigid\s+pavement|irc\s*58/i],
    suggestions: [
      { category: "standards", title: "IRC 58", description: "Rigid pavement design", moduleId: "standards", priority: 10 },
      { category: "standards", title: "IRC 37", description: "Pavement design reference", moduleId: "standards", priority: 7 },
      { category: "calculators", title: "Rigid Pavement Calculator", description: "Slab thickness design", moduleId: "calculators", priority: 9 },
      { category: "workflows", title: "Pavement Design Workflow", description: "End-to-end pavement design", moduleId: "professional-tools", priority: 8 },
      { category: "checklists", title: "Pavement QA Checklist", description: "Construction quality checks", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/transformer\s+design|transformer\s+selection/i],
    suggestions: [
      { category: "standards", title: "IEC Standards", description: "Transformer design and testing standards", moduleId: "standards", priority: 10 },
      { category: "standards", title: "IS 2026", description: "Power transformers specification", moduleId: "standards", priority: 9 },
      { category: "calculators", title: "Cable Calculator", description: "Cable sizing and selection", moduleId: "calculators", priority: 8 },
      { category: "checklists", title: "Transformer Checklist", description: "Inspection and testing checklist", moduleId: "professional-tools", priority: 8 },
      { category: "templates", title: "Testing Procedure", description: "Transformer testing procedure format", moduleId: "professional-tools", priority: 7 },
      { category: "workflows", title: "Transformer Selection Workflow", description: "Guided transformer selection", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/boq|bill\s+of\s+quantities/i],
    suggestions: [
      { category: "workflows", title: "BOQ Preparation Workflow", description: "Step-by-step BOQ preparation", moduleId: "professional-tools", priority: 10 },
      { category: "templates", title: "BOQ Template", description: "Standard BOQ format", moduleId: "professional-tools", priority: 9 },
      { category: "calculators", title: "Quantity Estimation Calculator", description: "Engineering quantity take-off", moduleId: "calculators", priority: 8 },
      { category: "reports", title: "Rate Analysis Report", description: "BOQ rate analysis support", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/bridge\s+design|retaining\s+wall/i],
    suggestions: [
      { category: "standards", title: "IRC 6", description: "Loads on bridges", moduleId: "standards", priority: 10 },
      { category: "standards", title: "IS 456", description: "RCC design code", moduleId: "standards", priority: 9 },
      { category: "calculators", title: "Structural Design Calculator", description: "Load and member design", moduleId: "calculators", priority: 9 },
      { category: "workflows", title: "Bridge Design Workflow", description: "Guided bridge design process", moduleId: "professional-tools", priority: 8 },
      { category: "checklists", title: "Structural QA Checklist", description: "Design and construction QA", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/earthwork|cut\s+and\s+fill|embankment/i],
    suggestions: [
      { category: "calculators", title: "Earthwork Calculator", description: "Cut-fill volume estimation", moduleId: "calculators", priority: 10 },
      { category: "standards", title: "MoRTH Specifications", description: "Earthwork specifications", moduleId: "standards", priority: 8 },
      { category: "templates", title: "Earthwork BOQ Template", description: "Earthwork item schedule", moduleId: "professional-tools", priority: 7 },
    ],
  },
  {
    patterns: [/highway\s+dpr|detailed\s+project\s+report/i],
    suggestions: [
      { category: "workflows", title: "Highway DPR Workflow", description: "Complete DPR preparation workflow", moduleId: "professional-tools", priority: 10 },
      { category: "standards", title: "IRC / MoRTH", description: "Highway design standards", moduleId: "standards", priority: 9 },
      { category: "reports", title: "DPR Template", description: "DPR chapter template", moduleId: "professional-tools", priority: 8 },
    ],
  },
];

export const generateTopicSuggestions = (
  message: string,
  snapshot: CopilotContextSnapshot
): CopilotSuggestion[] => {
  const suggestions: CopilotSuggestion[] = [];
  const normalized = message.toLowerCase();
  const topicText = `${normalized} ${snapshot.sessionTopic ?? ""}`.toLowerCase();

  for (const rule of TOPIC_SUGGESTION_RULES) {
    if (rule.patterns.some((pattern) => pattern.test(topicText))) {
      for (const item of rule.suggestions) {
        suggestions.push({
          id: `topic-${item.category}-${item.title.replace(/\s+/g, "-").toLowerCase()}`,
          category: item.category,
          title: item.title,
          description: item.description,
          moduleId: item.moduleId,
          priority: item.priority,
        });
      }
    }
  }

  if (snapshot.activeWorkflowTitle) {
    suggestions.push({
      id: "workflow-active-next-step",
      category: "workflows",
      title: `Continue: ${snapshot.activeWorkflowTitle}`,
      description: snapshot.activeWorkflowStep
        ? `Current step: ${snapshot.activeWorkflowStep}`
        : "Resume active engineering workflow",
      moduleId: "professional-tools",
      priority: 11,
    });
  }

  const seen = new Set<string>();
  return suggestions
    .filter((item) => {
      const key = `${item.category}:${item.title}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .sort((a, b) => b.priority - a.priority);
};

export const generateReportAndChecklistSuggestions = (
  intent: string
): CopilotSuggestion[] => {
  if (intent === "inspection-qa") {
    return [
      {
        id: "checklist-inspection",
        category: "checklists",
        title: "Inspection Checklist",
        description: "Generate inspection checklist for current work",
        moduleId: "professional-tools",
        priority: 9,
      },
      {
        id: "template-inspection-format",
        category: "templates",
        title: "Inspection Format",
        description: "Site inspection report format",
        moduleId: "professional-tools",
        priority: 8,
      },
    ];
  }

  if (intent === "boq-preparation") {
    return [
      {
        id: "report-boq",
        category: "reports",
        title: "BOQ Report",
        description: "Generate BOQ from current scope",
        moduleId: "professional-tools",
        priority: 9,
      },
    ];
  }

  return [];
};

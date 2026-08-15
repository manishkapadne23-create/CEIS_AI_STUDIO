import {
  assessInnovation,
  formatInnovationAssessment,
  generateInnovationIdeas,
  suggestMethodology,
} from "./innovationEngine";
import {
  classifyTopic,
  formatLiteratureSummary,
  organizeLiteratureNote,
  suggestRelatedTopics,
} from "./literatureOrganizer";
import {
  buildResearchReport,
  formatResearchReportForPrompt,
} from "./researchReports";
import {
  generateTechnologyReview,
  formatTechnologyReview,
  compareTechnologies,
} from "./technologyReview";
import {
  exploreTopic,
  extractKeywords,
  formatTopicExploration,
  identifyResearchGaps,
  suggestObjectives,
  TOPIC_CATALOG,
} from "./topicExplorer";
import type {
  ResearchEngineInput,
  ResearchEngineResult,
  ResearchExtensionHooks,
  ResearchWorkspace,
} from "./types";

let extensionHooks: ResearchExtensionHooks = {};

export const setResearchExtensionHooks = (hooks: ResearchExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getResearchExtensionHooks = (): ResearchExtensionHooks => extensionHooks;

const STORAGE_KEY = "sarathi.research.workspaces";
const ACTIVE_KEY = "sarathi.research.active";

let workspaceStore: ResearchWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as ResearchWorkspace[]) : [];
    activeWorkspaceId = localStorage.getItem(ACTIVE_KEY);
  } catch {
    workspaceStore = [];
  }
  hydrated = true;
};

const persist = (): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(workspaceStore.slice(0, 50)));
  if (activeWorkspaceId) localStorage.setItem(ACTIVE_KEY, activeWorkspaceId);
  else localStorage.removeItem(ACTIVE_KEY);
};

const createWorkspace = (
  topic: string,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null
): ResearchWorkspace => {
  hydrate();
  const now = Date.now();
  const ws: ResearchWorkspace = {
    id: crypto.randomUUID(),
    title: `Research: ${topic}`,
    disciplineId,
    disciplineName,
    conversationId,
    topic,
    problemStatement: `Investigate ${topic} for engineering applications in ${disciplineName ?? "relevant discipline"}.`,
    objectives: suggestObjectives(topic),
    researchGaps: identifyResearchGaps(topic, disciplineName),
    innovationIdeas: generateInnovationIdeas(topic, disciplineName),
    methodology: suggestMethodology(topic),
    limitations: [
      "Scope limited to available data and resources",
      "Generalizability may require further validation",
      "Not a substitute for peer-reviewed literature review",
    ],
    futureScope: suggestRelatedTopics(topic, disciplineId).map(
      (t) => `Future work: ${t}`
    ),
    keywords: extractKeywords(topic),
    literatureNotes: [],
    technologyComparisons: [],
    status: "exploring",
    createdAt: now,
    updatedAt: now,
  };
  workspaceStore.unshift(ws);
  activeWorkspaceId = ws.id;
  persist();
  return ws;
};

export const getActiveResearchWorkspace = (): ResearchWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const updateWorkspace = (ws: ResearchWorkspace): void => {
  hydrate();
  const i = workspaceStore.findIndex((w) => w.id === ws.id);
  if (i >= 0) {
    workspaceStore[i] = { ...ws, updatedAt: Date.now() };
    persist();
  }
};

const isResearchQuery = (message: string): boolean =>
  /\b(research|innovation|literature|technology\s+review|research\s+topic|research\s+report|research\s+brief|gap\s+identification|methodology|trl|feasibility|explore\s+topic|compare\s+technologies|future\s+scope|presentation\s+summary)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const exploreMatch = message.match(
    /^(?:explore|research|start\s+research)\s+(?:topic\s+)?(.+)$/i
  );
  if (exploreMatch) return { action: "explore", payload: exploreMatch[1].trim() };

  const techMatch = message.match(/^technology\s+review\s+(.+)$/i);
  if (techMatch) return { action: "tech-review", payload: techMatch[1].trim() };

  const innovateMatch = message.match(/^assess\s+innovation\s+(.+)$/i);
  if (innovateMatch) return { action: "innovate", payload: innovateMatch[1].trim() };

  const compareMatch = message.match(/^compare\s+technologies?\s+(.+?)\s+(?:vs|and)\s+(.+)$/i);
  if (compareMatch) return { action: "compare", payload: `${compareMatch[1]}|${compareMatch[2]}` };

  const reportMatch = message.match(/^research\s+report$/i);
  if (reportMatch) return { action: "report", payload: "" };

  const briefMatch = message.match(/^research\s+brief$/i);
  if (briefMatch) return { action: "brief", payload: "" };

  const litMatch = message.match(/^literature\s+(?:summary|review)$/i);
  if (litMatch) return { action: "literature", payload: "" };

  const noteMatch = message.match(/^add\s+research\s+note\s+(.+)$/i);
  if (noteMatch) return { action: "note", payload: noteMatch[1].trim() };

  const listMatch = message.match(/^(?:list|search)\s+(?:research\s+)?topics?(?:\s+(.+))?$/i);
  if (listMatch) return { action: "list", payload: listMatch[1]?.trim() ?? "" };

  const methodologyMatch = message.match(/^methodology\s+guidance$/i);
  if (methodologyMatch) return { action: "methodology", payload: "" };

  return null;
};

/** Run Engineering Research & Innovation Intelligence (ERII) for a user turn. */
export const runResearchEngine = (
  input: ResearchEngineInput
): ResearchEngineResult => {
  let researchAction: string | null = null;
  let reportAction: string | null = null;
  let technologyReview = null;
  let searchResultCount = 0;
  let activeWorkspace = getActiveResearchWorkspace();

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "explore": {
        activeWorkspace = createWorkspace(
          command.payload,
          input.conversationId,
          input.disciplineId,
          input.disciplineName
        );
        researchAction = [
          `Research workspace: ${activeWorkspace.title}`,
          `Classification: ${classifyTopic(activeWorkspace.topic)}`,
          `Problem: ${activeWorkspace.problemStatement}`,
          "",
          "Objectives:",
          ...activeWorkspace.objectives.map((o) => `- ${o}`),
          "",
          "Research Gaps:",
          ...activeWorkspace.researchGaps.map((g) => `- ${g}`),
          "",
          "Innovation Ideas:",
          ...activeWorkspace.innovationIdeas.map((i) => `- ${i}`),
        ].join("\n");
        break;
      }
      case "tech-review": {
        technologyReview = generateTechnologyReview(
          command.payload,
          input.disciplineName
        );
        researchAction = formatTechnologyReview(technologyReview);
        break;
      }
      case "innovate": {
        const assessment = assessInnovation(command.payload, input.disciplineName);
        researchAction = formatInnovationAssessment(assessment);
        break;
      }
      case "compare": {
        const [a, b] = command.payload.split("|");
        researchAction = compareTechnologies(a, b);
        break;
      }
      case "report": {
        if (!activeWorkspace) {
          reportAction = "No active research workspace. Say 'Explore topic [name]'.";
          break;
        }
        const tech = generateTechnologyReview(activeWorkspace.topic, input.disciplineName);
        const innovation = assessInnovation(activeWorkspace.topic, input.disciplineName);
        reportAction = formatResearchReportForPrompt(
          buildResearchReport(activeWorkspace, tech, innovation)
        );
        break;
      }
      case "brief": {
        if (!activeWorkspace) {
          researchAction = "No active research workspace.";
          break;
        }
        researchAction = [
          `Research Brief: ${activeWorkspace.topic}`,
          activeWorkspace.problemStatement,
          "",
          "Keywords:",
          activeWorkspace.keywords.join(", "),
        ].join("\n");
        break;
      }
      case "literature": {
        if (!activeWorkspace) {
          researchAction = "No active research workspace.";
          break;
        }
        researchAction = formatLiteratureSummary(activeWorkspace);
        break;
      }
      case "note": {
        if (!activeWorkspace) {
          researchAction = "No active research workspace.";
          break;
        }
        activeWorkspace.literatureNotes.unshift(command.payload);
        organizeLiteratureNote(activeWorkspace.id, command.payload);
        updateWorkspace(activeWorkspace);
        researchAction = `Note added: ${command.payload}`;
        break;
      }
      case "list": {
        const topics = exploreTopic(command.payload, input.disciplineId);
        searchResultCount = topics.length;
        researchAction = [
          `Research catalog: ${TOPIC_CATALOG.length} topics across 18 disciplines`,
          "",
          formatTopicExploration(topics),
        ].join("\n");
        break;
      }
      case "methodology": {
        const topic = activeWorkspace?.topic ?? input.userMessage;
        researchAction = [
          "METHODOLOGY GUIDANCE:",
          ...suggestMethodology(topic).map((m, i) => `${i + 1}. ${m}`),
        ].join("\n");
        break;
      }
    }
  }

  if (!researchAction && !reportAction && isResearchQuery(input.userMessage)) {
    if (!activeWorkspace) {
      const topics = exploreTopic(input.userMessage, input.disciplineId);
      if (topics.length > 0) {
        researchAction = formatTopicExploration(topics);
        searchResultCount = topics.length;
      }
    } else {
      researchAction = formatLiteratureSummary(activeWorkspace);
    }
  }

  const active =
    isResearchQuery(input.userMessage) ||
    activeWorkspace !== null ||
    researchAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.academicDatabaseId) extensionNotes.push(`Academic DB: ${extensionHooks.academicDatabaseId}`);
  if (extensionHooks.patentSearchId) extensionNotes.push(`Patents: ${extensionHooks.patentSearchId}`);
  if (extensionHooks.researchCollaborationId) extensionNotes.push(`Collaboration: ${extensionHooks.researchCollaborationId}`);
  if (extensionHooks.institutionPortalId) extensionNotes.push(`Institution: ${extensionHooks.institutionPortalId}`);
  if (extensionHooks.pmisKnowledgeTransferId) extensionNotes.push(`PMIS: ${extensionHooks.pmisKnowledgeTransferId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Research & Innovation Intelligence (ERII)",
    "========================================",
    "Research and innovation assistant — NOT a scientific publishing platform.",
    "",
    researchAction ? `RESEARCH:\n${researchAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace ? `\nActive workspace: ${activeWorkspace.title} (${activeWorkspace.status})` : "",
    "",
    "ERII COMMANDS:",
    "- Explore topic [name] | Technology review [tech] | Assess innovation [idea]",
    "- Research report | Research brief | Literature review | Methodology guidance",
    "- Compare technologies A vs B | Add research note [text] | List research topics",
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    researchAction,
    reportAction,
    technologyReview,
    searchResultCount,
    promptAugmentation,
    summaryText: [
      active ? "erii-active" : "",
      activeWorkspace?.topic ?? "",
      searchResultCount > 0 ? `${searchResultCount} topics` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatResearchForPrompt = (result: ResearchEngineResult): string =>
  result.promptAugmentation;

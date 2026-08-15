import {
  formatCertificationRoadmap,
  recommendCertifications,
  searchCertifications,
  CERTIFICATION_CATALOG_SIZE,
} from "./certificationAdvisor";
import {
  formatCareerGuidance,
  generateCareerReport,
  generateProfessionalDevelopmentReport,
  getIndustryTrends,
  getTechnologyRoadmap,
  resolveCareerStage,
} from "./careerPlanner";
import {
  buildInterviewPrep,
  formatHrQuestions,
  formatInterviewPrep,
  formatMockInterview,
  formatTechnicalQuestions,
} from "./interviewCoach";
import {
  buildLearningPlan,
  formatLearningPlan,
  parseLearningDuration,
} from "./learningPlanner";
import {
  buildCareerReport,
  formatCareerReportForPrompt,
  formatSkillReport,
} from "./mentorReports";
import {
  analyzeSkillGaps,
  buildSkillMatrix,
  formatSkillGapReport,
  formatSkillMatrix,
  searchSkills,
} from "./skillAnalyzer";
import type {
  MentorEngineInput,
  MentorEngineResult,
  MentorExtensionHooks,
  MentorWorkspace,
} from "./types";

let extensionHooks: MentorExtensionHooks = {};

export const setMentorExtensionHooks = (hooks: MentorExtensionHooks): void => {
  extensionHooks = { ...extensionHooks, ...hooks };
};

export const getMentorExtensionHooks = (): MentorExtensionHooks => extensionHooks;

const STORAGE_KEY = "sarathi.mentor.workspaces";
const ACTIVE_KEY = "sarathi.mentor.active";

let workspaceStore: MentorWorkspace[] = [];
let activeWorkspaceId: string | null = null;
let hydrated = false;

const hydrate = (): void => {
  if (hydrated) return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    workspaceStore = raw ? (JSON.parse(raw) as MentorWorkspace[]) : [];
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
  focusArea: string,
  conversationId: string | null,
  disciplineId: string | null,
  disciplineName: string | null,
  message: string
): MentorWorkspace => {
  hydrate();
  const stage = resolveCareerStage(message);
  const skillMatrix = buildSkillMatrix(disciplineId, disciplineName);
  const skillGaps = analyzeSkillGaps(skillMatrix);
  const now = Date.now();

  const ws: MentorWorkspace = {
    id: crypto.randomUUID(),
    title: `Mentor: ${focusArea}`,
    disciplineId,
    disciplineName,
    conversationId,
    careerStage: stage,
    focusArea,
    careerGoals: [],
    skillMatrix,
    skillGaps,
    learningPlans: [],
    certifications: recommendCertifications(disciplineId, disciplineName, focusArea),
    industryTrends: getIndustryTrends(disciplineName),
    professionalDevelopment: [],
    status: "active",
    createdAt: now,
    updatedAt: now,
  };

  workspaceStore.unshift(ws);
  activeWorkspaceId = ws.id;
  persist();
  return ws;
};

export const getActiveMentorWorkspace = (): MentorWorkspace | null => {
  hydrate();
  if (!activeWorkspaceId) return null;
  return workspaceStore.find((w) => w.id === activeWorkspaceId) ?? null;
};

const updateWorkspace = (ws: MentorWorkspace): void => {
  hydrate();
  const i = workspaceStore.findIndex((w) => w.id === ws.id);
  if (i >= 0) {
    workspaceStore[i] = { ...ws, updatedAt: Date.now() };
    persist();
  }
};

const isMentorQuery = (message: string): boolean =>
  /\b(mentor|career|skill\s+gap|learning\s+(?:roadmap|plan)|interview|certification|mock\s+interview|professional\s+development|leadership|engineering\s+ethics|presentation\s+skills|technical\s+writing|industry\s+trends|technology\s+roadmap|skill\s+matrix|career\s+report|career\s+guidance)/i.test(
    message
  );

const parseCommand = (
  message: string
): { action: string; payload: string } | null => {
  const startMatch = message.match(
    /^(?:start\s+mentor|create\s+mentor(?:\s+workspace)?|engineering\s+mentor)\s*(?:for\s+)?(.+)?$/i
  );
  if (startMatch) return { action: "start", payload: startMatch[1]?.trim() ?? "" };

  const careerMatch = message.match(/^career\s+guidance(?:\s+(.+))?$/i);
  if (careerMatch) return { action: "career", payload: careerMatch[1]?.trim() ?? "" };

  const gapMatch = message.match(/^skill\s+gap(?:\s+analysis)?$/i);
  if (gapMatch) return { action: "skill-gap", payload: "" };

  const matrixMatch = message.match(/^skill\s+matrix$/i);
  if (matrixMatch) return { action: "skill-matrix", payload: "" };

  const roadmapMatch = message.match(
    /^learning\s+(?:roadmap|plan)(?:\s+(.+))?$/i
  );
  if (roadmapMatch) return { action: "learning", payload: roadmapMatch[1]?.trim() ?? "" };

  const techRoadmapMatch = message.match(/^technology\s+roadmap$/i);
  if (techRoadmapMatch) return { action: "tech-roadmap", payload: "" };

  const trendsMatch = message.match(/^industry\s+trends$/i);
  if (trendsMatch) return { action: "trends", payload: "" };

  const techInterviewMatch = message.match(
    /^technical\s+interview(?:\s+questions?)?(?:\s+(.+))?$/i
  );
  if (techInterviewMatch) return { action: "tech-interview", payload: techInterviewMatch[1]?.trim() ?? "" };

  const hrMatch = message.match(/^hr\s+interview(?:\s+questions?)?$/i);
  if (hrMatch) return { action: "hr-interview", payload: "" };

  const mockMatch = message.match(/^mock\s+interview(?:\s+(.+))?$/i);
  if (mockMatch) return { action: "mock", payload: mockMatch[1]?.trim() ?? "" };

  const certMatch = message.match(
    /^(?:certification\s+guidance|list\s+certifications?)(?:\s+(.+))?$/i
  );
  if (certMatch) return { action: "certifications", payload: certMatch[1]?.trim() ?? "" };

  const careerReportMatch = message.match(/^career\s+report$/i);
  if (careerReportMatch) return { action: "career-report", payload: "" };

  const skillReportMatch = message.match(/^skill\s+report$/i);
  if (skillReportMatch) return { action: "skill-report", payload: "" };

  const interviewPlanMatch = message.match(/^interview\s+preparation(?:\s+plan)?(?:\s+(.+))?$/i);
  if (interviewPlanMatch) return { action: "interview-plan", payload: interviewPlanMatch[1]?.trim() ?? "" };

  const profDevMatch = message.match(/^professional\s+development(?:\s+report)?$/i);
  if (profDevMatch) return { action: "prof-dev", payload: "" };

  const searchSkillMatch = message.match(/^search\s+skills?\s+(.+)$/i);
  if (searchSkillMatch) return { action: "search-skill", payload: searchSkillMatch[1].trim() };

  const searchCertMatch = message.match(/^search\s+certifications?\s+(.+)$/i);
  if (searchCertMatch) return { action: "search-cert", payload: searchCertMatch[1].trim() };

  return null;
};

/** Run Engineering Mentor & Career Intelligence Engine (EMCIE) for a user turn. */
export const runMentorEngine = (input: MentorEngineInput): MentorEngineResult => {
  let mentorAction: string | null = null;
  let reportAction: string | null = null;
  let searchResultCount = 0;
  let activeWorkspace = getActiveMentorWorkspace();

  const command = parseCommand(input.userMessage);
  if (command) {
    switch (command.action) {
      case "start": {
        const focus = command.payload || input.disciplineName || "Engineering Career";
        activeWorkspace = createWorkspace(
          focus,
          input.conversationId,
          input.disciplineId,
          input.disciplineName,
          input.userMessage
        );
        mentorAction = [
          `Engineering Mentor Workspace: ${activeWorkspace.title}`,
          `Stage: ${activeWorkspace.careerStage}`,
          `Discipline: ${activeWorkspace.disciplineName ?? "General"}`,
          "",
          formatSkillMatrix(activeWorkspace.skillMatrix),
          "",
          formatSkillGapReport(activeWorkspace.skillGaps),
        ].join("\n");
        break;
      }
      case "career": {
        const stage = activeWorkspace?.careerStage ?? resolveCareerStage(input.userMessage);
        const focus = command.payload || activeWorkspace?.focusArea || "Career growth";
        mentorAction = formatCareerGuidance(input.disciplineName, stage, focus);
        break;
      }
      case "skill-gap": {
        const matrix = activeWorkspace?.skillMatrix ?? buildSkillMatrix(input.disciplineId, input.disciplineName);
        const gaps = analyzeSkillGaps(matrix);
        mentorAction = formatSkillGapReport(gaps);
        break;
      }
      case "skill-matrix": {
        const matrix = activeWorkspace?.skillMatrix ?? buildSkillMatrix(input.disciplineId, input.disciplineName);
        mentorAction = formatSkillMatrix(matrix);
        break;
      }
      case "learning": {
        const duration = parseLearningDuration(command.payload || input.userMessage);
        const focus =
          activeWorkspace?.focusArea ??
          (command.payload || (input.disciplineName ?? "Engineering"));
        const plan = buildLearningPlan(duration, input.disciplineName, focus);
        if (activeWorkspace) {
          activeWorkspace.learningPlans.unshift(plan);
          updateWorkspace(activeWorkspace);
        }
        mentorAction = formatLearningPlan(plan);
        break;
      }
      case "tech-roadmap": {
        mentorAction = [
          "TECHNOLOGY ROADMAP:",
          ...getTechnologyRoadmap(input.disciplineName).map((t) => `- ${t}`),
        ].join("\n");
        break;
      }
      case "trends": {
        mentorAction = [
          "INDUSTRY TRENDS:",
          ...getIndustryTrends(input.disciplineName).map((t) => `- ${t}`),
        ].join("\n");
        break;
      }
      case "tech-interview": {
        const topic = command.payload || activeWorkspace?.focusArea || input.disciplineName || "Engineering";
        mentorAction = formatTechnicalQuestions(topic, input.disciplineName);
        break;
      }
      case "hr-interview": {
        mentorAction = formatHrQuestions();
        break;
      }
      case "mock": {
        const topic = command.payload || activeWorkspace?.focusArea || input.disciplineName || "Engineering";
        const prep = buildInterviewPrep(topic, input.disciplineName);
        mentorAction = formatMockInterview(prep);
        break;
      }
      case "certifications": {
        const certs = command.payload
          ? searchCertifications(command.payload, input.disciplineId)
          : recommendCertifications(
              input.disciplineId,
              input.disciplineName,
              activeWorkspace?.focusArea ?? ""
            );
        searchResultCount = certs.length;
        mentorAction = formatCertificationRoadmap(certs, input.disciplineName);
        break;
      }
      case "career-report": {
        if (!activeWorkspace) {
          reportAction = "No active mentor workspace. Say 'Start mentor [focus area]'.";
          break;
        }
        reportAction = formatCareerReportForPrompt(buildCareerReport(activeWorkspace));
        break;
      }
      case "skill-report": {
        if (!activeWorkspace) {
          reportAction = "No active mentor workspace.";
          break;
        }
        reportAction = formatSkillReport(activeWorkspace);
        break;
      }
      case "interview-plan": {
        const topic = command.payload || activeWorkspace?.focusArea || input.disciplineName || "Engineering";
        const prep = buildInterviewPrep(topic, input.disciplineName);
        mentorAction = formatInterviewPrep(prep);
        break;
      }
      case "prof-dev": {
        const stage = activeWorkspace?.careerStage ?? resolveCareerStage(input.userMessage);
        mentorAction = generateProfessionalDevelopmentReport(input.disciplineName, stage);
        break;
      }
      case "search-skill": {
        const results = searchSkills(command.payload, input.disciplineId);
        searchResultCount = results.length;
        mentorAction = [
          `Skills matching "${command.payload}":`,
          ...results.map((s) => `- ${s.name} [${s.category}, ${s.level}]`),
        ].join("\n");
        break;
      }
      case "search-cert": {
        const results = searchCertifications(command.payload, input.disciplineId);
        searchResultCount = results.length;
        mentorAction = formatCertificationRoadmap(results, input.disciplineName);
        break;
      }
    }
  }

  if (!mentorAction && !reportAction && isMentorQuery(input.userMessage)) {
    if (!activeWorkspace) {
      const stage = resolveCareerStage(input.userMessage);
      mentorAction = formatCareerGuidance(
        input.disciplineName,
        stage,
        input.disciplineName ?? "Engineering career"
      );
    } else {
      mentorAction = generateCareerReport(
        input.disciplineName,
        activeWorkspace.careerStage,
        activeWorkspace.focusArea,
        activeWorkspace.skillGaps
      );
    }
  }

  const active =
    isMentorQuery(input.userMessage) ||
    activeWorkspace !== null ||
    mentorAction !== null ||
    reportAction !== null;

  const extensionNotes: string[] = [];
  if (extensionHooks.institutionIntegrationId) extensionNotes.push(`Institution: ${extensionHooks.institutionIntegrationId}`);
  if (extensionHooks.corporateLearningId) extensionNotes.push(`Corporate Learning: ${extensionHooks.corporateLearningId}`);
  if (extensionHooks.enterpriseTrainingId) extensionNotes.push(`Enterprise Training: ${extensionHooks.enterpriseTrainingId}`);
  if (extensionHooks.pmisCompetencyModuleId) extensionNotes.push(`PMIS Competency: ${extensionHooks.pmisCompetencyModuleId}`);

  const promptAugmentation = [
    "========================================",
    "Engineering Mentor & Career Intelligence Engine (EMCIE)",
    "========================================",
    "AI Engineering Mentor — NOT a job portal.",
    "",
    mentorAction ? `MENTOR:\n${mentorAction}` : "",
    reportAction ? `REPORT:\n${reportAction}` : "",
    activeWorkspace ? `\nActive workspace: ${activeWorkspace.title} (${activeWorkspace.careerStage})` : "",
    "",
    "EMCIE COMMANDS:",
    "- Start mentor [focus] | Career guidance | Skill gap analysis | Skill matrix",
    "- Learning roadmap [30-day|90-day|6-month|1-year] | Technology roadmap | Industry trends",
    "- Technical interview [topic] | HR interview questions | Mock interview [topic]",
    "- Certification guidance | Career report | Skill report | Interview preparation plan",
    "- Professional development report | Search skills [keyword] | Search certifications [keyword]",
    `\nCatalog: ${CERTIFICATION_CATALOG_SIZE} certifications across engineering disciplines`,
    extensionNotes.length > 0 ? `\nFuture: ${extensionNotes.join("; ")}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    active,
    activeWorkspace,
    mentorAction,
    reportAction,
    searchResultCount,
    promptAugmentation,
    summaryText: [
      active ? "emcie-active" : "",
      activeWorkspace?.focusArea ?? "",
      searchResultCount > 0 ? `${searchResultCount} results` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  };
};

export const formatMentorForPrompt = (result: MentorEngineResult): string =>
  result.promptAugmentation;

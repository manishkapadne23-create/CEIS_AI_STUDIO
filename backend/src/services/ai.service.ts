import crypto from "crypto";

import {
  checkProviderHealth,
  completeToMarkdown,
  completeWithFailover,
  formatNormalizedAsMarkdown,
  getPublicAdminSettings,
  injectContext,
  loadAdminSettings,
} from "../ai/index.js";
import type { AICompletionRequest, NormalizedAIResponse } from "../ai/types.js";
import type { EoeOrchestratorResult } from "../orchestrator/types.js";
import type { EngineeringEvidencePackage } from "../evidence/types.js";
import {
  buildEvidencePromptAugmentation,
  runEngineeringEvidenceEngine,
} from "../evidence/evidenceEngine.js";
import type { PredictiveIntelligencePackage } from "../predictive/types.js";
import type { EmaceCollaborationPackage } from "../agents/types.js";
import type { EdDigitalEngineerPackage } from "../digital-engineer/types.js";
import type { EssaeAssistantPackage } from "../simulation/types.js";
import {
  buildEdeContextFromChat,
  getDigitalEngineerProfile,
  learnFromChatActivity,
} from "./ede.service.js";
import {
  buildEmaceContextFromChat,
  collaborateEngineeringRequest,
  getOrCreateEmacePreferences,
} from "./emace.service.js";
import {
  buildPredictiveContextFromChat,
  getOrCreatePredictivePreferences,
} from "./predictive.service.js";
import { runPredictiveIntelligenceEngine } from "../predictive/predictionEngine.js";
import {
  cacheAiResponse,
  getCachedAiResponse,
} from "../infrastructure/cache/index.js";
import { aiLogger } from "../infrastructure/logger/index.js";
import { analyzeEngineeringRequest } from "./orchestrator.service.js";
import { analyzeSimulationFromChat } from "./essae.service.js";

export interface AIHistoryMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AIChatOptions {
  message: string;
  domainId?: string | null;
  domainName?: string | null;
  specializationId?: string | null;
  specializationName?: string | null;
  history?: AIHistoryMessage[];
  systemPrompt?: string;
  moduleId?: string | null;
  moduleTitle?: string | null;
  projectContext?: string | null;
  language?: string;
  subscriptionPlan?: string;
  memorySummary?: string | null;
  knowledgeReferences?: string[];
  userId?: string;
  conversationId?: string | null;
}

const hashRequest = (request: AICompletionRequest): string =>
  crypto
    .createHash("sha256")
    .update(JSON.stringify(request))
    .digest("hex");

const emptyCollaborationPackage = (): EmaceCollaborationPackage => ({
  engine: "Engineering Multi-Agent Collaboration Engine",
  version: "1.0.0",
  enabled: false,
  executionMode: "sequential",
  preferences: {
    multiAgentEnabled: false,
    manualMode: false,
    enabledAgentIds: [],
    disabledAgentIds: [],
    subscriptionPlan: "free",
  },
  analysis: {
    disciplineId: null,
    disciplineName: null,
    specializationId: null,
    specializationName: null,
    topic: null,
    primaryIntent: "question",
    requiredAgentIds: [],
    participatingAgentIds: [],
    analysisSummary: "",
  },
  agentOutputs: [],
  collaborations: [],
  conflicts: [],
  composedResponse: {
    executiveSummary: "",
    engineeringAnalysis: "",
    applicableStandards: [],
    calculations: [],
    recommendations: [],
    risks: [],
    nextSteps: [],
  },
  promptAugmentation: "",
  generatedAt: new Date().toISOString(),
});

const buildCompletionRequest = (
  options: AIChatOptions,
  orchestration?: EoeOrchestratorResult,
  predictive?: PredictiveIntelligencePackage,
  collaboration?: EmaceCollaborationPackage,
  digitalEngineer?: EdDigitalEngineerPackage,
  simulation?: EssaeAssistantPackage
): AICompletionRequest =>
  injectContext({
    systemPrompt: [
      options.systemPrompt ?? "",
      orchestration?.promptAugmentation ?? "",
      digitalEngineer?.promptAugmentation ?? "",
      collaboration?.promptAugmentation ?? "",
      predictive?.promptAugmentation ?? "",
      simulation?.enabled ? simulation.results.promptAugmentation : "",
      buildEvidencePromptAugmentation(),
    ]
      .filter(Boolean)
      .join("\n\n"),
    userMessage: options.message,
    conversationHistory: options.history,
    disciplineId: orchestration?.context.disciplineId ?? options.domainId,
    disciplineName: orchestration?.context.disciplineName ?? options.domainName,
    specializationId:
      orchestration?.context.specializationId ?? options.specializationId,
    specializationName:
      orchestration?.context.specializationName ?? options.specializationName,
    moduleId:
      orchestration?.primaryRoute?.resolvedModuleId ?? options.moduleId ?? null,
    moduleTitle: options.moduleTitle,
    projectContext: options.projectContext,
    language: options.language,
    subscriptionPlan: options.subscriptionPlan,
    memorySummary: options.memorySummary,
    knowledgeReferences: [
      ...(options.knowledgeReferences ?? []),
      ...((orchestration?.composedResponse.knowledgeReferences ?? []).filter(
        (reference) => typeof reference === "string"
      )),
    ],
  });

export const orchestrateEngineeringRequest = (options: AIChatOptions) =>
  analyzeEngineeringRequest({
    userMessage: options.message,
    disciplineId: options.domainId ?? null,
    disciplineName: options.domainName ?? null,
    specializationId: options.specializationId ?? null,
    specializationName: options.specializationName ?? null,
    moduleId: options.moduleId ?? null,
    projectContext: options.projectContext ?? null,
    conversationHistory: options.history,
    memorySummary: options.memorySummary ?? null,
    subscriptionPlan: options.subscriptionPlan,
    language: options.language,
  });

export const completeAI = async (
  options: AIChatOptions
): Promise<{
  response: NormalizedAIResponse;
  orchestration: EoeOrchestratorResult;
  evidence: EngineeringEvidencePackage;
  predictive: PredictiveIntelligencePackage;
  collaboration: EmaceCollaborationPackage;
  digitalEngineer: EdDigitalEngineerPackage;
  simulation: EssaeAssistantPackage;
}> => {
  const orchestration = await orchestrateEngineeringRequest(options);

  let digitalEngineer: EdDigitalEngineerPackage = {
    engine: "Engineering Digital Engineer",
    version: "1.0.0",
    enabled: false,
    profile: {
      userId: options.userId ?? "",
      primaryDisciplineId: null,
      primaryDisciplineName: null,
      secondaryDisciplineId: null,
      secondaryDisciplineName: null,
      specializationIds: [],
      specializationNames: [],
      yearsOfExperience: null,
      industry: null,
      preferredStandards: [],
      preferredDesignMethods: [],
      preferredUnits: "metric",
      preferredSoftware: [],
      languagePreferences: ["en"],
      workingStyle: {
        frequentlyUsedStandards: [],
        frequentlyUsedCalculators: [],
        frequentlyUsedTemplates: [],
        frequentlyUsedReports: [],
        frequentlyAskedTopics: [],
        preferredAgents: [],
        preferredWorkflows: [],
      },
      expertise: {},
      personalLibrary: {
        favouriteStandards: [],
        favouriteClauses: [],
        favouriteDocuments: [],
        favouriteCalculators: [],
        favouriteTemplates: [],
        favouriteReports: [],
      },
      learningEnabled: false,
      lastActivityAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    adaptation: {
      experienceLevel: "intermediate",
      disciplineId: null,
      disciplineName: null,
      specializationId: null,
      specializationName: null,
      currentWorkspaceId: null,
      currentProjectId: null,
      currentProjectName: null,
      previousDecisions: [],
    },
    skillDevelopment: {
      knowledgeGaps: [],
      recommendedCourses: [],
      suggestedCertifications: [],
      emergingTechnologies: [],
      professionalDevelopmentGoals: [],
    },
    insights: [],
    promptAugmentation: "",
    generatedAt: new Date().toISOString(),
  };

  let collaboration = emptyCollaborationPackage();

  if (options.userId) {
    digitalEngineer = await getDigitalEngineerProfile(
      options.userId,
      buildEdeContextFromChat({
        userId: options.userId,
        disciplineId: orchestration.context.disciplineId ?? options.domainId,
        disciplineName: orchestration.context.disciplineName ?? options.domainName,
        specializationId:
          orchestration.context.specializationId ?? options.specializationId,
        specializationName:
          orchestration.context.specializationName ?? options.specializationName,
        projectName: options.projectContext,
        message: options.message,
      })
    );

    const emacePreferences = await getOrCreateEmacePreferences(
      options.userId,
      options.subscriptionPlan
    );
    collaboration = await collaborateEngineeringRequest(
      buildEmaceContextFromChat({
        userId: options.userId,
        conversationId: options.conversationId,
        message: options.message,
        disciplineId: orchestration.context.disciplineId ?? options.domainId,
        disciplineName: orchestration.context.disciplineName ?? options.domainName,
        specializationId:
          orchestration.context.specializationId ?? options.specializationId,
        specializationName:
          orchestration.context.specializationName ?? options.specializationName,
        primaryIntent: orchestration.intent.primaryIntent,
        subscriptionPlan: options.subscriptionPlan,
      })
    );
    collaboration.preferences = emacePreferences;
  }

  let predictive: PredictiveIntelligencePackage = {
    engine: "Engineering Predictive Intelligence Engine",
    version: "1.0.0",
    enabled: false,
    preferences: {
      predictiveEnabled: false,
      recommendationsEnabled: false,
      timelineEnabled: false,
      remindersEnabled: false,
      riskPredictionEnabled: false,
      learningPredictionEnabled: false,
      projectAwarenessEnabled: false,
      aiCoachEnabled: false,
      shareBehaviorData: false,
    },
    behaviorSummary: {
      disciplineId: null,
      specializationId: null,
      dominantActivity: null,
      signalCount: 0,
    },
    recommendations: [],
    timeline: [],
    reminders: [],
    risks: [],
    learning: [],
    projectInsights: [],
    coach: [],
    promptAugmentation: "",
    generatedAt: new Date().toISOString(),
  };

  if (options.userId) {
    const preferences = await getOrCreatePredictivePreferences(options.userId);
    const context = buildPredictiveContextFromChat({
      userId: options.userId,
      disciplineId: orchestration.context.disciplineId ?? options.domainId,
      disciplineName: orchestration.context.disciplineName ?? options.domainName,
      specializationId:
        orchestration.context.specializationId ?? options.specializationId,
      specializationName:
        orchestration.context.specializationName ?? options.specializationName,
      projectContext: options.projectContext,
      message: options.message,
      history: options.history,
      lastIntent: orchestration.intent.primaryIntent,
      lastTopic: orchestration.context.topic ?? options.message?.slice(0, 80),
    });
    predictive = runPredictiveIntelligenceEngine(context, preferences);
  }

  const simulation = analyzeSimulationFromChat({
    message: options.message,
    disciplineId: orchestration.context.disciplineId ?? options.domainId,
    disciplineName: orchestration.context.disciplineName ?? options.domainName,
    projectContext: options.projectContext,
    primaryIntent: orchestration.intent.primaryIntent,
    moduleId:
      orchestration.primaryRoute?.resolvedModuleId ??
      options.moduleId ??
      null,
  });

  const request = buildCompletionRequest(
    options,
    orchestration,
    predictive,
    collaboration,
    digitalEngineer,
    simulation
  );
  const cacheKey = hashRequest(request);

  const cached = await getCachedAiResponse(cacheKey);
  let response: NormalizedAIResponse;

  if (cached) {
    aiLogger.info("AI cache hit", { cacheKey: cacheKey.slice(0, 12) });
    response = JSON.parse(cached) as NormalizedAIResponse;
  } else {
    response = await completeWithFailover(request, options.userId);
    await cacheAiResponse(cacheKey, JSON.stringify(response));
  }

  const evidence = await runEngineeringEvidenceEngine({
    userMessage: options.message,
    conversationId: options.conversationId ?? null,
    aiResponse: {
      title: response.title,
      summary: response.summary,
      detailedResponse: response.detailedResponse,
      recommendations: response.recommendations,
      standards: response.standards,
      references: response.references,
      providerId: response.providerId,
      model: response.model,
    },
    orchestration: {
      intent: orchestration.intent,
      context: orchestration.context,
      knowledgeReferences: orchestration.composedResponse.knowledgeReferences,
      moduleContributions: orchestration.moduleContributions.map((entry) => ({
        moduleId: entry.moduleId,
        references: entry.references,
      })),
    },
    actorId: options.userId ?? null,
  });

  if (options.userId) {
    void learnFromChatActivity(options.userId, {
      message: options.message,
      disciplineId: orchestration.context.disciplineId ?? options.domainId,
      standards: response.standards,
      agents: collaboration.agentOutputs.map((output) => output.agentId),
    });
  }

  return {
    response,
    orchestration,
    evidence,
    predictive,
    collaboration,
    digitalEngineer,
    simulation,
  };
};

export const getAIResponse = async (
  message: string,
  domainId?: string | null,
  domainName?: string | null,
  history: AIHistoryMessage[] = [],
  userId?: string
): Promise<string> => {
  const { markdown } = await completeToMarkdown(
    buildCompletionRequest(
      { message, domainId, domainName, history },
      await orchestrateEngineeringRequest({
        message,
        domainId,
        domainName,
        history,
      })
    ),
    userId
  );
  return markdown;
};

export const getAIResponseNormalized = async (
  options: AIChatOptions
): Promise<{
  markdown: string;
  response: NormalizedAIResponse;
  orchestration: EoeOrchestratorResult;
  evidence: EngineeringEvidencePackage;
  predictive: PredictiveIntelligencePackage;
  collaboration: EmaceCollaborationPackage;
  digitalEngineer: EdDigitalEngineerPackage;
  simulation: EssaeAssistantPackage;
}> => {
  const { response, orchestration, evidence, predictive, collaboration, digitalEngineer, simulation } =
    await completeAI(options);
  return {
    markdown: formatNormalizedAsMarkdown(response),
    response,
    orchestration,
    evidence,
    predictive,
    collaboration,
    digitalEngineer,
    simulation,
  };
};

export const checkAiProviderHealth = async () => checkProviderHealth();

export const getAIProviderSettings = () =>
  getPublicAdminSettings(loadAdminSettings());

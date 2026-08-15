import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import {
  loadEngineeringContext,
  recordEngineeringMessageTurn,
} from "../context";
import { handleWorkflowMessage, runWorkflowAutomationEngine, type WorkflowAutomationEngineResult } from "../workflows";
import {
  getActiveProject,
  getActiveProjectContextBlock,
  handleProjectMessage,
  recordProjectAITurn,
  recordProjectWorkflow,
} from "../projects";
import {
  formatCopilotForPrompt,
  runCopilotIntelligence,
  type CopilotIntelligenceResult,
} from "../copilot";
import { runAgentEngine } from "../agents";
import type { ActiveAgentContext } from "../agents";
import {
  runDecisionIntelligenceEngine,
  type DecisionIntelligenceResult,
} from "../decision-intelligence";
import {
  runStandardsIntelligenceEngine,
  type StandardsIntelligenceResult,
} from "../standards-intelligence";
import {
  runKnowledgeGraphEngine,
  type KnowledgeGraphResult,
} from "../knowledge-graph";
import {
  runEngineeringMemoryEngine,
  type EngineeringMemoryResult,
} from "../memory";
import {
  runOrchestratorEngine,
  type OrchestratorResult,
} from "../orchestrator";
import {
  provideEngineeringKnowledge,
  type KnowledgeProviderResult,
} from "../knowledge-network";
import {
  runDocumentIntelligenceEngine,
  type DocumentEngineResult,
} from "../documents";
import {
  runComplianceEngine,
  type ComplianceEngineResult,
} from "../compliance";
import { runAuditEngine, type AuditEngineResult } from "../audit";
import {
  recordIntelligenceOutcome,
  runIntelligenceEngine,
  type IntelligenceEngineResult,
} from "../intelligence";
import {
  runAssistantEngine,
  type AssistantEngineResult,
} from "../assistant";
import {
  runMarketplaceEngine,
  type MarketplaceEngineResult,
} from "../marketplace";
import {
  runTemplateEngine,
  type TemplateEngineResult,
} from "../templates";
import {
  runDesignWizard,
  type DesignWizardResult,
} from "../design";
import {
  runEstimationEngine,
  type EstimationEngineResult,
} from "../estimation";
import {
  runTenderEngine,
  type TenderEngineResult,
} from "../tender";
import {
  runContractEngine,
  type ContractEngineResult,
} from "../contracts";
import {
  runResearchEngine,
  type ResearchEngineResult,
} from "../research";
import {
  runMentorEngine,
  type MentorEngineResult,
} from "../mentor";
import {
  runLessonEngine,
  type LessonEngineResult,
} from "../knowledge-capture";
import {
  runExecutionEngine,
  type ExecutionEngineResult,
} from "../site-execution";
import {
  runDashboardEngine,
  type DashboardEngineResult,
} from "../dashboard";
import {
  formatExpertRuntimeContext,
  readSubscriptionPlan,
  readUserLanguage,
  resolveExpertRuntimeContext,
  type EngineeringExpertContextInput,
} from "./contextEngine";
import {
  manageConversationTurn,
  type ConversationTurn,
} from "./conversationManager";
import {
  azureOpenAIProvider,
  claudeProvider,
  geminiProvider,
  localLLMProvider,
  ollamaProvider,
  openAIProvider,
  stubEngineeringAIProvider,
} from "./futureProviders";
import type { DisciplineExpertIntelligence } from "./expertIntelligence";
import {
  buildSarathiExpertSystemPrompt,
  resolveDisciplineExpertIntelligence,
} from "./expertIntelligence";
import {
  registerEngineeringAIProvider,
  type EngineeringAIProviderId,
} from "./providerInterface";
import {
  completeWithProviderFailover,
  initializeProviderManager,
} from "./providerManager";
import {
  collectPluginPromptAugmentations,
  initializePluginManager,
} from "../plugins";
import {
  buildReasoningContextSummary,
  buildSarathiReasoningContext,
} from "./reasoningEngine/buildReasoningContext";

const toConversationTurns = (
  messages: EngineeringExpertContextInput["conversationHistory"]
): ConversationTurn[] =>
  messages
    .filter(
      (message): message is ConversationTurn =>
        message.role === "user" || message.role === "assistant"
    )
    .map((message) => ({
      role: message.role,
      content: message.content,
    }));

let providersInitialized = false;

export const initializeEngineeringAIProviders = (): void => {
  if (providersInitialized) {
    return;
  }

  initializeProviderManager();
  void initializePluginManager();
  registerEngineeringAIProvider(stubEngineeringAIProvider);
  registerEngineeringAIProvider(openAIProvider);
  registerEngineeringAIProvider(ollamaProvider);
  registerEngineeringAIProvider(geminiProvider);
  registerEngineeringAIProvider(claudeProvider);
  registerEngineeringAIProvider(azureOpenAIProvider);
  registerEngineeringAIProvider(localLLMProvider);

  providersInitialized = true;
};

export interface RunEngineeringAIExpertOptions {
  input: EngineeringExpertContextInput;
  workspace: EngineeringWorkspace;
  providerId?: EngineeringAIProviderId;
}

export interface RunEngineeringAIExpertResult {
  content: string;
  systemPrompt: string;
  runtimeContextSummary: string;
  reasoningContextSummary: string;
  providerId: EngineeringAIProviderId;
  followUpIntent: string;
  usedStub: boolean;
  expertIntelligence: DisciplineExpertIntelligence;
  copilotIntelligence: CopilotIntelligenceResult;
  activeAgent: ActiveAgentContext | null;
  decisionSupport: DecisionIntelligenceResult;
  standardsIntelligence: StandardsIntelligenceResult;
  knowledgeGraph: KnowledgeGraphResult;
  engineeringMemory: EngineeringMemoryResult;
  orchestrator: OrchestratorResult;
  knowledgeNetwork: KnowledgeProviderResult;
  documentIntelligence: DocumentEngineResult;
  compliance: ComplianceEngineResult;
  audit: AuditEngineResult;
  intelligence: IntelligenceEngineResult;
  assistant: AssistantEngineResult;
  marketplace: MarketplaceEngineResult;
  templates: TemplateEngineResult;
  workflowAutomation: WorkflowAutomationEngineResult;
  designWizard: DesignWizardResult;
  estimation: EstimationEngineResult;
  tender: TenderEngineResult;
  contracts: ContractEngineResult;
  research: ResearchEngineResult;
  mentor: MentorEngineResult;
  knowledgeCapture: LessonEngineResult;
  siteExecution: ExecutionEngineResult;
  dashboard: DashboardEngineResult;
}

export const runEngineeringAIExpert = async (
  options: RunEngineeringAIExpertOptions
): Promise<RunEngineeringAIExpertResult> => {
  initializeEngineeringAIProviders();

  const input: EngineeringExpertContextInput = {
    ...options.input,
    subscriptionPlan:
      options.input.subscriptionPlan ?? readSubscriptionPlan(),
    language: options.input.language ?? readUserLanguage(),
  };

  const runtimeContext = resolveExpertRuntimeContext(input);

  const workflowHandling = handleWorkflowMessage(
    input.userMessage,
    input.activeDisciplineId,
    input.activeDisciplineName,
    input.conversationId,
    null
  );

  const projectHandling = handleProjectMessage(input.userMessage, {
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    lastMessagePreview: input.userMessage,
  });

  const effectiveUserMessage =
    workflowHandling.assistantResult?.prompt ?? input.userMessage;

  const preSessionContext = loadEngineeringContext({
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    moduleId: input.activeModuleId,
    userMessage: effectiveUserMessage,
    selectedStandard: input.selectedStandard ?? null,
    moduleSearchQuery: input.moduleSearchQuery ?? "",
    isFollowUp: false,
  });

  const conversation = manageConversationTurn(
    input.conversationId,
    toConversationTurns(input.conversationHistory),
    effectiveUserMessage,
    {
      topic:
        preSessionContext.conversation?.topic ??
        preSessionContext.session.currentTopic,
      lastUserMessage: preSessionContext.conversation?.lastUserMessage ?? null,
      lastAssistantSummary:
        preSessionContext.conversation?.lastAssistantSummary ?? null,
    }
  );

  const followUpIntent =
    conversation.detectedIntent !== "none"
      ? conversation.detectedIntent
      : null;

  const sessionContext = loadEngineeringContext({
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    moduleId: input.activeModuleId,
    userMessage: effectiveUserMessage,
    selectedStandard: input.selectedStandard ?? null,
    moduleSearchQuery: input.moduleSearchQuery ?? "",
    isFollowUp: followUpIntent !== null,
  });

  const workflowContextBlock = workflowHandling.context
    ? [
        "",
        "========================================",
        "Workflow Execution State",
        "========================================",
        `Active workflow: ${workflowHandling.context.template.title}`,
        `Status: ${workflowHandling.context.progress.status}`,
        `Step: ${workflowHandling.context.progress.currentStepIndex + 1}/${workflowHandling.context.template.activities.length}`,
        workflowHandling.context.currentActivity
          ? `Current activity: ${workflowHandling.context.currentActivity.title}`
          : "",
        workflowHandling.started
          ? "User just started this workflow — provide step 1 guidance."
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  const copilotIntelligence = runCopilotIntelligence({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
  });

  const agentEngineResult = runAgentEngine({
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    specialization: input.workspaceSpecialization ?? null,
    userMessage: effectiveUserMessage,
  });

  const decisionSupportResult = runDecisionIntelligenceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    followUpIntent,
  });

  const standardsIntelligenceResult = runStandardsIntelligenceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
    selectedStandardId: input.selectedStandard?.id ?? null,
    moduleSearchQuery: input.moduleSearchQuery ?? null,
  });

  const knowledgeGraphResult = runKnowledgeGraphEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const engineeringMemoryResult = runEngineeringMemoryEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
  });

  const orchestratorResult = runOrchestratorEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
    conversationHistory: toConversationTurns(input.conversationHistory),
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    followUpIntent,
    subscriptionPlan: input.subscriptionPlan,
    language: input.language,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const knowledgeNetworkResult = provideEngineeringKnowledge({
    userMessage: effectiveUserMessage,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
    conversationId: input.conversationId,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const activeProject = getActiveProject();
  const documentIntelligenceResult = runDocumentIntelligenceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectId: activeProject?.id ?? null,
    projectName: activeProject?.name ?? null,
    activeDocumentIds: preSessionContext.session.activeDocumentIds,
  });

  const complianceResult = runComplianceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
    projectName: activeProject?.name ?? null,
  });

  const auditResult = runAuditEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const intelligenceResult = runIntelligenceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    activeModuleId: input.activeModuleId,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    orchestratorIntent: orchestratorResult.classification.primaryIntent,
    language: input.language,
  });

  const assistantResult = runAssistantEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
  });

  const marketplaceResult = runMarketplaceEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
  });

  const templateResult = runTemplateEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const workflowAutomationResult = runWorkflowAutomationEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
  });

  const designWizardResult = runDesignWizard({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
    selectedStandardCode: input.selectedStandard?.codeNumber ?? null,
  });

  const estimationResult = runEstimationEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
  });

  const tenderResult = runTenderEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
  });

  const contractResult = runContractEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
  });

  const researchResult = runResearchEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
  });

  const mentorResult = runMentorEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
  });

  const knowledgeCaptureResult = runLessonEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
  });

  const siteExecutionResult = runExecutionEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    projectName: activeProject?.name ?? null,
  });

  const dashboardResult = runDashboardEngine({
    userMessage: effectiveUserMessage,
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
  });

  const copilotContextBlock = formatCopilotForPrompt(copilotIntelligence);

  const projectContextBlock = [
    getActiveProjectContextBlock(),
    projectHandling.created
      ? `New project created: ${projectHandling.project?.name}`
      : "",
    projectHandling.switched
      ? `Switched to project: ${projectHandling.project?.name}`
      : "",
    projectHandling.memorySummary ?? "",
  ]
    .filter(Boolean)
    .join("\n\n");

  const reasoningContext = buildSarathiReasoningContext({
    input,
    workspace: options.workspace,
    selectedStandard: input.selectedStandard ?? null,
    moduleSearchQuery: input.moduleSearchQuery ?? "",
    followUpIntent,
    sessionMemory: sessionContext,
  });

  const expertIntelligence = reasoningContext.expertIntelligence;

  const baseSystemPrompt = buildSarathiExpertSystemPrompt(
    runtimeContext,
    expertIntelligence
  );
  const reasoningSummary = buildReasoningContextSummary(reasoningContext);
  const systemPrompt = [
    baseSystemPrompt,
    "",
    "========================================",
    "Sarathi Reasoning Context (auto-resolved)",
    "========================================",
    reasoningSummary,
    "",
    knowledgeNetworkResult.promptAugmentation
      ? `\n${knowledgeNetworkResult.promptAugmentation}`
      : "",
    orchestratorResult.promptAugmentation
      ? `\n${orchestratorResult.promptAugmentation}`
      : "",
    documentIntelligenceResult.active
      ? `\n${documentIntelligenceResult.promptAugmentation}`
      : "",
    complianceResult.active
      ? `\n${complianceResult.promptAugmentation}`
      : "",
    auditResult.active ? `\n${auditResult.promptAugmentation}` : "",
    `\n${intelligenceResult.promptAugmentation}`,
    assistantResult.active
      ? `\n${assistantResult.promptAugmentation}`
      : "",
    marketplaceResult.active
      ? `\n${marketplaceResult.promptAugmentation}`
      : "",
    templateResult.active
      ? `\n${templateResult.promptAugmentation}`
      : "",
    workflowAutomationResult.active
      ? `\n${workflowAutomationResult.promptAugmentation}`
      : "",
    designWizardResult.active
      ? `\n${designWizardResult.promptAugmentation}`
      : "",
    estimationResult.active
      ? `\n${estimationResult.promptAugmentation}`
      : "",
    tenderResult.active
      ? `\n${tenderResult.promptAugmentation}`
      : "",
    contractResult.active
      ? `\n${contractResult.promptAugmentation}`
      : "",
    researchResult.active
      ? `\n${researchResult.promptAugmentation}`
      : "",
    mentorResult.active
      ? `\n${mentorResult.promptAugmentation}`
      : "",
    knowledgeCaptureResult.active
      ? `\n${knowledgeCaptureResult.promptAugmentation}`
      : "",
    siteExecutionResult.active
      ? `\n${siteExecutionResult.promptAugmentation}`
      : "",
    dashboardResult.active
      ? `\n${dashboardResult.promptAugmentation}`
      : "",
    sessionContext.memorySummary,
    agentEngineResult.promptAugmentation
      ? `\n${agentEngineResult.promptAugmentation}`
      : "",
    decisionSupportResult.active
      ? `\n${decisionSupportResult.promptAugmentation}`
      : "",
    standardsIntelligenceResult.active
      ? `\n${standardsIntelligenceResult.promptAugmentation}`
      : "",
    knowledgeGraphResult.active
      ? `\n${knowledgeGraphResult.promptAugmentation}`
      : "",
    engineeringMemoryResult.active
      ? `\n${engineeringMemoryResult.promptAugmentation}`
      : "",
    workflowContextBlock,
    "",
    copilotContextBlock,
    projectContextBlock ? `\n${projectContextBlock}` : "",
  ].join("\n");

  const pluginAugmentations = await collectPluginPromptAugmentations({
    userMessage: conversation.augmentedUserMessage,
    disciplineId: input.activeDisciplineId,
    moduleId: input.activeModuleId,
  });

  const finalSystemPrompt = [
    systemPrompt,
    pluginAugmentations.length > 0
      ? [
          "",
          "========================================",
          "Plugin Extensions (sandboxed)",
          "========================================",
          pluginAugmentations.join("\n"),
        ].join("\n")
      : "",
  ].join("\n");

  const runtimeContextSummary = formatExpertRuntimeContext(runtimeContext);

  const response = await completeWithProviderFailover(
    {
      systemPrompt: finalSystemPrompt,
      userMessage: conversation.augmentedUserMessage,
      conversationHistory: conversation.history,
      runtimeContext,
      expertIntelligence,
      workspace: options.workspace,
      followUpIntent,
    },
    options.providerId
  );

  recordEngineeringMessageTurn({
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    moduleId: input.activeModuleId,
    userMessage: input.userMessage,
    assistantContent: response.content,
    isFollowUp: followUpIntent !== null,
    selectedStandard: input.selectedStandard ?? null,
    moduleSearchQuery: input.moduleSearchQuery ?? "",
  });

  recordIntelligenceOutcome({
    userMessage: input.userMessage,
    assistantPreview: response.content.slice(0, 200),
    conversationId: input.conversationId,
    disciplineId: input.activeDisciplineId,
    disciplineName: input.activeDisciplineName,
    moduleId: input.activeModuleId,
    sessionTopic:
      preSessionContext.conversation?.topic ??
      preSessionContext.session.currentTopic,
    standardsUsed: copilotIntelligence.suggestions
      .filter((s) => s.category === "standards")
      .map((s) => s.title),
    calculatorsUsed: copilotIntelligence.suggestions
      .filter((s) => s.category === "calculators")
      .map((s) => s.title),
    workflowsUsed: copilotIntelligence.suggestions
      .filter((s) => s.category === "workflows")
      .map((s) => s.title),
  });

  if (projectHandling.project) {
    recordProjectAITurn({
      projectId: projectHandling.project.id,
      userMessage: input.userMessage,
      assistantContent: response.content,
      conversationId: input.conversationId,
      standards: copilotIntelligence.suggestions
        .filter((s) => s.category === "standards")
        .map((s) => s.title),
      copilotSuggestions: copilotIntelligence.suggestions.slice(0, 6),
    });

    if (workflowHandling.context) {
      recordProjectWorkflow(projectHandling.project.id, {
        workflowId: workflowHandling.context.template.id,
        workflowTitle: workflowHandling.context.template.title,
        status: workflowHandling.context.progress.status,
        currentStep: workflowHandling.context.currentActivity?.title ?? null,
        updatedAt: Date.now(),
      });
    }
  }

  return {
    content: response.content,
    systemPrompt,
    runtimeContextSummary,
    reasoningContextSummary: reasoningSummary,
    providerId: response.providerId,
    followUpIntent: conversation.detectedIntent,
    usedStub: response.usedStub,
    expertIntelligence,
    copilotIntelligence,
    activeAgent: agentEngineResult.activeContext,
    decisionSupport: decisionSupportResult,
    standardsIntelligence: standardsIntelligenceResult,
    knowledgeGraph: knowledgeGraphResult,
    engineeringMemory: engineeringMemoryResult,
    orchestrator: orchestratorResult,
    knowledgeNetwork: knowledgeNetworkResult,
    documentIntelligence: documentIntelligenceResult,
    compliance: complianceResult,
    audit: auditResult,
    intelligence: intelligenceResult,
    assistant: assistantResult,
    marketplace: marketplaceResult,
    templates: templateResult,
    workflowAutomation: workflowAutomationResult,
    designWizard: designWizardResult,
    estimation: estimationResult,
    tender: tenderResult,
    contracts: contractResult,
    research: researchResult,
    mentor: mentorResult,
    knowledgeCapture: knowledgeCaptureResult,
    siteExecution: siteExecutionResult,
    dashboard: dashboardResult,
  };
};

export const buildEngineeringExpertContextPayload = (
  input: EngineeringExpertContextInput,
  workspace?: EngineeringWorkspace
): {
  systemPrompt: string;
  runtimeContextSummary: string;
  augmentedUserMessage: string;
} => {
  const resolvedInput = {
    ...input,
    subscriptionPlan: input.subscriptionPlan ?? readSubscriptionPlan(),
    language: input.language ?? readUserLanguage(),
  };

  const runtimeContext = resolveExpertRuntimeContext(resolvedInput);

  const conversation = manageConversationTurn(
    input.conversationId,
    toConversationTurns(input.conversationHistory),
    input.userMessage
  );

  const expertIntelligence = resolveDisciplineExpertIntelligence(
    runtimeContext,
    conversation.augmentedUserMessage
  );

  let systemPrompt = buildSarathiExpertSystemPrompt(
    runtimeContext,
    expertIntelligence
  );

  if (workspace) {
    const reasoningContext = buildSarathiReasoningContext({
      input: resolvedInput,
      workspace,
      selectedStandard: input.selectedStandard ?? null,
      moduleSearchQuery: input.moduleSearchQuery ?? "",
    });
    systemPrompt = [
      systemPrompt,
      "",
      buildReasoningContextSummary(reasoningContext),
    ].join("\n");
  }

  return {
    systemPrompt,
    runtimeContextSummary: formatExpertRuntimeContext(runtimeContext),
    augmentedUserMessage: conversation.augmentedUserMessage,
  };
};

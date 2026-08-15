import { resolveParticipatingAgents } from "./agentManager.js";
import { analyzeCollaborationRequest } from "./agentOrchestrator.js";
import { executeAgentsSequentially } from "./agentExecution.js";
import { runAgentCollaboration } from "./agentCommunication.js";
import { buildSessionMemory } from "./agentMemory.js";
import { detectConflicts } from "./conflictResolver.js";
import {
  buildCollaborationPromptAugmentation,
  composeCollaborativeResponse,
} from "./responseComposer.js";
import { getEmacePublicConfig } from "./loadAgentConfig.js";
import type {
  EmaceCollaborationInput,
  EmaceCollaborationPackage,
  EmaceUserPreferencesSnapshot,
} from "./types.js";

const ENGINE_VERSION = "1.0.0";

const defaultPreferences = (): EmaceUserPreferencesSnapshot => ({
  multiAgentEnabled: true,
  manualMode: false,
  enabledAgentIds: [],
  disabledAgentIds: [],
  subscriptionPlan: "free",
});

const emptyPackage = (
  preferences: EmaceUserPreferencesSnapshot
): EmaceCollaborationPackage => ({
  engine: "Engineering Multi-Agent Collaboration Engine",
  version: ENGINE_VERSION,
  enabled: false,
  executionMode: "sequential",
  preferences,
  analysis: {
    disciplineId: null,
    disciplineName: null,
    specializationId: null,
    specializationName: null,
    topic: null,
    primaryIntent: "question",
    requiredAgentIds: [],
    participatingAgentIds: [],
    analysisSummary: "Multi-agent collaboration disabled.",
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

export const runEmaceCollaborationEngine = (
  input: EmaceCollaborationInput
): EmaceCollaborationPackage => {
  const preferences = input.preferences ?? defaultPreferences();

  if (!preferences.multiAgentEnabled) {
    return emptyPackage(preferences);
  }

  const analysis = analyzeCollaborationRequest(input);

  const manualAgentIds =
    preferences.manualMode && input.manualAgentIds?.length
      ? input.manualAgentIds
      : preferences.manualMode && preferences.enabledAgentIds.length > 0
        ? preferences.enabledAgentIds
        : null;

  const participatingAgentIds = manualAgentIds
    ? resolveParticipatingAgents(manualAgentIds, preferences)
    : resolveParticipatingAgents(analysis.requiredAgentIds, preferences);

  analysis.participatingAgentIds = participatingAgentIds;

  const agentOutputs = executeAgentsSequentially(
    participatingAgentIds,
    analysis,
    input
  );

  const collaborations = runAgentCollaboration(agentOutputs);
  const conflicts = detectConflicts(analysis, agentOutputs, collaborations);
  const composedResponse = composeCollaborativeResponse({
    userMessage: input.userMessage,
    analysis,
    agentOutputs,
    conflicts,
    collaborationInput: input,
  });

  const sessionMemory = buildSessionMemory(analysis, agentOutputs);

  const pkg: EmaceCollaborationPackage = {
    engine: "Engineering Multi-Agent Collaboration Engine",
    version: ENGINE_VERSION,
    enabled: true,
    executionMode: "sequential",
    preferences,
    analysis,
    agentOutputs,
    collaborations,
    conflicts,
    composedResponse,
    promptAugmentation: "",
    generatedAt: new Date().toISOString(),
  };

  pkg.promptAugmentation = buildCollaborationPromptAugmentation({
    analysis,
    agentOutputs,
    composedResponse,
    conflicts,
  });

  void sessionMemory;

  return pkg;
};

export const getEmaceEngineConfig = () => getEmacePublicConfig();

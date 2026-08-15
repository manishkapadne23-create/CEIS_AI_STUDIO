import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import type { EmaceAgentDefinition } from "./types.js";

const configDir = join(dirname(fileURLToPath(import.meta.url)), "config");

const readJson = <T>(fileName: string): T =>
  JSON.parse(readFileSync(join(configDir, fileName), "utf-8")) as T;

export const loadDefaultAgents = (): EmaceAgentDefinition[] =>
  readJson<{ agents: EmaceAgentDefinition[] }>("defaultAgents.json").agents;

export const loadAgentRoutingRules = () =>
  readJson<{
    intentAgentMap: Record<string, string[]>;
    keywordAgentMap: Array<{
      patterns: string[];
      agents: string[];
      disciplineId?: string;
      disciplineName?: string;
      specializationId?: string;
      specializationName?: string;
    }>;
    defaultAgents: string[];
  }>("agentRoutingRules.json");

export const loadCollaborationRules = () =>
  readJson<{
    collaborationActions: Array<{
      id: string;
      label: string;
      fromRoles: string[];
      toRoles: string[];
    }>;
    validationPairs: Array<{ validator: string; validates: string[] }>;
  }>("collaborationRules.json");

export const loadConflictPatterns = () =>
  readJson<{
    conflictScenarios: Array<{
      id: string;
      agents: string[];
      topicPatterns: string[];
      optionA: {
        label: string;
        agentId: string;
        advantages: string[];
        limitations: string[];
      };
      optionB: {
        label: string;
        agentId: string;
        advantages: string[];
        limitations: string[];
      };
      applicableStandards: string[];
    }>;
  }>("conflictPatterns.json");

export const loadSubscriptionTiers = () =>
  readJson<{
    tiers: Record<
      string,
      { maxAgentsPerRequest: number; allowedAgentIds: string[] | "all" }
    >;
    futureReady: string[];
  }>("subscriptionTiers.json");

export const getEmacePublicConfig = () => ({
  engine: "Engineering Multi-Agent Collaboration Engine",
  version: "1.0.0",
  agents: loadDefaultAgents(),
  collaborationRules: loadCollaborationRules(),
  subscriptionTiers: loadSubscriptionTiers(),
  executionModes: ["sequential", "parallel"],
  defaultExecutionMode: "sequential" as const,
  futureReady: loadSubscriptionTiers().futureReady,
  security: {
    respectsUserPermissions: true,
    respectsSubscriptionPlan: true,
    respectsKnowledgeAccess: true,
    auditLogging: true,
  },
});

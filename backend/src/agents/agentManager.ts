import { loadSubscriptionTiers } from "./loadAgentConfig.js";
import { filterAgentsBySubscription, getAgentById } from "./agentRegistry.js";
import type { EmaceUserPreferencesSnapshot } from "./types.js";

export const resolveParticipatingAgents = (
  requiredAgentIds: string[],
  preferences: EmaceUserPreferencesSnapshot
): string[] => {
  if (!preferences.multiAgentEnabled) {
    return ["engineering-expert"];
  }

  let agentIds = [...new Set(requiredAgentIds)];

  if (preferences.manualMode && preferences.enabledAgentIds.length > 0) {
    agentIds = preferences.enabledAgentIds;
  }

  if (preferences.disabledAgentIds.length > 0) {
    agentIds = agentIds.filter(
      (agentId) => !preferences.disabledAgentIds.includes(agentId)
    );
  }

  const plan = preferences.subscriptionPlan || "free";
  agentIds = filterAgentsBySubscription(agentIds, plan);

  const tier = loadSubscriptionTiers().tiers[plan] ?? loadSubscriptionTiers().tiers.free;
  const maxAgents = tier.maxAgentsPerRequest;

  if (tier.allowedAgentIds !== "all") {
    agentIds = agentIds.filter((agentId) =>
      tier.allowedAgentIds.includes(agentId)
    );
  }

  return agentIds
    .sort((left, right) => {
      const leftPriority = getAgentById(left)?.priority ?? 0;
      const rightPriority = getAgentById(right)?.priority ?? 0;
      return rightPriority - leftPriority;
    })
    .slice(0, maxAgents);
};

export const buildAgentManagerSummary = (
  participatingAgentIds: string[],
  preferences: EmaceUserPreferencesSnapshot
) => ({
  multiAgentEnabled: preferences.multiAgentEnabled,
  manualMode: preferences.manualMode,
  subscriptionPlan: preferences.subscriptionPlan,
  participatingCount: participatingAgentIds.length,
  participatingAgents: participatingAgentIds.map((agentId) => {
    const agent = getAgentById(agentId);
    return {
      id: agentId,
      name: agent?.name ?? agentId,
      role: agent?.role ?? "specialist",
      enabled: !preferences.disabledAgentIds.includes(agentId),
    };
  }),
});

import type { EngineeringWorkspace } from "../context/EngineeringWorkspaceContext";
import { buildAIRequestMessage } from "../ai/engineeringContextEngine";

export const buildEngineeringContext = (
  workspace: EngineeringWorkspace,
  userPrompt: string
): string => buildAIRequestMessage(workspace, userPrompt);

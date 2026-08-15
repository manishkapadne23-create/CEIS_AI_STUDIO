import type { EngineeringNode } from "../../data/engineeringTree";
import type { ChatEngineeringContext } from "../../navigation/ChatSessionContext";
import { getNavigatorSpecializations } from "./navigatorTree";

export const buildChatEngineeringContext = (input: {
  disciplineId: string | null;
  disciplineName: string | null;
  specializationId: string | null;
  specializationName: string | null;
}): ChatEngineeringContext => ({
  disciplineId: input.disciplineId,
  disciplineName: input.disciplineName,
  specializationId: input.specializationId,
  specializationName: input.specializationName,
});

export const resolveSpecializationPath = (
  disciplineId: string,
  disciplineName: string,
  specializationId: string
): EngineeringNode[] | null => {
  const specializations = getNavigatorSpecializations(disciplineId, disciplineName);
  const match = specializations.find(
    (entry) => entry.node.id === specializationId
  );
  return match?.path ?? null;
};

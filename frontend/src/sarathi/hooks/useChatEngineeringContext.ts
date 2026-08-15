import { useEffect, useRef } from "react";

import { useChatSession } from "../../navigation/ChatSessionContext";
import { disciplineIdToSlug } from "../../navigation/disciplineSlugs";
import { useWorkspaceNavigation } from "../../navigation/WorkspaceNavigationContext";
import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";
import {
  buildChatEngineeringContext,
  resolveSpecializationPath,
} from "../utils/chatEngineeringContext";

export const useChatEngineeringContext = () => {
  const {
    activeDiscipline,
    activeSpecialization,
    selectDiscipline,
    selectSpecialization,
  } = useSarathiWorkspace();
  const { chats, currentChatId, updateChatMeta } = useChatSession();
  const { updateWorkspace } = useWorkspaceNavigation();
  const isRestoringRef = useRef(false);
  const lastRestoredChatIdRef = useRef<string | null>(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId) ?? null;

  useEffect(() => {
    lastRestoredChatIdRef.current = null;
  }, [currentChatId]);

  useEffect(() => {
    if (!currentChatId || !currentChat) {
      return;
    }

    if (lastRestoredChatIdRef.current === currentChatId) {
      return;
    }

    const context = currentChat.engineeringContext;

    isRestoringRef.current = true;

    if (!context?.disciplineId) {
      lastRestoredChatIdRef.current = currentChatId;
      window.setTimeout(() => {
        isRestoringRef.current = false;
      }, 0);
      return;
    }

    if (
      activeDiscipline?.id !== context.disciplineId &&
      context.disciplineName
    ) {
      selectDiscipline(context.disciplineId, context.disciplineName);
    }

    if (context.specializationId && context.disciplineName) {
      const path = resolveSpecializationPath(
        context.disciplineId,
        context.disciplineName,
        context.specializationId
      );

      if (
        path &&
        activeSpecialization?.id !== context.specializationId
      ) {
        selectSpecialization(path);
      }
    }

    lastRestoredChatIdRef.current = currentChatId;
    window.setTimeout(() => {
      isRestoringRef.current = false;
    }, 0);
  }, [
    activeDiscipline?.id,
    activeSpecialization?.id,
    currentChat,
    currentChatId,
    selectDiscipline,
    selectSpecialization,
  ]);

  useEffect(() => {
    if (!currentChatId || isRestoringRef.current) {
      return;
    }

    const nextContext = buildChatEngineeringContext({
      disciplineId: activeDiscipline?.id ?? null,
      disciplineName: activeDiscipline?.name ?? null,
      specializationId: activeSpecialization?.id ?? null,
      specializationName: activeSpecialization?.name ?? null,
    });

    const stored = currentChat?.engineeringContext;
    const unchanged =
      stored?.disciplineId === nextContext.disciplineId &&
      stored?.disciplineName === nextContext.disciplineName &&
      stored?.specializationId === nextContext.specializationId &&
      stored?.specializationName === nextContext.specializationName;

    if (unchanged) {
      return;
    }

    updateChatMeta(currentChatId, (chat) => ({
      ...chat,
      engineeringContext: nextContext,
    }));

    updateWorkspace({
      disciplineId: nextContext.disciplineId,
      disciplineSlug: nextContext.disciplineId
        ? disciplineIdToSlug(nextContext.disciplineId)
        : null,
      specializationId: nextContext.specializationId,
      specializationName: nextContext.specializationName,
    });
  }, [
    activeDiscipline,
    activeSpecialization,
    currentChat?.engineeringContext,
    currentChatId,
    updateChatMeta,
    updateWorkspace,
  ]);
};

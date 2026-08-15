import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

import type { WorkspaceCategoryId } from "../workspace/utils/workspaceCategoryConfig";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";
import { getNavigatorSpecializations } from "../sarathi/utils/navigatorTree";
import {
  disciplineSlugToId,
  getDisciplineNameFromSlug,
  isValidModuleId,
} from "./disciplineSlugs";
import { useWorkspaceNavigation } from "./WorkspaceNavigationContext";

/**
 * Syncs /chat/:disciplineSlug URL params into workspace state (URL → state only).
 * Does not push redirects — avoids fighting ChatPage or sidebar navigation.
 */
export const useChatRouteSync = () => {
  const { disciplineSlug, moduleId } = useParams<{
    disciplineSlug?: string;
    moduleId?: string;
  }>();
  const {
    selectDiscipline,
    selectSpecialization,
    openModule,
    closeModule,
    activeDiscipline,
    activeSpecialization,
    activeModuleId,
  } = useSarathiWorkspace();
  const {
    updateWorkspace,
    specializationId: savedSpecializationId,
    specializationName: savedSpecializationName,
  } = useWorkspaceNavigation();

  const appliedSlugRef = useRef<string | null>(null);

  useEffect(() => {
    if (!disciplineSlug) {
      appliedSlugRef.current = null;
      return;
    }

    const disciplineId = disciplineSlugToId(disciplineSlug);
    const disciplineName = getDisciplineNameFromSlug(disciplineSlug);

    if (!disciplineId || !disciplineName) {
      return;
    }

    if (appliedSlugRef.current !== disciplineSlug) {
      if (
        activeDiscipline?.id !== disciplineId ||
        activeDiscipline.name !== disciplineName
      ) {
        selectDiscipline(disciplineId, disciplineName);
      }
      appliedSlugRef.current = disciplineSlug;
    }

    if (
      savedSpecializationId &&
      savedSpecializationName &&
      activeSpecialization?.id !== savedSpecializationId
    ) {
      const specs = getNavigatorSpecializations(disciplineId, disciplineName);
      const match = specs.find(
        (entry) => entry.node.id === savedSpecializationId
      );
      if (match) {
        selectSpecialization(match.path);
      }
    }

    updateWorkspace({
      disciplineId,
      disciplineSlug,
      moduleId:
        moduleId && isValidModuleId(moduleId)
          ? (moduleId as WorkspaceCategoryId)
          : null,
    });

    if (moduleId) {
      if (!isValidModuleId(moduleId)) {
        return;
      }
      if (activeModuleId !== moduleId) {
        openModule(moduleId as WorkspaceCategoryId);
      }
    } else if (activeModuleId) {
      closeModule();
    }
  }, [
    activeDiscipline?.id,
    activeDiscipline?.name,
    activeModuleId,
    activeSpecialization?.id,
    closeModule,
    disciplineSlug,
    moduleId,
    openModule,
    savedSpecializationId,
    savedSpecializationName,
    selectDiscipline,
    selectSpecialization,
    updateWorkspace,
  ]);

  return { disciplineSlug, moduleId };
};

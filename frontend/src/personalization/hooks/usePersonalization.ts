import { useCallback, useMemo, useState } from "react";

import { buildPersonalizedHome } from "../recommendationEngine";
import { getEngineeringProfile, updateEngineeringProfile } from "../profileEngine";
import { getUserPreferences, updateUserPreferences } from "../preferencesManager";
import { getDisciplineMemory } from "../disciplineMemory";
import { getRecentActivity } from "../activityTracker";
import { getUnifiedFavorites } from "../favoritesManager";
import { getQuickAccessBookmarks } from "../bookmarkManager";
import type { EngineeringUserProfile, UserPreferences } from "../types";

export const usePersonalization = (disciplineId?: string | null) => {
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const profile = useMemo(() => getEngineeringProfile(), [version]);
  const preferences = useMemo(() => getUserPreferences(), [version]);
  const memory = useMemo(() => getDisciplineMemory(), [version]);
  const home = useMemo(
    () => buildPersonalizedHome(disciplineId ?? profile.primaryDisciplineId),
    [disciplineId, profile.primaryDisciplineId, version]
  );
  const favorites = useMemo(() => getUnifiedFavorites(), [version]);
  const activity = useMemo(() => getRecentActivity(), [version]);
  const quickAccess = useMemo(() => getQuickAccessBookmarks(), [version]);

  const saveProfile = useCallback(
    (patch: Partial<EngineeringUserProfile>) => {
      updateEngineeringProfile(patch);
      refresh();
    },
    [refresh]
  );

  const savePreferences = useCallback(
    (patch: Partial<UserPreferences>) => {
      updateUserPreferences(patch);
      refresh();
    },
    [refresh]
  );

  return {
    profile,
    preferences,
    memory,
    home,
    favorites,
    activity,
    quickAccess,
    saveProfile,
    savePreferences,
    refresh,
  };
};

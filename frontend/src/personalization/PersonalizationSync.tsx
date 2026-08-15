import { useEffect } from "react";
import { useLocation } from "react-router-dom";

import { trackActivity } from "../personalization/activityTracker";
import { rememberModuleSelection, rememberRecentSearch } from "../personalization/disciplineMemory";
import { syncProfileDiscipline } from "../personalization/profileEngine";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";

const PersonalizationSync: React.FC = () => {
  const location = useLocation();
  const { activeDiscipline, activeModuleId } = useSarathiWorkspace();

  useEffect(() => {
    if (activeDiscipline) {
      syncProfileDiscipline(activeDiscipline.id, activeDiscipline.name);
    }
  }, [activeDiscipline]);

  useEffect(() => {
    if (activeModuleId) {
      rememberModuleSelection(activeModuleId);
    }
  }, [activeModuleId]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    if (location.pathname.startsWith("/search") && query) {
      rememberRecentSearch(query);
      trackActivity({
        type: "search",
        title: query,
        resourceId: query,
        disciplineId: activeDiscipline?.id ?? null,
      });
    }
  }, [activeDiscipline?.id, location.pathname, location.search]);

  useEffect(() => {
    if (location.pathname.startsWith("/chat")) {
      trackActivity({
        type: "chat",
        title: "AI Chat workspace",
        resourceId: activeModuleId,
        disciplineId: activeDiscipline?.id ?? null,
      });
    }
  }, [activeDiscipline?.id, activeModuleId, location.pathname]);

  return null;
};

export default PersonalizationSync;

import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { getChatRouteFromWorkspace, getDashboardRouteFromWorkspace } from "./disciplineSlugs";
import { PERSISTED_KEYS, writePersistedString } from "../utils/persistedState";
import {
  getMenuIdFromPath,
  getRouteForMenu,
  type SidebarMenuId,
} from "./sidebarRoutes";

export const useSidebarNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeMenu = getMenuIdFromPath(location.pathname);

  useEffect(() => {
    writePersistedString(PERSISTED_KEYS.lastSidebarRoute, location.pathname);
  }, [location.pathname]);

  const navigateToMenu = useCallback(
    (menuId: SidebarMenuId) => {
      const route =
        menuId === "chat"
          ? getChatRouteFromWorkspace()
          : menuId === "dashboard"
            ? getDashboardRouteFromWorkspace()
            : getRouteForMenu(menuId);
      if (location.pathname !== route) {
        navigate(route);
      }
    },
    [location.pathname, navigate]
  );

  return { activeMenu, navigateToMenu };
};

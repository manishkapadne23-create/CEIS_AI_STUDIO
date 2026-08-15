/** Four-column application shell layout (Sprint 20.7). */
export const APP_NAV_EXPANDED_WIDTH = "260px";
export const APP_NAV_COLLAPSED_WIDTH = "72px";
export const ENGINEERING_NAVIGATOR_WIDTH = "320px";
export const MODULE_PREVIEW_EXPANDED_WIDTH = "300px";
export const MODULE_PREVIEW_COLLAPSED_WIDTH = "48px";

/** @deprecated Use MODULE_PREVIEW_EXPANDED_WIDTH */
export const MODULE_PREVIEW_WIDTH = MODULE_PREVIEW_EXPANDED_WIDTH;

export const getAppShellGridColumns = (
  navCollapsed: boolean,
  includeWorkspacePanels = true,
  modulePanelCollapsed = true
): string => {
  const navWidth = navCollapsed
    ? APP_NAV_COLLAPSED_WIDTH
    : APP_NAV_EXPANDED_WIDTH;

  if (!includeWorkspacePanels) {
    return `${navWidth} minmax(0, 1fr)`;
  }

  const modulePanelWidth = modulePanelCollapsed
    ? MODULE_PREVIEW_COLLAPSED_WIDTH
    : MODULE_PREVIEW_EXPANDED_WIDTH;

  return `${navWidth} ${ENGINEERING_NAVIGATOR_WIDTH} minmax(0, 1fr) ${modulePanelWidth}`;
};

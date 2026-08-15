import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { buildGlobalBreadcrumbs, type BreadcrumbSegment } from "../navigation/breadcrumbs";
import { useWorkspaceNavigation } from "../navigation/WorkspaceNavigationContext";

interface GlobalBreadcrumbProps {
  segments?: BreadcrumbSegment[];
  showBackButton?: boolean;
}

const GlobalBreadcrumb: React.FC<GlobalBreadcrumbProps> = ({
  segments,
  showBackButton = true,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { moduleId, engineeringHubSection } = useWorkspaceNavigation();
  const crumbs =
    segments ??
    buildGlobalBreadcrumbs(location.pathname, {
      moduleId,
      hubSection: engineeringHubSection,
    });

  const handleBack = () => {
    const parent = crumbs.length > 1 ? crumbs[crumbs.length - 2] : null;
    if (parent?.path && parent.path !== location.pathname) {
      navigate(parent.path);
      return;
    }
    navigate(-1);
  };

  return (
    <div className="flex items-center gap-3 border-b border-slate-800/80 bg-slate-900/50 px-4 py-2.5 sm:px-6">
      {showBackButton ? (
        <button
          type="button"
          onClick={handleBack}
          className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-xs text-slate-300 transition hover:bg-slate-800"
          aria-label="Go back"
        >
          ← Back
        </button>
      ) : null}
      <nav
        aria-label="Global breadcrumb"
        className="flex min-w-0 flex-1 flex-wrap items-center gap-1 text-sm text-slate-400"
      >
        {crumbs.map((segment, index) => (
          <React.Fragment key={`${segment.label}-${index}`}>
            {index > 0 ? (
              <span className="text-slate-600" aria-hidden="true">
                /
              </span>
            ) : null}
            {segment.path && index < crumbs.length - 1 ? (
              <Link
                to={segment.path}
                className="truncate transition hover:text-cyan-300"
              >
                {segment.label}
              </Link>
            ) : (
              <span
                className={`truncate ${
                  index === crumbs.length - 1
                    ? "font-medium text-white"
                    : "text-slate-400"
                }`}
              >
                {segment.label}
              </span>
            )}
          </React.Fragment>
        ))}
      </nav>
    </div>
  );
};

export default GlobalBreadcrumb;

import React from "react";

interface WorkspacePanelHeaderProps {
  label: string;
  title: string;
  description?: string;
  icon?: string;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

const WorkspacePanelHeader: React.FC<WorkspacePanelHeaderProps> = ({
  label,
  title,
  description,
  icon,
  action,
  footer,
}) => (
  <div className="shrink-0 border-b border-slate-800 bg-slate-950/90 px-3 py-2.5">
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2.5">
        {icon ? (
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-lg"
            aria-hidden="true"
          >
            {icon}
          </span>
        ) : null}
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-cyan-400/90">
            {label}
          </p>
          <h2 className="workspace-card-title mt-0.5 text-sm font-semibold text-white">
            {title}
          </h2>
          {description ? (
            <p className="mt-1 line-clamp-2 text-xs text-slate-500">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
    {footer ? <div className="mt-2">{footer}</div> : null}
  </div>
);

export default WorkspacePanelHeader;

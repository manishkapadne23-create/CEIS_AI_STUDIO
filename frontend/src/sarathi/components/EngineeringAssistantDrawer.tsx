import React, { useMemo, useState } from "react";
import { useDisciplineWorkspaceConfig } from "../../config/disciplines/useDisciplineWorkspaceConfig";
import { useEngineeringWorkspace } from "../../context/EngineeringWorkspaceContext";
import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";
import { useDisciplineQuickPrompts } from "../../workspace/hooks/useDisciplineQuickPrompts";
import { WORKSPACE_CATEGORY_DEFINITIONS } from "../../workspace/utils/workspaceCategoryConfig";

interface EngineeringAssistantDrawerProps {
  onSelectPrompt: (prompt: string) => void;
  recentQuestions?: string[];
}

interface DrawerItem {
  id: string;
  label: string;
  prompt: string;
  icon?: string;
}

const DrawerSection: React.FC<{
  title: string;
  items: DrawerItem[];
  onSelect: (prompt: string) => void;
  emptyMessage?: string;
}> = ({ title, items, onSelect, emptyMessage }) => (
  <section>
    <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
      {title}
    </h4>
    {items.length > 0 ? (
      <ul className="mt-2 space-y-1.5">
        {items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => onSelect(item.prompt)}
              className="flex w-full items-start gap-2 rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-cyan-500/40 hover:text-cyan-200"
            >
              {item.icon ? (
                <span className="shrink-0 text-sm" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <span className="line-clamp-2">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-2 text-xs text-slate-500">
        {emptyMessage ?? "No items yet."}
      </p>
    )}
  </section>
);

const EngineeringAssistantDrawer: React.FC<EngineeringAssistantDrawerProps> = ({
  onSelectPrompt,
  recentQuestions = [],
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const prompts = useDisciplineQuickPrompts();
  const { workspace } = useEngineeringWorkspace();
  const { sections } = useAIEngineeringWorkspace();
  const disciplineConfig = useDisciplineWorkspaceConfig();

  const disciplineLabel =
    workspace.specialization ??
    disciplineConfig?.name ??
    workspace.domain ??
    "Engineering";

  const quickPromptItems: DrawerItem[] = useMemo(
    () =>
      prompts.slice(0, 6).map((prompt) => ({
        id: prompt.id,
        label: prompt.label,
        prompt: prompt.prompt,
        icon: prompt.icon,
      })),
    [prompts]
  );

  const suggestedTaskItems: DrawerItem[] = useMemo(
    () =>
      sections.workflows.items.slice(0, 4).map((workflow) => ({
        id: workflow.id,
        label: workflow.title,
        prompt: `Guide me through the ${workflow.title} workflow for ${disciplineLabel}.`,
        icon: "🔄",
      })),
    [disciplineLabel, sections.workflows.items]
  );

  const recentQuestionItems: DrawerItem[] = useMemo(
    () =>
      recentQuestions.slice(0, 5).map((question, index) => ({
        id: `recent-${index}`,
        label: question,
        prompt: question,
        icon: "💬",
      })),
    [recentQuestions]
  );

  const favoriteItems: DrawerItem[] = useMemo(
    () =>
      prompts.slice(0, 3).map((prompt) => ({
        id: `favorite-${prompt.id}`,
        label: prompt.label,
        prompt: prompt.prompt,
        icon: "⭐",
      })),
    [prompts]
  );

  const engineeringShortcutItems: DrawerItem[] = useMemo(() => {
    const discipline = workspace.domain ?? "this discipline";

    return WORKSPACE_CATEGORY_DEFINITIONS.slice(0, 5).map((category) => ({
      id: `shortcut-${category.id}`,
      label: category.title,
      prompt: `Help me use ${category.title} resources for ${discipline}.`,
      icon: category.icon,
    }));
  }, [workspace.domain]);

  const handleSelect = (prompt: string) => {
    onSelectPrompt(prompt);
    setIsExpanded(false);
  };

  return (
    <div
      className="shrink-0 border-t border-slate-800 bg-slate-950"
      aria-label="Engineering assistant drawer"
    >
      <div className="mx-auto max-w-5xl px-4">
        <button
          type="button"
          onClick={() => setIsExpanded((previous) => !previous)}
          aria-expanded={isExpanded}
          className="flex w-full items-center gap-2 py-2.5 text-left text-sm font-medium text-slate-300 transition hover:text-cyan-300"
        >
          <span aria-hidden="true">{isExpanded ? "▲" : "▼"}</span>
          <span>{disciplineConfig?.assistantLabel ?? "Engineering Assistant"}</span>
          <span className="truncate text-xs font-normal text-slate-500">
            · {disciplineLabel}
          </span>
        </button>

        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
            isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="max-h-64 overflow-y-auto overscroll-contain border-t border-slate-800 pb-4 pt-3 sm:max-h-72">
              <div className="grid gap-4 sm:grid-cols-2">
                <DrawerSection
                  title="Quick Prompts"
                  items={quickPromptItems}
                  onSelect={handleSelect}
                />
                <DrawerSection
                  title="Suggested Tasks"
                  items={suggestedTaskItems}
                  onSelect={handleSelect}
                  emptyMessage="Suggested tasks will appear for active workflows."
                />
                <DrawerSection
                  title="Recent Questions"
                  items={recentQuestionItems}
                  onSelect={handleSelect}
                  emptyMessage="Your recent chat questions will appear here."
                />
                <DrawerSection
                  title="Favorites"
                  items={favoriteItems}
                  onSelect={handleSelect}
                />
                <DrawerSection
                  title="Engineering Shortcuts"
                  items={engineeringShortcutItems}
                  onSelect={handleSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EngineeringAssistantDrawer;

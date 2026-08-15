import React from "react";
import type {
  KnowledgeCardsSection,
  KnowledgeListSection,
  KnowledgeModuleSection,
  KnowledgeTextSection,
} from "../types";
import { knowledgePanelLabels } from "../data/content/knowledgePanelLabels";

interface KnowledgeModuleSectionViewProps {
  section: KnowledgeModuleSection;
}

const KnowledgeModuleSectionView: React.FC<
  KnowledgeModuleSectionViewProps
> = ({ section }) => {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
        {section.label}
      </h3>

      {section.type === "text" ? (
        <p className="text-sm leading-relaxed text-slate-300">
          {(section as KnowledgeTextSection).text}
        </p>
      ) : null}

      {section.type === "list" ? (
        <ul className="grid gap-2 sm:grid-cols-2">
          {(section as KnowledgeListSection).items.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3 text-sm text-slate-300"
            >
              {item}
            </li>
          ))}
        </ul>
      ) : null}

      {section.type === "cards" ? (
        <ul
          className="grid gap-3 sm:grid-cols-2"
          aria-label={knowledgePanelLabels.cardListAriaLabel}
        >
          {(section as KnowledgeCardsSection).items.map((item) => (
            <li
              key={item.id}
              className="rounded-lg border border-slate-800 bg-slate-950/70 px-4 py-3"
            >
              <p className="text-sm font-semibold text-white">
                {item.title}
              </p>
              {item.description ? (
                <p className="mt-1 text-sm text-slate-400">
                  {item.description}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
};

export default KnowledgeModuleSectionView;

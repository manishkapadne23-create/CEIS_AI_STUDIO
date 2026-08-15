import React from "react";
import { useNavigate } from "react-router-dom";

import { usePersonalization } from "../hooks/usePersonalization";
import type { PersonalizedItem } from "../types";

interface SectionProps {
  title: string;
  items: PersonalizedItem[];
  emptyLabel: string;
}

const RecommendationSection: React.FC<SectionProps> = ({
  title,
  items,
  emptyLabel,
}) => {
  const navigate = useNavigate();

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => item.route && navigate(item.route)}
            className="rounded-xl border border-slate-800 bg-slate-950/70 p-4 text-left transition hover:border-cyan-500 hover:bg-slate-900"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl" aria-hidden="true">
                {item.icon ?? "📌"}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{item.title}</p>
                {item.subtitle ? (
                  <p className="mt-1 truncate text-sm text-slate-400">{item.subtitle}</p>
                ) : null}
              </div>
            </div>
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">{emptyLabel}</p>
      ) : null}
    </section>
  );
};

const PersonalizedHomeSections: React.FC = () => {
  const { home, profile } = usePersonalization();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
        <p className="text-xs uppercase tracking-[0.3em] text-cyan-400">
          Personalized for you
        </p>
        <h2 className="mt-2 text-2xl font-semibold text-white">
          {profile.primaryDisciplineName ?? "Your Engineering Workspace"}
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Recommendations based on your discipline, favorites, and recent activity.
        </p>
      </div>

      <RecommendationSection
        title="Recent Conversations"
        items={home.recentConversations}
        emptyLabel="Start a chat to see recent conversations here."
      />
      <RecommendationSection
        title="Frequently Used Standards"
        items={home.frequentStandards}
        emptyLabel="Open standards in your workspace to build this list."
      />
      <RecommendationSection
        title="Frequently Used Calculators"
        items={home.frequentCalculators}
        emptyLabel="Use calculators to see personalized shortcuts here."
      />
      <RecommendationSection
        title="Frequently Used Tools"
        items={home.frequentTools}
        emptyLabel="Explore engineering tools to populate recommendations."
      />
      <RecommendationSection
        title="Recommended Learning"
        items={home.recommendedLearning}
        emptyLabel="Learning recommendations will appear as you explore courses."
      />
      <RecommendationSection
        title="Recent Documents"
        items={home.recentDocuments}
        emptyLabel="Upload or open documents to see them here."
      />
      <RecommendationSection
        title="Saved Templates"
        items={home.savedTemplates}
        emptyLabel="Favorite templates to access them quickly."
      />
      <RecommendationSection
        title="Recent Reports"
        items={home.recentReports}
        emptyLabel="Generated reports will appear in this section."
      />

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-lg font-semibold text-white">Productivity</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {home.productivity.length > 0 ? (
            home.productivity.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
              >
                <p className="font-medium text-white">{item.title}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-slate-500">
                  {item.type}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">
              Pending tasks, draft reports, and incomplete workflows will appear here.
            </p>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
        <ul className="mt-4 space-y-2">
          {home.recentActivity.length > 0 ? (
            home.recentActivity.map((activity) => (
              <li
                key={activity.id}
                className="flex items-center justify-between rounded-lg border border-slate-800 px-3 py-2 text-sm"
              >
                <span className="text-slate-200">{activity.title}</span>
                <span className="text-xs uppercase text-slate-500">{activity.type}</span>
              </li>
            ))
          ) : (
            <li className="text-sm text-slate-500">Your recent engineering activity will show here.</li>
          )}
        </ul>
      </section>
    </div>
  );
};

export default PersonalizedHomeSections;

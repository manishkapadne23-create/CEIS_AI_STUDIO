import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AppShell from "../layout/AppShell";
import ProductBrand from "../components/ProductBrand";
import PersonalizedHomeSections from "../personalization/components/PersonalizedHomeSections";
import { fetchEngineeringDomains, type EngineeringDomain } from "../services/engineeringDomains";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";
import SpecializationCardGrid from "../sarathi/components/SpecializationCardGrid";
import { getNavigatorSpecializations } from "../sarathi/utils/navigatorTree";
import { resolveDisciplineFromDomain } from "../utils/resolveDisciplineDefinition";
import {
  buildChatPath,
  buildDashboardPath,
  disciplineIdToSlug,
  disciplineSlugToId,
  getDisciplineNameFromSlug,
} from "../navigation/disciplineSlugs";
import { buildKnowledgeWorkspacePath } from "../knowledge/framework/knowledgeRoutes";

const modules = [
  {
    title: "AI Chat",
    icon: "🤖",
    description: "Ask engineering questions with SARATHI AI",
    route: "/chat",
  },
  {
    title: "Engineering Hub",
    icon: "🏗️",
    description: "News, events, webinars, jobs and opportunities",
    route: "/engineering-hub",
  },
  {
    title: "Learning Hub",
    icon: "🎓",
    description: "Courses, Notes, MCQs and Viva",
    route: "/learning",
  },
  {
    title: "Documents",
    icon: "📄",
    description: "Manage drawings, PDFs and reports",
    route: "/documents",
  },
  {
    title: "Engineering Tools",
    icon: "🧮",
    description: "Design tools, BOQ and Estimation",
    route: "/engineering-tools",
  },
  {
    title: "Decision Intelligence",
    icon: "⚖️",
    description: "Compare alternatives, assess risks, and justify engineering decisions",
    route: "/decision-intelligence",
  },
  {
    title: "Standards Intelligence",
    icon: "📜",
    description: "Explain, compare, and apply engineering standards with AI clause intelligence",
    route: "/standards-intelligence",
  },
  {
    title: "Knowledge Graph",
    icon: "🕸️",
    description: "Explore relationships between standards, calculators, workflows, and engineering topics",
    route: "/knowledge-graph",
  },
  {
    title: "Engineering Memory",
    icon: "🧠",
    description: "Recall projects, documents, standards, and engineering context across sessions",
    route: "/memory",
  },
  {
    title: "PMIS Enterprise",
    icon: "📊",
    description: "Professional Project Management",
    route: "/pmis",
  },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { disciplineSlug } = useParams<{ disciplineSlug?: string }>();
  const {
    activeDiscipline,
    activeSpecialization,
    selectDiscipline,
    selectSpecialization,
  } = useSarathiWorkspace();
  const [domains, setDomains] = useState<EngineeringDomain[]>([]);

  useEffect(() => {
    if (!disciplineSlug) {
      return;
    }

    const disciplineId = disciplineSlugToId(disciplineSlug);
    const disciplineName = getDisciplineNameFromSlug(disciplineSlug);

    if (
      disciplineId &&
      disciplineName &&
      activeDiscipline?.id !== disciplineId
    ) {
      selectDiscipline(disciplineId, disciplineName);
    }
  }, [activeDiscipline?.id, disciplineSlug, selectDiscipline]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchEngineeringDomains();
        setDomains(data.filter((domain) => domain.isActive));
      } catch (error) {
        console.error("Unable to load engineering domains", error);
      }
    };

    void load();
  }, []);

  const specializationItems = useMemo(() => {
    if (!activeDiscipline) {
      return [];
    }

    return getNavigatorSpecializations(
      activeDiscipline.id,
      activeDiscipline.name
    ).map(({ node, path }) => ({
      id: node.id,
      title: node.name,
      path,
    }));
  }, [activeDiscipline]);

  const dashboardTitle = activeDiscipline
    ? `${activeDiscipline.name} Dashboard`
    : "Engineering Dashboard";

  const handleDisciplineSelect = (domain: EngineeringDomain) => {
    const definition = resolveDisciplineFromDomain({
      name: domain.name,
      slug: domain.slug,
    });

    if (!definition) {
      console.warn(`No discipline manifest match for domain: ${domain.name}`);
      return;
    }

    selectDiscipline(definition.id, definition.name);
    navigate(buildDashboardPath(disciplineIdToSlug(definition.id)));
  };

  const handleSpecializationSelect = (specializationId: string) => {
    const match = specializationItems.find((item) => item.id === specializationId);
    if (!match || !activeDiscipline) {
      return;
    }

    selectSpecialization(match.path);
    navigate(
      buildKnowledgeWorkspacePath(activeDiscipline.id, specializationId)
    );
  };

  const openChatRoute = activeDiscipline
    ? buildChatPath(disciplineIdToSlug(activeDiscipline.id))
    : "/chat";

  return (
    <AppShell
      header={
        <div className="px-6 py-4">
          <ProductBrand size="md" />
        </div>
      }
    >
      <div className="mx-auto max-w-7xl p-6 sm:p-8">
        <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-white">{dashboardTitle}</h2>
              <p className="mt-2 text-sm text-slate-400">
                Select a discipline, then choose a specialization to open its
                knowledge workspace.
              </p>
              {activeDiscipline ? (
                <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Active
                  </p>
                  {activeSpecialization ? (
                    <p className="mt-1 text-sm font-medium text-cyan-200">
                      {activeDiscipline.name} → {activeSpecialization.name}
                    </p>
                  ) : (
                    <>
                      <p className="mt-1 text-sm font-semibold text-white">
                        {activeDiscipline.name}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        Select a specialization below
                      </p>
                    </>
                  )}
                </div>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => navigate("/engineering")}
              className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-300 hover:bg-cyan-500/20"
            >
              Manage Domains
            </button>
          </div>

          {!disciplineSlug ? (
            <div className="mt-6">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Disciplines
              </h3>
              <div className="mt-3 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {domains.map((domain) => {
                  const definition = resolveDisciplineFromDomain({
                    name: domain.name,
                    slug: domain.slug,
                  });
                  const isActive = activeDiscipline?.id === definition?.id;

                  return (
                    <button
                      key={domain.id}
                      type="button"
                      onClick={() => handleDisciplineSelect(domain)}
                      className={`rounded-2xl border p-4 text-left transition hover:border-cyan-500 hover:bg-slate-800 ${
                        isActive
                          ? "border-cyan-500 bg-cyan-500/10 shadow-lg shadow-cyan-500/10"
                          : "border-slate-800 bg-slate-950/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
                          style={{
                            backgroundColor: `${domain.color || "#06b6d4"}20`,
                          }}
                        >
                          {domain.icon || "🛠️"}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{domain.name}</h3>
                          <p className="text-sm text-slate-400">
                            {domain.description || "Engineering discipline"}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}

          {activeDiscipline ? (
            <div className="mt-8">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                    Specializations
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeDiscipline.name} specializations
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(openChatRoute)}
                  className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-900"
                >
                  Open Chat
                </button>
              </div>
              <div className="mt-4">
                <SpecializationCardGrid
                  items={specializationItems}
                  selectedId={activeSpecialization?.id ?? null}
                  onSelect={handleSpecializationSelect}
                />
              </div>
            </div>
          ) : null}
        </div>

        <PersonalizedHomeSections />

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {modules.map((module) => (
            <button
              key={module.title}
              type="button"
              onClick={() => navigate(module.route)}
              className="rounded-2xl border border-slate-800 bg-slate-900 p-6 text-left transition hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-900/20"
            >
              <div className="text-5xl">{module.icon}</div>
              <h2 className="mt-6 text-2xl font-semibold text-white">{module.title}</h2>
              <p className="mt-3 text-slate-400">{module.description}</p>
            </button>
          ))}
        </div>
      </div>
    </AppShell>
  );
};

export default Dashboard;

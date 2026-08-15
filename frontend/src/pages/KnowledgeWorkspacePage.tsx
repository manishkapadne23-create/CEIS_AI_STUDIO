import React, { useEffect, useMemo } from "react";
import { Navigate, useParams } from "react-router-dom";

import AppShell from "../layout/AppShell";
import ProductBrand from "../components/ProductBrand";
import ActiveEngineeringContextBanner from "../sarathi/components/ActiveEngineeringContextBanner";
import { useSarathiWorkspace } from "../sarathi/context/SarathiWorkspaceContext";
import {
  disciplineSlugToId,
  getDisciplineNameFromSlug,
} from "../navigation/disciplineSlugs";
import {
  KnowledgeDisciplineHub,
  KnowledgeSpecializationWorkspace,
  knowledgeFrameworkEngine,
} from "../knowledge/framework";

const KnowledgeWorkspacePage: React.FC = () => {
  const { disciplineSlug, specializationSlug } = useParams<{
    disciplineSlug: string;
    specializationSlug?: string;
  }>();

  const { selectDiscipline, selectSpecialization } = useSarathiWorkspace();

  const disciplineId = disciplineSlug ? disciplineSlugToId(disciplineSlug) : null;
  const disciplineName = disciplineSlug
    ? getDisciplineNameFromSlug(disciplineSlug)
    : null;

  const disciplineTree = useMemo(
    () => (disciplineId ? knowledgeFrameworkEngine.getDisciplineTree(disciplineId) : null),
    [disciplineId]
  );

  const specializationWorkspace = useMemo(() => {
    if (!disciplineId || !specializationSlug) {
      return null;
    }
    return knowledgeFrameworkEngine.getSpecializationWorkspace(
      disciplineId,
      decodeURIComponent(specializationSlug)
    );
  }, [disciplineId, specializationSlug]);

  useEffect(() => {
    if (!disciplineId || !disciplineName) {
      return;
    }

    selectDiscipline(disciplineId, disciplineName);
  }, [disciplineId, disciplineName, selectDiscipline]);

  useEffect(() => {
    if (!specializationWorkspace) {
      return;
    }

    const specializationPath = [
      { id: disciplineId!, name: disciplineName! },
      {
        id: specializationWorkspace.specializationId,
        name: specializationWorkspace.specializationName,
      },
    ];

    selectSpecialization(specializationPath);
  }, [
    specializationWorkspace,
    disciplineId,
    disciplineName,
    selectSpecialization,
  ]);

  if (!disciplineSlug || !disciplineId || !disciplineName || !disciplineTree) {
    return <Navigate to="/dashboard" replace />;
  }

  const pageTitle = specializationWorkspace
    ? `${specializationWorkspace.specializationName} Knowledge`
    : `${disciplineName} Knowledge`;

  return (
    <AppShell
      header={
        <div className="px-6 py-4">
          <ProductBrand size="md" />
        </div>
      }
    >
      <div className="mx-auto max-w-4xl p-6 sm:p-8">
        <ActiveEngineeringContextBanner />
        <header className="mb-6">
          <h1 className="text-2xl font-semibold text-white">{pageTitle}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Engineering Knowledge Framework — folder structure ready for future
            documents.
          </p>
        </header>

        {specializationWorkspace ? (
          <KnowledgeSpecializationWorkspace workspace={specializationWorkspace} />
        ) : (
          <KnowledgeDisciplineHub tree={disciplineTree} />
        )}
      </div>
    </AppShell>
  );
};

export default KnowledgeWorkspacePage;

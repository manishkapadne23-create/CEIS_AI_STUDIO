import React from "react";

import { useNavigate } from "react-router-dom";

import {

  getStandardsCatalogByDisciplineId,

  type EngineeringStandardMetadata,

} from "../../config/standards";

import StandardsKnowledgePanel from "../../modules/standards/StandardsKnowledgePanel";

import { useAIEngineeringWorkspace } from "../../workspace/hooks/useAIEngineeringWorkspace";

import { useSarathiWorkspace } from "../context/SarathiWorkspaceContext";

import { useStandardsIntelligence } from "../../config/standards/useStandardsIntelligence";



const StandardsModulePanel: React.FC = () => {

  const navigate = useNavigate();

  const { discipline } = useAIEngineeringWorkspace();

  const {

    selectedStandardKnowledge,

    openStandardKnowledge,

    moduleSearchQuery,

  } = useSarathiWorkspace();



  const {

    isFavourite,

    handleStandardOpen,

    handleToggleFavourite,

  } = useStandardsIntelligence(discipline.id, moduleSearchQuery);



  const catalog = getStandardsCatalogByDisciplineId(discipline.id);

  const topStandards = catalog?.standards.slice(0, 6) ?? [];



  const handleSelect = (standard: EngineeringStandardMetadata) => {

    handleStandardOpen(standard);

    openStandardKnowledge(standard);

  };



  const handleAskAI = (prompt: string) => {

    const slug = discipline.id?.replace(/-engineering$/, "") ?? "";

    const chatPath = slug ? `/chat/${slug}/standards` : "/chat";

    navigate(chatPath, { state: { standardsPrompt: prompt } });

  };



  if (selectedStandardKnowledge) {

    return (

      <StandardsKnowledgePanel

        standard={selectedStandardKnowledge}

        isFavourite={isFavourite(selectedStandardKnowledge.id)}

        onToggleFavourite={() =>

          handleToggleFavourite(selectedStandardKnowledge.id)

        }

        onSelectRelated={handleSelect}

        onAskAI={handleAskAI}

      />

    );

  }



  return (

    <div className="space-y-3">

      <p className="text-xs text-slate-500">

        Select a standard to view summary, scope, clause intelligence, and AI

        assistant actions.

      </p>

      <ul className="space-y-2">

        {topStandards.map((standard) => (

          <li key={standard.id}>

            <button

              type="button"

              onClick={() => handleSelect(standard)}

              className="w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-left text-xs hover:border-cyan-500/40"

            >

              <span className="font-medium text-slate-200">

                {standard.codeNumber}

              </span>

              <span className="mt-0.5 block line-clamp-1 text-slate-500">

                {standard.title}

              </span>

            </button>

          </li>

        ))}

      </ul>

    </div>

  );

};



export default StandardsModulePanel;


import React, { useState } from "react";

import HubDisciplineModule from "../../components/HubDisciplineModule";
import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import CalculatorsWorkspace from "../../modules/calculators/CalculatorsWorkspace";
import ProfessionalToolsWorkspace from "../../modules/professionalTools/ProfessionalToolsWorkspace";

const EngineeringToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"calculators" | "tools">(
    "calculators"
  );

  return (
    <AppShell>
      <HubPageContent
        title="Engineering Tools"
        description="Calculators, BOQ tools, estimation utilities, and professional engineering tools."
      >
        <div className="mb-6 flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("calculators")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "calculators"
                ? "bg-cyan-600 text-white"
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Calculators
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tools")}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
              activeTab === "tools"
                ? "bg-cyan-600 text-white"
                : "border border-slate-700 text-slate-300 hover:bg-slate-800"
            }`}
          >
            Professional Tools
          </button>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
          <HubDisciplineModule>
            {(props) =>
              activeTab === "calculators" ? (
                <CalculatorsWorkspace {...props} />
              ) : (
                <ProfessionalToolsWorkspace {...props} />
              )
            }
          </HubDisciplineModule>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default EngineeringToolsPage;

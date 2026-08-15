import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import { useWorkspaceNavigation } from "../../navigation/WorkspaceNavigationContext";
import {
  ENGINEERING_HUB_SECTIONS,
  isEngineeringHubSection,
  type EngineeringHubSection,
} from "../../navigation/routeConfig";

const TABS = [
  { id: "news", label: "News" },
  { id: "events", label: "Events" },
  { id: "webinars", label: "Webinars" },
  { id: "jobs", label: "Jobs" },
  { id: "opportunities", label: "Opportunities" },
  { id: "promotions", label: "Promotions" },
] as const satisfies ReadonlyArray<{ id: EngineeringHubSection; label: string }>;

const TAB_CONTENT: Record<EngineeringHubSection, string> = {
  news: "Latest engineering industry news and Sarathi AI platform updates.",
  events: "Upcoming conferences, seminars, and CEIS engineering events.",
  webinars: "Live and recorded webinars on standards, design, and project delivery.",
  jobs: "Engineering job listings and career opportunities.",
  opportunities: "Tenders, collaborations, and project opportunities.",
  promotions: "Platform offers, partner promotions, and subscription deals.",
};

const EngineeringHubPage: React.FC = () => {
  const { section } = useParams<{ section?: string }>();
  const navigate = useNavigate();
  const { engineeringHubSection, updateWorkspace } = useWorkspaceNavigation();
  const [activeTab, setActiveTab] = useState<EngineeringHubSection>(
    engineeringHubSection ?? "news"
  );

  useEffect(() => {
    if (section) {
      if (isEngineeringHubSection(section)) {
        setActiveTab(section);
        updateWorkspace({ engineeringHubSection: section });
        return;
      }

      navigate("/engineering-hub", { replace: true });
      return;
    }

    if (engineeringHubSection && ENGINEERING_HUB_SECTIONS.includes(engineeringHubSection)) {
      setActiveTab(engineeringHubSection);
    }
  }, [engineeringHubSection, navigate, section, updateWorkspace]);

  const handleTabChange = (tabId: EngineeringHubSection) => {
    setActiveTab(tabId);
    updateWorkspace({ engineeringHubSection: tabId });
    navigate(`/engineering-hub/${tabId}`);
  };

  return (
    <AppShell>
      <HubPageContent
        title="Engineering Hub"
        description="Industry news, events, webinars, jobs, and engineering opportunities."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeTab === tab.id
                  ? "bg-cyan-600 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold capitalize text-white">
            {activeTab}
          </h2>
          <p className="mt-3 text-slate-400">{TAB_CONTENT[activeTab]}</p>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default EngineeringHubPage;

import React from "react";

import HubDisciplineModule from "../../components/HubDisciplineModule";
import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import LearningHubWorkspace from "../../modules/learningHub/LearningHubWorkspace";

const LearningHubPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Learning Hub"
      description="Courses, notes, MCQs, viva preparation, and engineering learning resources."
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <HubDisciplineModule>
          {(props) => <LearningHubWorkspace {...props} />}
        </HubDisciplineModule>
      </div>
    </HubPageContent>
  </AppShell>
);

export default LearningHubPage;

import React from "react";

import HubPageContent from "../components/HubPageContent";
import DecisionIntelligenceWorkspace from "../decision-intelligence/components/DecisionIntelligenceWorkspace";
import AppShell from "../layout/AppShell";

const DecisionIntelligencePage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Engineering Decision Intelligence"
      description="Evaluate alternatives, compare options, assess risks, and generate structured decision reports with standards-based engineering justification."
    >
      <DecisionIntelligenceWorkspace />
    </HubPageContent>
  </AppShell>
);

export default DecisionIntelligencePage;

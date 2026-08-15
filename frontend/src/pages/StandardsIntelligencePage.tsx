import React from "react";

import HubPageContent from "../components/HubPageContent";
import StandardsIntelligenceWorkspace from "../standards-intelligence/components/StandardsIntelligenceWorkspace";
import AppShell from "../layout/AppShell";

const StandardsIntelligencePage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Engineering Standards Intelligence"
      description="Understand, explain, compare, and apply engineering standards with AI-powered clause intelligence and compliance support."
    >
      <StandardsIntelligenceWorkspace />
    </HubPageContent>
  </AppShell>
);

export default StandardsIntelligencePage;

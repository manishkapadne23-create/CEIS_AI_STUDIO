import React from "react";

import HubPageContent from "../components/HubPageContent";
import KnowledgeGraphWorkspace from "../knowledge-graph/components/KnowledgeGraphWorkspace";
import AppShell from "../layout/AppShell";

const KnowledgeGraphPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Engineering Knowledge Graph"
      description="Explore intelligent relationships between standards, calculators, workflows, templates, documents, and AI experts across all engineering disciplines."
    >
      <KnowledgeGraphWorkspace />
    </HubPageContent>
  </AppShell>
);

export default KnowledgeGraphPage;

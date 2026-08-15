import React from "react";

import HubPageContent from "../components/HubPageContent";
import MemoryWorkspace from "../memory/components/MemoryWorkspace";
import AppShell from "../layout/AppShell";

const EngineeringMemoryPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Engineering Digital Memory"
      description="View, search, and restore engineering context, projects, documents, standards, and preferences across sessions."
    >
      <MemoryWorkspace />
    </HubPageContent>
  </AppShell>
);

export default EngineeringMemoryPage;

import React from "react";

import HubDisciplineModule from "../../components/HubDisciplineModule";
import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import DocumentsWorkspace from "../../modules/documents/DocumentsWorkspace";

const DocumentsPage: React.FC = () => (
  <AppShell>
    <HubPageContent
      title="Document Library"
      description="Manage drawings, PDFs, reports, and project knowledge documents."
    >
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-4">
        <HubDisciplineModule>
          {(props) => <DocumentsWorkspace {...props} />}
        </HubDisciplineModule>
      </div>
    </HubPageContent>
  </AppShell>
);

export default DocumentsPage;

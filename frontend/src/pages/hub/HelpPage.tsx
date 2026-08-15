import React, { useState } from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";

const HELP_SECTIONS = [
  { id: "faq", label: "FAQ" },
  { id: "support", label: "Support" },
  { id: "contact", label: "Contact" },
  { id: "bug", label: "Report Bug" },
  { id: "feedback", label: "Feedback" },
] as const;

const HELP_CONTENT: Record<(typeof HELP_SECTIONS)[number]["id"], string> = {
  faq: "Browse frequently asked questions about Sarathi AI modules, billing, and engineering workflows.",
  support: "Access documentation, troubleshooting guides, and platform support resources.",
  contact: "Contact the CEIS support team at support@ceis.ai for enterprise assistance.",
  bug: "Report a bug with steps to reproduce, expected behavior, and screenshots if available.",
  feedback: "Share product feedback to help improve Sarathi AI engineering intelligence features.",
};

const HelpPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<(typeof HELP_SECTIONS)[number]["id"]>("faq");

  return (
    <AppShell>
      <HubPageContent
        title="Help & Support"
        description="FAQ, support resources, contact options, bug reports, and product feedback."
      >
        <div className="mb-6 flex flex-wrap gap-2">
          {HELP_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              onClick={() => setActiveSection(section.id)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${
                activeSection === section.id
                  ? "bg-cyan-600 text-white"
                  : "border border-slate-700 text-slate-300 hover:bg-slate-800"
              }`}
            >
              {section.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h2 className="text-xl font-semibold text-white">
            {HELP_SECTIONS.find((section) => section.id === activeSection)?.label}
          </h2>
          <p className="mt-3 text-slate-400">{HELP_CONTENT[activeSection]}</p>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default HelpPage;

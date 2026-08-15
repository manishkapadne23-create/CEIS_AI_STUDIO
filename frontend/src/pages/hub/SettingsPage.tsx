import React, { useState } from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import { DISCIPLINE_DEFINITIONS } from "../../knowledge/data/disciplineManifest";
import { applyThemePreference, updateUserPreferences } from "../../personalization/preferencesManager";
import { usePersonalization } from "../../personalization/hooks/usePersonalization";
import type { WorkspaceCategoryId } from "../../workspace/utils/workspaceCategoryConfig";
import { WORKSPACE_CATEGORY_DEFINITIONS } from "../../workspace/utils/workspaceCategoryConfig";

const SETTINGS_SECTIONS = [
  "Profile",
  "Language",
  "Theme",
  "Notifications",
  "Privacy",
  "AI Settings",
] as const;

const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] =
    useState<(typeof SETTINGS_SECTIONS)[number]>("Profile");
  const { preferences, savePreferences } = usePersonalization();
  const [draft, setDraft] = useState(preferences);

  const handleSave = () => {
    savePreferences(draft);
    applyThemePreference(draft.theme);
    updateUserPreferences(draft);
  };

  return (
    <AppShell>
      <HubPageContent
        title="Settings"
        description="Configure profile, language, theme, notifications, privacy, and AI preferences."
      >
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <nav className="space-y-1">
            {SETTINGS_SECTIONS.map((section) => (
              <button
                key={section}
                type="button"
                onClick={() => setActiveSection(section)}
                className={`w-full rounded-xl px-4 py-2.5 text-left text-sm transition ${
                  activeSection === section
                    ? "bg-cyan-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {section}
              </button>
            ))}
          </nav>
          <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
            <h2 className="text-xl font-semibold text-white">{activeSection}</h2>

            {activeSection === "Language" ? (
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-300">
                  Interface language
                  <select
                    value={draft.language}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        language: event.target.value as typeof draft.language,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="ta">Tamil</option>
                    <option value="te">Telugu</option>
                  </select>
                </label>
              </div>
            ) : null}

            {activeSection === "Theme" ? (
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-300">
                  Theme
                  <select
                    value={draft.theme}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        theme: event.target.value as typeof draft.theme,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="dark">Dark</option>
                    <option value="light">Light</option>
                    <option value="system">System</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Units
                  <select
                    value={draft.units}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        units: event.target.value as typeof draft.units,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="metric">Metric</option>
                    <option value="imperial">Imperial</option>
                    <option value="mixed">Mixed</option>
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Date format
                  <select
                    value={draft.dateFormat}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        dateFormat: event.target.value as typeof draft.dateFormat,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </label>
              </div>
            ) : null}

            {activeSection === "Profile" ? (
              <div className="mt-4 space-y-4">
                <label className="block text-sm text-slate-300">
                  Default engineering discipline
                  <select
                    value={draft.defaultDisciplineId ?? ""}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        defaultDisciplineId: event.target.value || null,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="">Use current workspace</option>
                    {DISCIPLINE_DEFINITIONS.map((discipline) => (
                      <option key={discipline.id} value={discipline.id}>
                        {discipline.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="block text-sm text-slate-300">
                  Default workspace module
                  <select
                    value={draft.defaultWorkspace ?? ""}
                    onChange={(event) =>
                      setDraft((previous) => ({
                        ...previous,
                        defaultWorkspace: (event.target.value ||
                          null) as WorkspaceCategoryId | null,
                      }))
                    }
                    className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
                  >
                    <option value="">None</option>
                    {WORKSPACE_CATEGORY_DEFINITIONS.map((module) => (
                      <option key={module.id} value={module.id}>
                        {module.title}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ) : null}

            {activeSection === "Notifications" ? (
              <div className="mt-4 space-y-3">
                {(
                  Object.keys(draft.notifications) as Array<
                    keyof typeof draft.notifications
                  >
                ).map((key) => (
                  <label key={key} className="flex items-center gap-3 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={draft.notifications[key]}
                      onChange={(event) =>
                        setDraft((previous) => ({
                          ...previous,
                          notifications: {
                            ...previous.notifications,
                            [key]: event.target.checked,
                          },
                        }))
                      }
                    />
                    {key}
                  </label>
                ))}
              </div>
            ) : null}

            {activeSection === "Privacy" ? (
              <p className="mt-3 text-sm text-slate-400">
                Personalization data is stored locally in your browser and is not
                shared without your permission. User-specific profiles remain private
                to your account session.
              </p>
            ) : null}

            {activeSection === "AI Settings" ? (
              <p className="mt-3 text-sm text-slate-400">
                AI recommendations use your discipline, favorites, and activity history
                to prioritize standards, calculators, tools, and learning resources.
              </p>
            ) : null}

            {activeSection !== "Privacy" && activeSection !== "AI Settings" ? (
              <button
                type="button"
                onClick={handleSave}
                className="mt-6 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
              >
                Save Preferences
              </button>
            ) : null}
          </section>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default SettingsPage;

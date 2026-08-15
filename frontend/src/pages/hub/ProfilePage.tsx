import React, { useState } from "react";

import HubPageContent from "../../components/HubPageContent";
import AppShell from "../../layout/AppShell";
import { DISCIPLINE_DEFINITIONS } from "../../knowledge/data/disciplineManifest";
import { usePersonalization } from "../../personalization/hooks/usePersonalization";
import type { ExperienceLevel } from "../../intelligence/types";
import type { EngineeringUserLanguage } from "../../ai/contextEngine/types";
import type { PreferredUnits } from "../../personalization/types";

const readUser = () => {
  try {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as { name?: string; email?: string }) : {};
  } catch {
    return {};
  }
};

const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "student",
  "graduate",
  "junior",
  "mid",
  "senior",
  "expert",
];

const LANGUAGES: EngineeringUserLanguage[] = [
  "en",
  "hi",
  "ta",
  "te",
  "mr",
  "bn",
  "gu",
  "kn",
  "ml",
  "pa",
];

const ProfilePage: React.FC = () => {
  const user = readUser();
  const { profile, saveProfile } = usePersonalization();
  const [form, setForm] = useState(profile);

  const handleSave = () => {
    saveProfile(form);
  };

  return (
    <AppShell>
      <HubPageContent
        title="User Profile"
        description="View and manage your Sarathi AI engineering profile."
      >
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-xl font-bold text-white">
              {(user.name ?? user.email ?? "U").slice(0, 2).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-white">
                {user.name ?? "Sarathi User"}
              </h2>
              <p className="text-slate-400">{user.email ?? "No email on file"}</p>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Primary Discipline
              </span>
              <select
                value={form.primaryDisciplineId ?? ""}
                onChange={(event) => {
                  const discipline = DISCIPLINE_DEFINITIONS.find(
                    (entry) => entry.id === event.target.value
                  );
                  setForm((previous) => ({
                    ...previous,
                    primaryDisciplineId: discipline?.id ?? null,
                    primaryDisciplineName: discipline?.name ?? null,
                  }));
                }}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="">Select discipline</option>
                {DISCIPLINE_DEFINITIONS.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Secondary Discipline
              </span>
              <select
                value={form.secondaryDisciplineId ?? ""}
                onChange={(event) => {
                  const discipline = DISCIPLINE_DEFINITIONS.find(
                    (entry) => entry.id === event.target.value
                  );
                  setForm((previous) => ({
                    ...previous,
                    secondaryDisciplineId: discipline?.id ?? null,
                    secondaryDisciplineName: discipline?.name ?? null,
                  }));
                }}
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="">None</option>
                {DISCIPLINE_DEFINITIONS.map((discipline) => (
                  <option key={discipline.id} value={discipline.id}>
                    {discipline.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Experience Level
              </span>
              <select
                value={form.experienceLevel}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    experienceLevel: event.target.value as ExperienceLevel,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                {EXPERIENCE_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Language
              </span>
              <select
                value={form.language}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    language: event.target.value as EngineeringUserLanguage,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                {LANGUAGES.map((language) => (
                  <option key={language} value={language}>
                    {language.toUpperCase()}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Industry
              </span>
              <input
                value={form.industry ?? ""}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, industry: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Organization
              </span>
              <input
                value={form.organization ?? ""}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    organization: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Designation
              </span>
              <input
                value={form.designation ?? ""}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    designation: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Country
              </span>
              <input
                value={form.country ?? ""}
                onChange={(event) =>
                  setForm((previous) => ({ ...previous, country: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              />
            </label>

            <label className="block md:col-span-2">
              <span className="text-xs uppercase tracking-wide text-slate-500">
                Preferred Units
              </span>
              <select
                value={form.preferredUnits}
                onChange={(event) =>
                  setForm((previous) => ({
                    ...previous,
                    preferredUnits: event.target.value as PreferredUnits,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-white"
              >
                <option value="metric">Metric (SI)</option>
                <option value="imperial">Imperial</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="mt-6 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
          >
            Save Profile
          </button>
        </div>
      </HubPageContent>
    </AppShell>
  );
};

export default ProfilePage;

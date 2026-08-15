import type { SiteExecutionWorkspace, SiteReport } from "./types";

export const generateDailyProgressReport = (workspace: SiteExecutionWorkspace): SiteReport => {
  const date = new Date().toLocaleDateString();
  return {
    id: crypto.randomUUID(),
    type: "daily-progress",
    title: `Daily Progress Report — ${date}`,
    content: [
      `DAILY PROGRESS REPORT`,
      `Project: ${workspace.projectName ?? workspace.title}`,
      `Date: ${date}`,
      `Discipline: ${workspace.disciplineName ?? "Engineering"}`,
      `Phase: ${workspace.phase}`,
      "",
      "Work Completed Today:",
      "- [Document completed activities]",
      "- [Record quantities and locations]",
      "",
      "Work Planned Tomorrow:",
      "- [Document planned activities]",
      "",
      "Manpower & Equipment:",
      `- Inspections today: ${workspace.inspections.length}`,
      `- Quality records: ${workspace.qualityRecords.length}`,
      `- Observations: ${workspace.observations.length}`,
      "",
      "Issues / Delays:",
      workspace.observations.length > 0
        ? workspace.observations.map((o) => `- ${o}`).join("\n")
        : "- None reported",
      "",
      "Safety:",
      "- Toolbox talk conducted: [Yes/No]",
      "- Incidents/near-misses: [None/Details]",
    ].join("\n"),
    generatedAt: Date.now(),
  };
};

export const generateInspectionReport = (
  workspace: SiteExecutionWorkspace,
  activity: string
): SiteReport => {
  const latest = workspace.inspections[0];
  return {
    id: crypto.randomUUID(),
    type: "inspection",
    title: `Inspection Report — ${activity}`,
    content: [
      `INSPECTION REPORT`,
      `Project: ${workspace.projectName ?? workspace.title}`,
      `Activity: ${activity}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      latest
        ? [
            `Status: ${latest.status.toUpperCase()}`,
            latest.standard ? `Standard: ${latest.standard}` : "",
            "",
            "Findings:",
            ...latest.findings.map((f, i) => `${i + 1}. ${f}`),
          ].join("\n")
        : "No inspection records yet. Conduct inspection and record findings.",
      "",
      "Inspector: _______________",
      "Approved By: _______________",
    ].join("\n"),
    generatedAt: Date.now(),
  };
};

export const generateSiteObservationReport = (
  workspace: SiteExecutionWorkspace,
  observation: string
): SiteReport => ({
  id: crypto.randomUUID(),
  type: "site-observation",
  title: `Site Observation — ${new Date().toLocaleDateString()}`,
  content: [
    "SITE OBSERVATION REPORT",
    `Project: ${workspace.projectName ?? workspace.title}`,
    `Date: ${new Date().toLocaleString()}`,
    `Phase: ${workspace.phase}`,
    "",
    "Observation:",
    observation || (workspace.observations[0] ?? "[Describe observation]"),
    "",
    "Recommended Action:",
    "- [Action required]",
    "",
    "Priority: [Low / Medium / High]",
    "Assigned To: _______________",
    "Target Date: _______________",
  ].join("\n"),
  generatedAt: Date.now(),
});

export const generateQualityReport = (workspace: SiteExecutionWorkspace): SiteReport => {
  const latest = workspace.qualityRecords[0];
  return {
    id: crypto.randomUUID(),
    type: "quality",
    title: `Quality Report — ${new Date().toLocaleDateString()}`,
    content: [
      "QUALITY REPORT",
      `Project: ${workspace.projectName ?? workspace.title}`,
      `Date: ${new Date().toLocaleDateString()}`,
      "",
      latest
        ? [
            `Activity: ${latest.activity}`,
            `Material Verified: ${latest.materialVerified ? "Yes" : "No"}`,
            `Workmanship: ${latest.workmanshipRating}`,
            "",
            latest.nonConformances.length > 0
              ? ["Non-Conformances:", ...latest.nonConformances.map((n) => `- ${n}`)].join("\n")
              : "No non-conformances.",
            "",
            "Corrective Actions:",
            ...latest.correctiveActions.map((a) => `- ${a}`),
          ].join("\n")
        : "No quality records yet.",
      "",
      `Total quality records: ${workspace.qualityRecords.length}`,
    ].join("\n"),
    generatedAt: Date.now(),
  };
};

export const generateSafetyObservation = (observation: string): SiteReport => ({
  id: crypto.randomUUID(),
  type: "safety-observation",
  title: `Safety Observation — ${new Date().toLocaleDateString()}`,
  content: [
    "SAFETY OBSERVATION REPORT",
    `Date: ${new Date().toLocaleString()}`,
    "",
    "Observation:",
    observation || "[Describe unsafe act or condition]",
    "",
    "Category: [Unsafe Act / Unsafe Condition / Positive Observation]",
    "",
    "Immediate Action Taken:",
    "- [Action taken on site]",
    "",
    "Follow-up Required:",
    "- [Yes/No — details]",
    "",
    "Reported By: _______________",
  ].join("\n"),
  generatedAt: Date.now(),
});

export const generateWorkCompletionRecord = (
  workspace: SiteExecutionWorkspace,
  activity: string
): SiteReport => ({
  id: crypto.randomUUID(),
  type: "work-completion",
  title: `Work Completion — ${activity}`,
  content: [
    "WORK COMPLETION RECORD",
    `Project: ${workspace.projectName ?? workspace.title}`,
    `Activity: ${activity}`,
    `Completion Date: ${new Date().toLocaleDateString()}`,
    "",
    "Scope Completed:",
    `- ${activity} executed per approved drawings and specifications`,
    "",
    "Inspection Status:",
    workspace.inspections.length > 0
      ? `Latest inspection: ${workspace.inspections[0].status}`
      : "Pending final inspection",
    "",
    "Quality Status:",
    workspace.qualityRecords.length > 0
      ? `Workmanship: ${workspace.qualityRecords[0].workmanshipRating}`
      : "Pending quality sign-off",
    "",
    "Completed By: _______________",
    "Verified By: _______________",
    "Client/Engineer Sign-off: _______________",
  ].join("\n"),
  generatedAt: Date.now(),
});

export const generateSiteInstruction = (topic: string, instruction: string): SiteReport => ({
  id: crypto.randomUUID(),
  type: "site-instruction",
  title: `Site Instruction — ${topic}`,
  content: [
    "SITE INSTRUCTION",
    `Subject: ${topic}`,
    `Date: ${new Date().toLocaleDateString()}`,
    `Reference: SI-${Date.now().toString(36).toUpperCase()}`,
    "",
    "Instruction:",
    instruction || `[Instruction regarding ${topic}]`,
    "",
    "Action Required By: _______________",
    "Compliance Date: _______________",
    "Issued By: Site Engineer",
  ].join("\n"),
  generatedAt: Date.now(),
});

export const formatSiteReport = (report: SiteReport): string =>
  [report.title, "", report.content].join("\n");

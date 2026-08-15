import type { ExpertOutputFormatDefinition } from "./types";

export const EXPERT_OUTPUT_FORMATS: ExpertOutputFormatDefinition[] = [
  {
    id: "normal-answer",
    label: "Normal Answer",
    description: "Standard structured engineering response.",
  },
  {
    id: "step-by-step",
    label: "Step-by-Step",
    description: "Sequential methodology with numbered steps.",
  },
  {
    id: "executive-summary",
    label: "Executive Summary",
    description: "Concise summary for decision-makers.",
  },
  {
    id: "bullet-format",
    label: "Bullet Format",
    description: "Compact bullet-point engineering guidance.",
  },
  {
    id: "detailed-report",
    label: "Detailed Report",
    description: "Comprehensive technical report structure.",
  },
  {
    id: "table",
    label: "Table",
    description: "Tabular comparison or data presentation.",
  },
  {
    id: "checklist",
    label: "Checklist",
    description: "Actionable checklist format.",
  },
];

export const DEFAULT_OUTPUT_FORMAT_ID = "normal-answer" as const;

export const getOutputFormatById = (
  id: string
): ExpertOutputFormatDefinition =>
  EXPERT_OUTPUT_FORMATS.find((format) => format.id === id) ??
  EXPERT_OUTPUT_FORMATS[0];

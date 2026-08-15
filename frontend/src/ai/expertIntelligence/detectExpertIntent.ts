import type { ExpertModeId, ExpertOutputFormatId } from "./types";
import { DEFAULT_EXPERT_MODE_ID, EXPERT_MODES } from "./expertModes";
import {
  DEFAULT_OUTPUT_FORMAT_ID,
  EXPERT_OUTPUT_FORMATS,
} from "./outputFormats";

const EXPERT_MODE_PATTERNS: Array<{ id: ExpertModeId; patterns: RegExp[] }> = [
  { id: "execution-expert", patterns: [/\bexecution\b/i, /\bsite work\b/i] },
  { id: "planning-expert", patterns: [/\bplanning\b/i, /\bschedule\b/i] },
  { id: "qa-qc-expert", patterns: [/\bqa\b/i, /\bqc\b/i, /\bquality\b/i] },
  { id: "contract-expert", patterns: [/\bcontract\b/i, /\bclaim\b/i] },
  { id: "tender-expert", patterns: [/\btender\b/i, /\bbid\b/i] },
  { id: "estimation-expert", patterns: [/\bestimat/i, /\bboq\b/i, /\bcost\b/i] },
  {
    id: "project-management-expert",
    patterns: [/\bproject management\b/i, /\brisk\b/i],
  },
  { id: "maintenance-expert", patterns: [/\bmaintenance\b/i, /\bo&m\b/i] },
  { id: "research-expert", patterns: [/\bresearch\b/i, /\bliterature\b/i] },
  { id: "teaching-expert", patterns: [/\bteach\b/i, /\bexplain\b/i, /\blearn\b/i] },
  { id: "interview-expert", patterns: [/\binterview\b/i] },
  { id: "design-expert", patterns: [/\bdesign\b/i, /\bsize\b/i] },
];

const OUTPUT_FORMAT_PATTERNS: Array<{
  id: ExpertOutputFormatId;
  patterns: RegExp[];
}> = [
  {
    id: "step-by-step",
    patterns: [/\bstep[- ]by[- ]step\b/i, /\bstepwise\b/i],
  },
  {
    id: "executive-summary",
    patterns: [/\bexecutive summary\b/i, /\bbrief summary\b/i],
  },
  {
    id: "bullet-format",
    patterns: [/\bbullet\b/i, /\bbullets\b/i, /\bpoint form\b/i],
  },
  {
    id: "detailed-report",
    patterns: [/\bdetailed report\b/i, /\bfull report\b/i],
  },
  { id: "table", patterns: [/\btable\b/i, /\btabular\b/i, /\bcompare\b/i] },
  { id: "checklist", patterns: [/\bchecklist\b/i, /\bcheck list\b/i] },
];

export const detectExpertModeFromMessage = (message: string): ExpertModeId => {
  const normalized = message.trim();

  for (const entry of EXPERT_MODE_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.id;
    }
  }

  return DEFAULT_EXPERT_MODE_ID;
};

export const detectOutputFormatFromMessage = (
  message: string
): ExpertOutputFormatId => {
  const normalized = message.trim();

  for (const entry of OUTPUT_FORMAT_PATTERNS) {
    if (entry.patterns.some((pattern) => pattern.test(normalized))) {
      return entry.id;
    }
  }

  return DEFAULT_OUTPUT_FORMAT_ID;
};

export const listExpertModes = () => EXPERT_MODES;
export const listOutputFormats = () => EXPERT_OUTPUT_FORMATS;

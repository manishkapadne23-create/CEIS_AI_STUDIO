import {
  getEvidencePublicConfig,
  runEngineeringEvidenceEngine,
  listEvidenceAuditLogs,
  type EvidenceEngineInput,
} from "../evidence/index.js";

export const analyzeEngineeringEvidence = (input: EvidenceEngineInput) =>
  runEngineeringEvidenceEngine(input);

export const getEngineeringEvidenceConfig = () => getEvidencePublicConfig();

export const getEngineeringEvidenceAuditLogs = listEvidenceAuditLogs;

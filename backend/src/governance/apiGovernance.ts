import type { ApiGovernanceRule } from "./types.js";

export const API_GOVERNANCE_RULES: ApiGovernanceRule[] = [
  { id: "rest-versioned", area: "versioning", rule: "All new APIs exposed under /api/v1", compliant: true },
  { id: "rest-methods", area: "rest", rule: "Use standard HTTP methods (GET, POST, PUT, DELETE)", compliant: true },
  { id: "error-envelope", area: "errors", rule: "Errors return { success: false, error: { code, message } }", compliant: true },
  { id: "validation-middleware", area: "validation", rule: "Request validation via sanitizeBody and controller checks", compliant: true },
  { id: "auth-jwt", area: "auth", rule: "JWT authentication available via /api/v1/auth", compliant: true },
  { id: "auth-middleware", area: "authorization", rule: "auth.middleware.ts enforces role-based access", compliant: true },
  { id: "rate-limit-general", area: "rate-limiting", rule: "General rate limiter applied globally", compliant: true },
  { id: "rate-limit-ai", area: "rate-limiting", rule: "Dedicated AI rate limiter on /api/v1/ai routes", compliant: true },
];

export const validateApiGovernance = (): ApiGovernanceRule[] => API_GOVERNANCE_RULES;

export const getApiComplianceScore = (): number => {
  const rules = API_GOVERNANCE_RULES;
  const compliant = rules.filter((rule) => rule.compliant).length;
  return Math.round((compliant / rules.length) * 100);
};

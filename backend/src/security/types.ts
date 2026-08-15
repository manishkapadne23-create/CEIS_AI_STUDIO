export type LicenseTierId =
  | "FREE"
  | "STANDARD"
  | "PRO"
  | "PRO_PLUS"
  | "INSTITUTION"
  | "ENTERPRISE";

export type SecurityAuditCategoryId =
  | "AUTH"
  | "AI"
  | "DOCUMENT"
  | "SUBSCRIPTION"
  | "WALLET"
  | "ADMIN"
  | "API"
  | "SECURITY";

export interface SecurityAuditInput {
  category: SecurityAuditCategoryId;
  eventType: string;
  userId?: string | null;
  tenantId?: string | null;
  actorId?: string | null;
  resource?: string | null;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  status?: "success" | "failure" | "denied";
  metadata?: Record<string, unknown>;
}

export interface DigitalWatermark {
  documentId: string;
  timestamp: string;
  version: string;
  workspaceId: string | null;
  userId: string | null;
  tenantId: string | null;
  contentType: string;
  integrityHash: string;
  digitalSignature: string;
  invisibleMetadata: Record<string, string>;
}

export interface LicenseValidationResult {
  valid: boolean;
  tier: LicenseTierId;
  features: string[];
  expiresAt: string | null;
}

export interface SecurityMonitorEvent {
  eventType: string;
  severity: "info" | "warning" | "critical";
  sourceIp?: string | null;
  userId?: string | null;
  description: string;
  metadata?: Record<string, unknown>;
}

export interface EsipfPublicConfig {
  engine: string;
  version: string;
  licenseTiers: Array<{ id: string; label: string; features: string[] }>;
  auditEvents: Array<{ type: string; category: string; label: string }>;
  featureFlags: Record<string, { label: string; minTier: string }>;
  complianceFrameworks: Array<{ id: string; label: string; status: string }>;
  protectedAssets: string[];
  capabilities: {
    encryption: boolean;
    refreshTokens: boolean;
    requestSigning: boolean;
    responseSigning: boolean;
    watermarking: boolean;
    licenseValidation: boolean;
    auditLogging: boolean;
    securityMonitoring: boolean;
    encryptedBackup: boolean;
  };
}

export interface EsipfSecurityPackage {
  engine: "Enterprise Security, IP Protection & Anti-Reverse Engineering Framework";
  version: string;
  environmentVerified: boolean;
  tamperDetected: boolean;
  license: LicenseValidationResult | null;
  generatedAt: string;
}

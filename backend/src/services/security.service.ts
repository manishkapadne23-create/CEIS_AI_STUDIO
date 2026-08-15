import {
  createDatabaseBackup,
  getBackupPolicy,
  getEsipfPublicConfig,
  getSecurityEngineConfig,
  listSecurityAuditLogs,
  listSecurityEvents,
  logSecurityAudit,
  runSecurityEngine,
  updateUserLicense,
  validateUserLicense,
  validateBackupRecovery,
} from "../security/index.js";

export const getEsipfConfig = () => getEsipfPublicConfig();

export const getSecurityStatus = async (userId?: string | null) =>
  runSecurityEngine(userId);

export const getUserLicense = (userId: string) => validateUserLicense(userId);

export const changeUserLicense = async (
  userId: string,
  input: Parameters<typeof updateUserLicense>[1]
) => {
  const license = await updateUserLicense(userId, input);
  await logSecurityAudit({
    category: "SUBSCRIPTION",
    eventType: "subscription.change",
    userId,
    actorId: userId,
    metadata: { tier: license.tier },
  });
  return license;
};

export const queryAuditLogs = listSecurityAuditLogs;
export const querySecurityEvents = listSecurityEvents;

export const runBackup = createDatabaseBackup;
export const getBackupConfig = getBackupPolicy;
export const validateBackup = validateBackupRecovery;

export const getEngineConfig = () => getSecurityEngineConfig();

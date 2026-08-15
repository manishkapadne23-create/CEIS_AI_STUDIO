-- CreateEnum
CREATE TYPE "LicenseTier" AS ENUM ('FREE', 'STANDARD', 'PRO', 'PRO_PLUS', 'INSTITUTION', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SecurityAuditCategory" AS ENUM ('AUTH', 'AI', 'DOCUMENT', 'SUBSCRIPTION', 'WALLET', 'ADMIN', 'API', 'SECURITY');

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_licenses" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tenantId" TEXT,
    "tier" "LicenseTier" NOT NULL DEFAULT 'FREE',
    "features" JSONB,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "offlineKey" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audit_logs" (
    "id" TEXT NOT NULL,
    "category" "SecurityAuditCategory" NOT NULL,
    "eventType" TEXT NOT NULL,
    "userId" TEXT,
    "tenantId" TEXT,
    "actorId" TEXT,
    "resource" TEXT,
    "resourceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "status" TEXT NOT NULL DEFAULT 'success',
    "metadata" JSONB,
    "integrityHash" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_events" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "sourceIp" TEXT,
    "userId" TEXT,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "user_licenses_userId_key" ON "user_licenses"("userId");

-- CreateIndex
CREATE INDEX "user_licenses_tenantId_idx" ON "user_licenses"("tenantId");

-- CreateIndex
CREATE INDEX "user_licenses_tier_idx" ON "user_licenses"("tier");

-- CreateIndex
CREATE INDEX "security_audit_logs_userId_createdAt_idx" ON "security_audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "security_audit_logs_category_createdAt_idx" ON "security_audit_logs"("category", "createdAt");

-- CreateIndex
CREATE INDEX "security_audit_logs_eventType_createdAt_idx" ON "security_audit_logs"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "security_events_eventType_createdAt_idx" ON "security_events"("eventType", "createdAt");

-- CreateIndex
CREATE INDEX "security_events_severity_resolved_idx" ON "security_events"("severity", "resolved");

-- CreateEnum
CREATE TYPE "EvidenceTrustLevel" AS ENUM ('VERIFIED', 'HIGH_CONFIDENCE', 'MEDIUM_CONFIDENCE', 'LOW_CONFIDENCE', 'INSUFFICIENT_EVIDENCE');
CREATE TYPE "EvidenceCitationType" AS ENUM ('ENGINEERING_STANDARD', 'CLAUSE_REFERENCE', 'DESIGN_MANUAL', 'SPECIFICATION', 'RESEARCH_PAPER', 'COMPANY_KNOWLEDGE', 'USER_DOCUMENT', 'AI_GENERATED');

-- CreateTable
CREATE TABLE "evidence_audit_logs" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT,
    "userMessage" TEXT,
    "aiProvider" TEXT,
    "aiModel" TEXT,
    "trustLevel" "EvidenceTrustLevel",
    "confidenceScore" DOUBLE PRECISION,
    "evidenceCount" INTEGER NOT NULL DEFAULT 0,
    "citationCount" INTEGER NOT NULL DEFAULT 0,
    "knowledgeSources" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "evidenceUsed" JSONB,
    "actorId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "evidence_audit_logs_trustLevel_createdAt_idx" ON "evidence_audit_logs"("trustLevel", "createdAt");
CREATE INDEX "evidence_audit_logs_conversationId_createdAt_idx" ON "evidence_audit_logs"("conversationId", "createdAt");
CREATE INDEX "evidence_audit_logs_actorId_createdAt_idx" ON "evidence_audit_logs"("actorId", "createdAt");

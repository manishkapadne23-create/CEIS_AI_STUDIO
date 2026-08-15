-- CreateEnum
CREATE TYPE "EmaceCollaborationEventType" AS ENUM ('REQUEST_ANALYZED', 'AGENT_EXECUTED', 'AGENT_COLLABORATION', 'CONFLICT_DETECTED', 'CONFLICT_RESOLVED', 'RESPONSE_COMPOSED');

-- CreateTable
CREATE TABLE "emace_user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "multiAgentEnabled" BOOLEAN NOT NULL DEFAULT true,
    "manualMode" BOOLEAN NOT NULL DEFAULT false,
    "enabledAgentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "disabledAgentIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "subscriptionPlan" TEXT NOT NULL DEFAULT 'free',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emace_user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emace_collaboration_audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "conversationId" TEXT,
    "eventType" "EmaceCollaborationEventType" NOT NULL,
    "agentId" TEXT,
    "summary" TEXT,
    "payload" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "emace_collaboration_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "emace_user_preferences_userId_key" ON "emace_user_preferences"("userId");

-- CreateIndex
CREATE INDEX "emace_collaboration_audit_logs_userId_createdAt_idx" ON "emace_collaboration_audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "emace_collaboration_audit_logs_conversationId_createdAt_idx" ON "emace_collaboration_audit_logs"("conversationId", "createdAt");

-- CreateIndex
CREATE INDEX "emace_collaboration_audit_logs_eventType_createdAt_idx" ON "emace_collaboration_audit_logs"("eventType", "createdAt");

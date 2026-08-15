-- CreateEnum
CREATE TYPE "EdEngineerInsightType" AS ENUM ('WEEKLY_SUMMARY', 'MONTHLY_LEARNING', 'SKILL_GROWTH', 'ACTIVITY_REPORT');

-- CreateEnum
CREATE TYPE "EdEngineerActivitySignalType" AS ENUM ('STANDARD', 'CALCULATOR', 'TEMPLATE', 'REPORT', 'TOPIC', 'AGENT', 'WORKFLOW', 'DOCUMENT', 'CLAUSE');

-- CreateTable
CREATE TABLE "ed_engineer_profiles" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "primaryDisciplineId" TEXT,
    "primaryDisciplineName" TEXT,
    "secondaryDisciplineId" TEXT,
    "secondaryDisciplineName" TEXT,
    "specializationIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "specializationNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "yearsOfExperience" INTEGER,
    "industry" TEXT,
    "preferredStandards" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredDesignMethods" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "preferredUnits" TEXT NOT NULL DEFAULT 'metric',
    "preferredSoftware" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "languagePreferences" TEXT[] DEFAULT ARRAY['en']::TEXT[],
    "workingStyle" JSONB,
    "expertise" JSONB,
    "personalLibrary" JSONB,
    "learningEnabled" BOOLEAN NOT NULL DEFAULT true,
    "metadata" JSONB,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ed_engineer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ed_engineer_activity_signals" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "signalType" "EdEngineerActivitySignalType" NOT NULL,
    "resourceId" TEXT,
    "resourceLabel" TEXT,
    "disciplineId" TEXT,
    "usageCount" INTEGER NOT NULL DEFAULT 1,
    "lastUsedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ed_engineer_activity_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ed_engineer_insight_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insightType" "EdEngineerInsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ed_engineer_insight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ed_engineer_profiles_userId_key" ON "ed_engineer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ed_engineer_activity_signals_userId_signalType_resourceId_key" ON "ed_engineer_activity_signals"("userId", "signalType", "resourceId");

-- CreateIndex
CREATE INDEX "ed_engineer_activity_signals_userId_signalType_lastUsedAt_idx" ON "ed_engineer_activity_signals"("userId", "signalType", "lastUsedAt");

-- CreateIndex
CREATE INDEX "ed_engineer_insight_logs_userId_insightType_createdAt_idx" ON "ed_engineer_insight_logs"("userId", "insightType", "createdAt");

-- AddForeignKey
ALTER TABLE "ed_engineer_activity_signals" ADD CONSTRAINT "ed_engineer_activity_signals_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ed_engineer_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ed_engineer_insight_logs" ADD CONSTRAINT "ed_engineer_insight_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "ed_engineer_profiles"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

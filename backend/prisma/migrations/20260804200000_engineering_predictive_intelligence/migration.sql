-- CreateEnum
CREATE TYPE "PredictiveInsightType" AS ENUM ('RECOMMENDATION', 'TIMELINE', 'REMINDER', 'RISK', 'LEARNING', 'PROJECT', 'COACH');

-- CreateTable
CREATE TABLE "predictive_user_preferences" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "predictiveEnabled" BOOLEAN NOT NULL DEFAULT true,
    "recommendationsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "timelineEnabled" BOOLEAN NOT NULL DEFAULT true,
    "remindersEnabled" BOOLEAN NOT NULL DEFAULT true,
    "riskPredictionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "learningPredictionEnabled" BOOLEAN NOT NULL DEFAULT true,
    "projectAwarenessEnabled" BOOLEAN NOT NULL DEFAULT true,
    "aiCoachEnabled" BOOLEAN NOT NULL DEFAULT true,
    "shareBehaviorData" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "predictive_user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictive_insight_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insightType" "PredictiveInsightType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "confidence" DOUBLE PRECISION,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictive_insight_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "predictive_user_preferences_userId_key" ON "predictive_user_preferences"("userId");

-- CreateIndex
CREATE INDEX "predictive_insight_logs_userId_insightType_createdAt_idx" ON "predictive_insight_logs"("userId", "insightType", "createdAt");

-- AddForeignKey
ALTER TABLE "predictive_insight_logs" ADD CONSTRAINT "predictive_insight_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "predictive_user_preferences"("userId") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "EssaeScenarioType" AS ENUM ('DESIGN_ALTERNATIVES', 'MATERIAL_ALTERNATIVES', 'CONSTRUCTION_METHODS', 'EQUIPMENT_SELECTION', 'TECHNOLOGY_COMPARISON', 'COST_SCENARIOS', 'SCHEDULE_SCENARIOS', 'RISK_SCENARIOS', 'ENVIRONMENTAL_SCENARIOS', 'MAINTENANCE_SCENARIOS');

-- CreateEnum
CREATE TYPE "EssaeScenarioStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPARED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "essae_simulation_workspaces" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "disciplineId" TEXT,
    "disciplineName" TEXT,
    "specializationId" TEXT,
    "specializationName" TEXT,
    "projectId" TEXT,
    "projectName" TEXT,
    "status" TEXT NOT NULL DEFAULT 'active',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essae_simulation_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essae_scenarios" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenarioType" "EssaeScenarioType" NOT NULL,
    "disciplineId" TEXT,
    "disciplineName" TEXT,
    "description" TEXT,
    "assumptions" JSONB,
    "parameters" JSONB,
    "options" JSONB NOT NULL,
    "status" "EssaeScenarioStatus" NOT NULL DEFAULT 'DRAFT',
    "version" INTEGER NOT NULL DEFAULT 1,
    "parentScenarioId" TEXT,
    "results" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "essae_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "essae_scenario_comparisons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceId" TEXT,
    "title" TEXT NOT NULL,
    "scenarioIds" TEXT[],
    "comparisonMatrix" JSONB NOT NULL,
    "results" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "essae_scenario_comparisons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "essae_simulation_workspaces_userId_slug_key" ON "essae_simulation_workspaces"("userId", "slug");

-- CreateIndex
CREATE INDEX "essae_simulation_workspaces_userId_updatedAt_idx" ON "essae_simulation_workspaces"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "essae_simulation_workspaces_disciplineId_idx" ON "essae_simulation_workspaces"("disciplineId");

-- CreateIndex
CREATE INDEX "essae_scenarios_workspaceId_scenarioType_idx" ON "essae_scenarios"("workspaceId", "scenarioType");

-- CreateIndex
CREATE INDEX "essae_scenarios_userId_updatedAt_idx" ON "essae_scenarios"("userId", "updatedAt");

-- CreateIndex
CREATE INDEX "essae_scenario_comparisons_userId_createdAt_idx" ON "essae_scenario_comparisons"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "essae_scenario_comparisons_workspaceId_createdAt_idx" ON "essae_scenario_comparisons"("workspaceId", "createdAt");

-- AddForeignKey
ALTER TABLE "essae_scenarios" ADD CONSTRAINT "essae_scenarios_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "essae_simulation_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

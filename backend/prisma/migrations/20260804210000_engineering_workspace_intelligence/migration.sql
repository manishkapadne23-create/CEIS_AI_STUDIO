-- CreateEnum
CREATE TYPE "EngineeringWorkspaceType" AS ENUM ('PERSONAL', 'PROJECT', 'DISCIPLINE', 'SPECIALIZATION', 'INSTITUTION', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "EngineeringWorkspaceStatus" AS ENUM ('ACTIVE', 'ARCHIVED', 'DELETED');

-- CreateEnum
CREATE TYPE "EngineeringWorkspaceItemType" AS ENUM ('AI_CONVERSATION', 'ENGINEERING_DOCUMENT', 'STANDARD', 'CALCULATION', 'REPORT', 'TEMPLATE', 'CHECKLIST', 'NOTE', 'BOOKMARK', 'ENGINEERING_DECISION', 'ENGINEERING_EVIDENCE', 'GENERATED_FILE');

-- CreateEnum
CREATE TYPE "EngineeringWorkspaceItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "engineering_workspaces" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "workspaceType" "EngineeringWorkspaceType" NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "disciplineId" TEXT,
    "specializationId" TEXT,
    "projectId" TEXT,
    "projectName" TEXT,
    "clientName" TEXT,
    "institutionId" TEXT,
    "enterpriseId" TEXT,
    "topic" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "EngineeringWorkspaceStatus" NOT NULL DEFAULT 'ACTIVE',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "isShared" BOOLEAN NOT NULL DEFAULT false,
    "version" INTEGER NOT NULL DEFAULT 1,
    "metadata" JSONB,
    "lastActivityAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "archivedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "engineering_workspaces_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_items" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "itemType" "EngineeringWorkspaceItemType" NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "content" JSONB,
    "externalRef" TEXT,
    "disciplineId" TEXT,
    "specializationId" TEXT,
    "topic" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "EngineeringWorkspaceItemStatus" NOT NULL DEFAULT 'ACTIVE',
    "version" INTEGER NOT NULL DEFAULT 1,
    "isDraft" BOOLEAN NOT NULL DEFAULT false,
    "isComplete" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_workspace_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_versions" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "snapshot" JSONB NOT NULL,
    "changeSummary" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engineering_workspace_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_item_versions" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" JSONB,
    "snapshot" JSONB,
    "changeSummary" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engineering_workspace_item_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_search_index" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "searchText" TEXT NOT NULL,
    "keywordTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_workspace_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_access" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'viewer',
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isFavourite" BOOLEAN NOT NULL DEFAULT false,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engineering_workspace_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_sync_state" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "lastSyncedAt" TIMESTAMP(3),
    "syncVersion" INTEGER NOT NULL DEFAULT 0,
    "cloudBackupEnabled" BOOLEAN NOT NULL DEFAULT false,
    "offlineEnabled" BOOLEAN NOT NULL DEFAULT false,
    "enterpriseStorageUri" TEXT,
    "metadata" JSONB,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_workspace_sync_state_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_workspace_activities" (
    "id" TEXT NOT NULL,
    "workspaceId" TEXT NOT NULL,
    "userId" TEXT,
    "action" TEXT NOT NULL,
    "itemId" TEXT,
    "summary" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "engineering_workspace_activities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspaces_userId_slug_key" ON "engineering_workspaces"("userId", "slug");

-- CreateIndex
CREATE INDEX "engineering_workspaces_userId_status_lastActivityAt_idx" ON "engineering_workspaces"("userId", "status", "lastActivityAt");

-- CreateIndex
CREATE INDEX "engineering_workspaces_userId_workspaceType_idx" ON "engineering_workspaces"("userId", "workspaceType");

-- CreateIndex
CREATE INDEX "engineering_workspaces_disciplineId_specializationId_idx" ON "engineering_workspaces"("disciplineId", "specializationId");

-- CreateIndex
CREATE INDEX "engineering_workspaces_projectId_idx" ON "engineering_workspaces"("projectId");

-- CreateIndex
CREATE INDEX "engineering_workspaces_tags_idx" ON "engineering_workspaces" USING GIN ("tags");

-- CreateIndex
CREATE INDEX "engineering_workspace_items_workspaceId_itemType_updatedAt_idx" ON "engineering_workspace_items"("workspaceId", "itemType", "updatedAt");

-- CreateIndex
CREATE INDEX "engineering_workspace_items_workspaceId_status_idx" ON "engineering_workspace_items"("workspaceId", "status");

-- CreateIndex
CREATE INDEX "engineering_workspace_items_tags_idx" ON "engineering_workspace_items" USING GIN ("tags");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspace_versions_workspaceId_versionNumber_key" ON "engineering_workspace_versions"("workspaceId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspace_item_versions_itemId_versionNumber_key" ON "engineering_workspace_item_versions"("itemId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspace_search_index_workspaceId_key" ON "engineering_workspace_search_index"("workspaceId");

-- CreateIndex
CREATE INDEX "engineering_workspace_search_index_keywordTokens_idx" ON "engineering_workspace_search_index" USING GIN ("keywordTokens");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspace_access_workspaceId_userId_key" ON "engineering_workspace_access"("workspaceId", "userId");

-- CreateIndex
CREATE INDEX "engineering_workspace_access_userId_isPinned_idx" ON "engineering_workspace_access"("userId", "isPinned");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_workspace_sync_state_workspaceId_key" ON "engineering_workspace_sync_state"("workspaceId");

-- CreateIndex
CREATE INDEX "engineering_workspace_activities_workspaceId_createdAt_idx" ON "engineering_workspace_activities"("workspaceId", "createdAt");

-- CreateIndex
CREATE INDEX "engineering_workspace_activities_userId_createdAt_idx" ON "engineering_workspace_activities"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "engineering_workspace_items" ADD CONSTRAINT "engineering_workspace_items_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_versions" ADD CONSTRAINT "engineering_workspace_versions_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_item_versions" ADD CONSTRAINT "engineering_workspace_item_versions_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "engineering_workspace_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_search_index" ADD CONSTRAINT "engineering_workspace_search_index_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_access" ADD CONSTRAINT "engineering_workspace_access_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_sync_state" ADD CONSTRAINT "engineering_workspace_sync_state_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_workspace_activities" ADD CONSTRAINT "engineering_workspace_activities_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "engineering_workspaces"("id") ON DELETE CASCADE ON UPDATE CASCADE;

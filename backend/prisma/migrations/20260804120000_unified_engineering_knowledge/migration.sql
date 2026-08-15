-- CreateEnum
CREATE TYPE "EngineeringKnowledgeItemStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "engineering_disciplines" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT,
    "description" TEXT,
    "color" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_disciplines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_specializations" (
    "id" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_specializations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_knowledge_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_knowledge_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_knowledge_items" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "specializationId" TEXT,
    "categoryId" TEXT NOT NULL,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "language" TEXT NOT NULL DEFAULT 'en',
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "source" TEXT,
    "status" "EngineeringKnowledgeItemStatus" NOT NULL DEFAULT 'DRAFT',
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_knowledge_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "engineering_knowledge_search_index" (
    "id" TEXT NOT NULL,
    "knowledgeItemId" TEXT NOT NULL,
    "searchText" TEXT NOT NULL,
    "keywordTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "embedding" JSONB,
    "embeddingModel" TEXT,
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "engineering_knowledge_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "engineering_disciplines_active_displayOrder_idx" ON "engineering_disciplines"("active", "displayOrder");

-- CreateIndex
CREATE INDEX "engineering_specializations_disciplineId_displayOrder_idx" ON "engineering_specializations"("disciplineId", "displayOrder");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_specializations_disciplineId_name_key" ON "engineering_specializations"("disciplineId", "name");

-- CreateIndex
CREATE INDEX "engineering_knowledge_categories_active_displayOrder_idx" ON "engineering_knowledge_categories"("active", "displayOrder");

-- CreateIndex
CREATE INDEX "engineering_knowledge_items_disciplineId_categoryId_idx" ON "engineering_knowledge_items"("disciplineId", "categoryId");

-- CreateIndex
CREATE INDEX "engineering_knowledge_items_specializationId_categoryId_idx" ON "engineering_knowledge_items"("specializationId", "categoryId");

-- CreateIndex
CREATE INDEX "engineering_knowledge_items_status_updatedAt_idx" ON "engineering_knowledge_items"("status", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "engineering_knowledge_search_index_knowledgeItemId_key" ON "engineering_knowledge_search_index"("knowledgeItemId");

-- CreateIndex
CREATE INDEX "engineering_knowledge_search_index_keywordTokens_idx" ON "engineering_knowledge_search_index" USING GIN ("keywordTokens");

-- Full-text search index for keyword retrieval
CREATE INDEX "engineering_knowledge_search_index_search_text_fts_idx"
ON "engineering_knowledge_search_index"
USING GIN (to_tsvector('english', "searchText"));

-- AddForeignKey
ALTER TABLE "engineering_specializations" ADD CONSTRAINT "engineering_specializations_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "engineering_disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_knowledge_items" ADD CONSTRAINT "engineering_knowledge_items_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "engineering_disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_knowledge_items" ADD CONSTRAINT "engineering_knowledge_items_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "engineering_specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_knowledge_items" ADD CONSTRAINT "engineering_knowledge_items_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "engineering_knowledge_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "engineering_knowledge_search_index" ADD CONSTRAINT "engineering_knowledge_search_index_knowledgeItemId_fkey" FOREIGN KEY ("knowledgeItemId") REFERENCES "engineering_knowledge_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

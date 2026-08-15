-- CreateEnum
CREATE TYPE "EdmMemoryEntryStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');
CREATE TYPE "EdmRelationType" AS ENUM ('DOCUMENT', 'CALCULATOR', 'STANDARD', 'PROJECT');
CREATE TYPE "EdmEmbeddingStatus" AS ENUM ('PENDING', 'PROCESSING', 'READY', 'FAILED');
CREATE TYPE "EdmAuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'SEARCH', 'INDEX', 'EMBEDDING_REGISTER');

-- CreateTable
CREATE TABLE "edm_memory_entries" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "disciplineId" TEXT NOT NULL,
    "specializationId" TEXT,
    "categoryId" TEXT NOT NULL,
    "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "summary" TEXT,
    "author" TEXT,
    "organization" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0.0',
    "source" TEXT,
    "documentDate" TIMESTAMP(3),
    "language" TEXT NOT NULL DEFAULT 'en',
    "aiGeneratedSummary" TEXT,
    "projectType" TEXT,
    "standardNumbers" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" "EdmMemoryEntryStatus" NOT NULL DEFAULT 'DRAFT',
    "createdById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edm_memory_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edm_memory_relations" (
    "id" TEXT NOT NULL,
    "sourceEntryId" TEXT NOT NULL,
    "relationType" "EdmRelationType" NOT NULL,
    "targetEntryId" TEXT,
    "externalRef" TEXT,
    "label" TEXT,
    "metadata" JSONB,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "edm_memory_relations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edm_document_assets" (
    "id" TEXT NOT NULL,
    "memoryEntryId" TEXT NOT NULL,
    "documentTypeId" TEXT NOT NULL,
    "fileName" TEXT,
    "mimeType" TEXT,
    "storageUri" TEXT,
    "fileSizeBytes" BIGINT,
    "checksum" TEXT,
    "metadata" JSONB,
    "status" TEXT NOT NULL DEFAULT 'registered',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edm_document_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edm_search_index" (
    "id" TEXT NOT NULL,
    "memoryEntryId" TEXT NOT NULL,
    "searchText" TEXT NOT NULL,
    "keywordTokens" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "indexedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edm_search_index_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edm_embeddings" (
    "id" TEXT NOT NULL,
    "memoryEntryId" TEXT NOT NULL,
    "vector" JSONB,
    "dimensions" INTEGER,
    "modelId" TEXT,
    "modelVersion" TEXT,
    "status" "EdmEmbeddingStatus" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "edm_embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "edm_audit_logs" (
    "id" TEXT NOT NULL,
    "memoryEntryId" TEXT,
    "action" "EdmAuditAction" NOT NULL,
    "actorId" TEXT,
    "actorEmail" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "edm_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "edm_memory_entries_disciplineId_categoryId_status_idx" ON "edm_memory_entries"("disciplineId", "categoryId", "status");
CREATE INDEX "edm_memory_entries_specializationId_status_idx" ON "edm_memory_entries"("specializationId", "status");
CREATE INDEX "edm_memory_entries_author_idx" ON "edm_memory_entries"("author");
CREATE INDEX "edm_memory_entries_projectType_idx" ON "edm_memory_entries"("projectType");
CREATE INDEX "edm_memory_entries_documentDate_idx" ON "edm_memory_entries"("documentDate");
CREATE INDEX "edm_memory_entries_standardNumbers_idx" ON "edm_memory_entries" USING GIN ("standardNumbers");
CREATE INDEX "edm_memory_entries_tags_idx" ON "edm_memory_entries" USING GIN ("tags");
CREATE INDEX "edm_memory_entries_keywords_idx" ON "edm_memory_entries" USING GIN ("keywords");

-- CreateIndex
CREATE INDEX "edm_memory_relations_sourceEntryId_relationType_idx" ON "edm_memory_relations"("sourceEntryId", "relationType");
CREATE INDEX "edm_memory_relations_targetEntryId_idx" ON "edm_memory_relations"("targetEntryId");

-- CreateIndex
CREATE INDEX "edm_document_assets_memoryEntryId_documentTypeId_idx" ON "edm_document_assets"("memoryEntryId", "documentTypeId");

-- CreateIndex
CREATE UNIQUE INDEX "edm_search_index_memoryEntryId_key" ON "edm_search_index"("memoryEntryId");
CREATE INDEX "edm_search_index_keywordTokens_idx" ON "edm_search_index" USING GIN ("keywordTokens");
CREATE INDEX "edm_search_index_search_text_fts_idx" ON "edm_search_index" USING GIN (to_tsvector('english', "searchText"));

-- CreateIndex
CREATE UNIQUE INDEX "edm_embeddings_memoryEntryId_key" ON "edm_embeddings"("memoryEntryId");
CREATE INDEX "edm_embeddings_status_updatedAt_idx" ON "edm_embeddings"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "edm_audit_logs_action_createdAt_idx" ON "edm_audit_logs"("action", "createdAt");
CREATE INDEX "edm_audit_logs_memoryEntryId_createdAt_idx" ON "edm_audit_logs"("memoryEntryId", "createdAt");
CREATE INDEX "edm_audit_logs_actorId_createdAt_idx" ON "edm_audit_logs"("actorId", "createdAt");

-- AddForeignKey
ALTER TABLE "edm_memory_entries" ADD CONSTRAINT "edm_memory_entries_disciplineId_fkey" FOREIGN KEY ("disciplineId") REFERENCES "engineering_disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "edm_memory_entries" ADD CONSTRAINT "edm_memory_entries_specializationId_fkey" FOREIGN KEY ("specializationId") REFERENCES "engineering_specializations"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "edm_memory_entries" ADD CONSTRAINT "edm_memory_entries_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "engineering_knowledge_categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edm_memory_relations" ADD CONSTRAINT "edm_memory_relations_sourceEntryId_fkey" FOREIGN KEY ("sourceEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "edm_memory_relations" ADD CONSTRAINT "edm_memory_relations_targetEntryId_fkey" FOREIGN KEY ("targetEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edm_document_assets" ADD CONSTRAINT "edm_document_assets_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edm_search_index" ADD CONSTRAINT "edm_search_index_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edm_embeddings" ADD CONSTRAINT "edm_embeddings_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "edm_audit_logs" ADD CONSTRAINT "edm_audit_logs_memoryEntryId_fkey" FOREIGN KEY ("memoryEntryId") REFERENCES "edm_memory_entries"("id") ON DELETE SET NULL ON UPDATE CASCADE;

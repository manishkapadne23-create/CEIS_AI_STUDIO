import type {
  EdmAuditAction,
  EdmEmbeddingStatus,
  EdmMemoryEntryStatus,
  EdmRelationType,
  Prisma,
} from "@prisma/client";

export interface EdmRelationInput {
  relationType: EdmRelationType;
  targetEntryId?: string | null;
  externalRef?: string | null;
  label?: string | null;
  metadata?: Prisma.InputJsonValue;
  displayOrder?: number;
}

export interface EdmDocumentAssetInput {
  documentTypeId: string;
  fileName?: string | null;
  mimeType?: string | null;
  storageUri?: string | null;
  fileSizeBytes?: bigint | number | null;
  checksum?: string | null;
  metadata?: Prisma.InputJsonValue;
  status?: string;
}

export interface CreateEdmEntryInput {
  title: string;
  disciplineId: string;
  specializationId?: string | null;
  categoryId: string;
  keywords?: string[];
  tags?: string[];
  summary?: string | null;
  author?: string | null;
  organization?: string | null;
  version?: string;
  source?: string | null;
  documentDate?: Date | string | null;
  language?: string;
  aiGeneratedSummary?: string | null;
  projectType?: string | null;
  standardNumbers?: string[];
  status?: EdmMemoryEntryStatus;
  createdById?: string | null;
  relations?: EdmRelationInput[];
  documentAssets?: EdmDocumentAssetInput[];
}

export interface UpdateEdmEntryInput {
  title?: string;
  specializationId?: string | null;
  categoryId?: string;
  keywords?: string[];
  tags?: string[];
  summary?: string | null;
  author?: string | null;
  organization?: string | null;
  version?: string;
  source?: string | null;
  documentDate?: Date | string | null;
  language?: string;
  aiGeneratedSummary?: string | null;
  projectType?: string | null;
  standardNumbers?: string[];
  status?: EdmMemoryEntryStatus;
  relations?: EdmRelationInput[];
  documentAssets?: EdmDocumentAssetInput[];
}

export interface ListEdmEntriesFilter {
  disciplineId?: string;
  specializationId?: string;
  categoryId?: string;
  author?: string;
  projectType?: string;
  status?: EdmMemoryEntryStatus;
  tags?: string[];
  skip?: number;
  take?: number;
}

export interface EdmGlobalSearchFilter {
  q?: string;
  standardNumber?: string;
  projectType?: string;
  disciplineId?: string;
  categoryId?: string;
  author?: string;
  tags?: string[];
  language?: string;
  status?: EdmMemoryEntryStatus;
  limit?: number;
}

export interface EdmSemanticSearchInput {
  queryEmbedding: number[];
  filter?: Omit<EdmGlobalSearchFilter, "q">;
}

export interface EdmAuditContext {
  actorId?: string | null;
  actorEmail?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface EdmAuditRecordInput extends EdmAuditContext {
  memoryEntryId?: string | null;
  action: EdmAuditAction;
  metadata?: Prisma.InputJsonValue;
}

export interface RegisterEdmEmbeddingInput {
  memoryEntryId: string;
  modelId?: string;
  modelVersion?: string;
  dimensions?: number;
  vector?: number[];
  status?: EdmEmbeddingStatus;
}

export type { EdmAuditAction, EdmEmbeddingStatus, EdmMemoryEntryStatus, EdmRelationType };

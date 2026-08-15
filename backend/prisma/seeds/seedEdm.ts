import type { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { loadSpecializationsConfig } from "./loadKnowledgeConfig.js";

interface EdmSampleEntry {
  id: string;
  title: string;
  disciplineId: string;
  categoryId: string;
  keywords: string[];
  tags: string[];
  summary: string;
  author: string;
  organization: string;
  version: string;
  source: string;
  language: string;
  projectType?: string;
  standardNumbers?: string[];
  status: "DRAFT" | "REVIEW" | "PUBLISHED" | "ARCHIVED";
  relations?: Array<{
    relationType: "DOCUMENT" | "CALCULATOR" | "STANDARD" | "PROJECT";
    externalRef?: string;
    label?: string;
    targetEntryId?: string;
  }>;
  documentAssets?: Array<{
    documentTypeId: string;
    fileName?: string;
    status?: string;
  }>;
}

const configDir = join(dirname(fileURLToPath(import.meta.url)), "..", "config");

export const seedEdm = async (prisma: PrismaClient) => {
  const { specializations } = loadSpecializationsConfig();
  const sampleConfig = JSON.parse(
    readFileSync(join(configDir, "edmSampleEntries.json"), "utf-8")
  ) as { entries: EdmSampleEntry[] };

  const specializationByDiscipline = new Map<string, string>();
  for (const specialization of specializations) {
    if (!specializationByDiscipline.has(specialization.disciplineId)) {
      specializationByDiscipline.set(specialization.disciplineId, specialization.id);
    }
  }

  for (const sample of sampleConfig.entries) {
    const specializationId =
      specializationByDiscipline.get(sample.disciplineId) ?? null;

    const entry = await prisma.edmMemoryEntry.upsert({
      where: { id: sample.id },
      update: {
        title: sample.title,
        disciplineId: sample.disciplineId,
        specializationId,
        categoryId: sample.categoryId,
        keywords: sample.keywords,
        tags: sample.tags,
        summary: sample.summary,
        author: sample.author,
        organization: sample.organization,
        version: sample.version,
        source: sample.source,
        language: sample.language,
        projectType: sample.projectType ?? null,
        standardNumbers: sample.standardNumbers ?? [],
        status: sample.status,
        documentDate: new Date(),
      },
      create: {
        id: sample.id,
        title: sample.title,
        disciplineId: sample.disciplineId,
        specializationId,
        categoryId: sample.categoryId,
        keywords: sample.keywords,
        tags: sample.tags,
        summary: sample.summary,
        author: sample.author,
        organization: sample.organization,
        version: sample.version,
        source: sample.source,
        language: sample.language,
        projectType: sample.projectType ?? null,
        standardNumbers: sample.standardNumbers ?? [],
        status: sample.status,
        documentDate: new Date(),
      },
    });

    await prisma.edmMemoryRelation.deleteMany({
      where: { sourceEntryId: entry.id },
    });

    if (sample.relations?.length) {
      await prisma.edmMemoryRelation.createMany({
        data: sample.relations.map((relation, index) => ({
          sourceEntryId: entry.id,
          relationType: relation.relationType,
          targetEntryId: relation.targetEntryId ?? null,
          externalRef: relation.externalRef ?? null,
          label: relation.label ?? null,
          displayOrder: index,
        })),
      });
    }

    await prisma.edmDocumentAsset.deleteMany({
      where: { memoryEntryId: entry.id },
    });

    if (sample.documentAssets?.length) {
      await prisma.edmDocumentAsset.createMany({
        data: sample.documentAssets.map((asset) => ({
          memoryEntryId: entry.id,
          documentTypeId: asset.documentTypeId,
          fileName: asset.fileName ?? null,
          status: asset.status ?? "registered",
        })),
      });
    }

    const searchText = [
      entry.title,
      entry.summary,
      entry.author,
      entry.organization,
      entry.source,
      entry.projectType,
      ...entry.keywords,
      ...entry.tags,
      ...entry.standardNumbers,
    ]
      .filter(Boolean)
      .join(" ");

    const keywordTokens = searchText
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 1);

    await prisma.edmSearchIndex.upsert({
      where: { memoryEntryId: entry.id },
      update: { searchText, keywordTokens: Array.from(new Set(keywordTokens)) },
      create: {
        memoryEntryId: entry.id,
        searchText,
        keywordTokens: Array.from(new Set(keywordTokens)),
      },
    });

    await prisma.edmEmbedding.upsert({
      where: { memoryEntryId: entry.id },
      update: { status: "PENDING" },
      create: {
        memoryEntryId: entry.id,
        status: "PENDING",
        modelId: "pending-model",
        dimensions: 1536,
      },
    });
  }

  console.log(`EDM seeded: ${sampleConfig.entries.length} memory entries.`);
};
